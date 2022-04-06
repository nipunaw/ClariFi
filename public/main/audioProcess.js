const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Pitchfinder = require("pitchfinder");
const { PythonShell } = require("python-shell");
// FIR and FFT Analysis
const fft = require('fft-js').fft;
const fftUtil = require('fft-js').util;
const windowing = require('fft-windowing');
const Fili = require('fili');
//var ft = require('fourier-transform');
//var db = require('decibels');
// Smoothing and Plots
const smoothed_z_score = require("@joe_six/smoothed-z-score-peak-signal-detection");
const detect_peaks = require("@joe_six/duarte-watanabe-peak-detection");
//const { plot, Plot } = require("nodeplotlib");

const fftAnalysis = (rawData, sampleRate, test_type) => {
  let N = 65536;
  let win = windowing.hann(rawData.slice(0, N), N); //rawData.slice(0, N)
  let spectrum = fft(win); // 48000 > samples  //windowed
  let frequencies = fftUtil.fftFreq(spectrum, sampleRate); // Sample rate and coef is just used for length, and frequency step
  let magnitudes = fftUtil.fftMag(spectrum);  
  //let spectrum2 = ft(rawData.slice(0, N));
  //let decibels = spectrum2.map((value) => db.fromGain(value))

  // var fft_fili = new Fili.Fft(16384);
  // var fftResult = fft_fili.forward(rawData, 'blackman');
  // var magnitude = fft_fili.magnitude(fftResult);
  // var dB = fft_fili.magToDb(magnitude);
  console.log("##### META-DATA ON FFT-JS #####"); //TO-DO: Investigate FFT robustness
  console.log("Sample Rate: " + sampleRate);
  console.log("Length of raw data: " + rawData.length);
  console.log("Length of windowed data: " + win.length);
  console.log("Length of phasors: " + spectrum.length);
  console.log("Length of frequencies: " + frequencies.length);
  console.log("Length of magnitudes: " + magnitudes.length);
  console.log("");

  // let fftFreq = new Float32Array(fftData.length);
  // for (let i = 0; i < fftData.length; i++) {
  //   fftFreq[i] = i*((sampleRate/2)/(fftData.length));
  // }

  let s_magnitudes = new Array(N/2)

  for (let i = 0; i < N/2; i++) {
    s_magnitudes[i] = 20*Math.log10(2*magnitudes[i]/8192);
  }
  
  // graphFrequencySpectrum(fftFreq, fftData, {title: "AnalyserNode Frequency Spectrum"}); //{"logFreq": true}
  // graphFrequencySpectrum(frequencies, s_magnitudes, {title: "FFT-JS Frequency Spectrum"}); //{"scaleMagnitude": true, "logFreq": true}
  // graphFrequencySpectrum(frequencies, decibels, {title: "FFT-ASM Frequency Spectrum"});
  // graphFrequencySpectrum(frequencies, dB, {title: "FFT-Fili Frequency Spectrum"});
  return firFilterCoefficients(frequencies, s_magnitudes, sampleRate, test_type);
}

const firFilterCoefficients = (frequencies, magnitudes, sampleRate, test_type) => {
  // TO-DO: Continue testing smoothing methods, for now electing Watanabe method
  //const peaksSmoothed = smoothed_z_score(magnitudes, {lag: 40, threshold: 4.5, influence: 0.2});
  let lowerLim = 0
  let upperLim = sampleRate/2
  let mpd = 0
  
  if (test_type == "ambience") {
    upperLim = 150
    mpd = 500
  } else {
    lowerLim = 4000
    upperLim = 8000
    mpd = 5000
  }

  const noiseCoefficients = noiseRemoval(frequencies, magnitudes, sampleRate, lowerLim, upperLim, mpd);
  
  let options = {
    mode: "text",
    pythonOptions: ["-u"],
    args: ["t"].concat(noiseCoefficients.reverse()),
  };

  PythonShell.run("ftdi.py", options, function (err, results) {
    if (err) throw err;
    console.log("Script finished.");
    console.log('result: ', results.toString());
  });

  return noiseCoefficients; // Not used by Renderer process (sent by Python script)
}

const identifyPeaks = (magnitudes, mpdVal) => {
  //const magnitudesNoiseDescending = [...magnitudes].sort(function (a, b) {  return a - b;  }).reverse();
  //const magnitudesNoiseThreshold = magnitudesNoiseDescending[15]; // Assumes no more than 15 peaks
  return detect_peaks(magnitudes, {mpd: mpdVal, mph: -96});
}

// Helper function for graphing/testing
const graphFrequencySpectrum=(frequencies, magnitudes, params={}) => {
  
  if (frequencies.length != magnitudes.length) {
    console.log("Frequency bins length mismatches magnitude length")
    return
  }

  let length = frequencies.length;
  let xaxisType = params["logFreq"] || "log";
  let scaleMagnitude = params["scaleMagnitude"] || false;
  let fftSize = params["fftSize"] || 32768;
  let title = params["title"] || "Frequency Spectrum";
  let plotType = 'scatter';

  let graphFrequencies = new Array(length);
  let graphMagnitudes = new Array(length);


  for (let i = 0; i < length; i++) {
    graphFrequencies[i] = frequencies[i];
  }
  
  if (scaleMagnitude == true) {
    for (let i = 0; i < length; i++) {
      graphMagnitudes[i] = 20*Math.log10(2*magnitudes[i]/8192); //20*Math.log10(2*magnitudes[i]/fftSize)
    }
  } else {
    for (let i = 0; i < length; i++) {
      graphMagnitudes[i] = magnitudes[i];
    }
  }
  
  const data = [
    {
      x: graphFrequencies,
      y: graphMagnitudes,
      type: plotType
    }
  ];

  const layout = {
    title: title,
    xaxis: {
      title: "Frequency [Hz]",
      type: xaxisType
    },
    yaxis: {
      title: "Magnitude [dBFS]"
    }
  };
  
  plot(data, layout);
}

const bandstopCoefficients = (sampleRate, fallingEdgeFreq, risingEdgeFreq, attenuation, filterOrder) => {
  var firCalculator = new Fili.FirCoeffs();
  var firFilterCoeffsK = firCalculator.kbFilter({
    order: filterOrder, // filter order (must be odd)
    Fs: sampleRate, // sampling frequency
    Fa: risingEdgeFreq, // rise, 0 for lowpass
    Fb: fallingEdgeFreq, // fall, Fs/2 for highpass
    Att: attenuation // attenuation in dB
    // Assumption: Fa > Fb for band-stop (opposite for bandpass)
  });
  return firFilterCoeffsK;
}

const filterOrderAndAttenuation = (sampleRate, transitionWidth, attenuationDB) => {
  let attenuation = -20*Math.log10(Math.min(0.15, 10**(attenuationDB/-20))) // Passband ripple of 15% is permissible
  //console.log("Attenuation [dB]: " + attenuation);
  let filterOrder = Math.ceil((attenuation - 7.95)/(2*Math.PI*2.285*(transitionWidth/sampleRate))) //Kaiser formula
  //console.log("Filter order: " + filterOrder);

  return [filterOrder, attenuation]
}

const quantizeCoefficients = (filterCoefficients) => {
  let numBits = 8;
  let maxPos = (2**(numBits-1))-1;
  let maxNeg =  (2**(numBits-1));

  let order = filterCoefficients.length;
  let normalizedCoefficients = new Array(order);
  let quantizedCoefficients = new Array(order);
  let negativeIndices = []
  let max = Math.max.apply(null, filterCoefficients);

  for (let i = 0; i < order; i++) {
    
    normalizedCoefficients[i] = filterCoefficients[i]/max;
    if (normalizedCoefficients[i] < 0) {
      negativeIndices.push(i);
    }
  }

  for (let i = 0; i < order; i++) {
    quantizedCoefficients[i] = normalizedCoefficients[i] * maxPos;
  }

  for (let i = 0; i < negativeIndices.length; i++) {
    quantizedCoefficients[negativeIndices[i]] = normalizedCoefficients[negativeIndices[i]] * maxNeg;
  }

  for (let i = 0; i < order; i++) {
    quantizedCoefficients[i] = Math.round(quantizedCoefficients[i]);
  }

  return quantizedCoefficients
}

const noiseRemoval = (frequencies, magnitudes, sampleRate, lowerLim, upperLim, mpd) => {
  const peaksWatanabeIndices = identifyPeaks(magnitudes, mpd);
  let targetFrequencies = [];
  let targetMagnitudes = [];
  for (let i = 0; i < peaksWatanabeIndices.length; i++) {
    if (frequencies[peaksWatanabeIndices[i]] < upperLim && lowerLim < frequencies[peaksWatanabeIndices[i]]  ) {
      targetFrequencies.push(Math.round(frequencies[peaksWatanabeIndices[i]]));
      targetMagnitudes.push(Math.round(magnitudes[peaksWatanabeIndices[i]]))
    }
  }
  
  let orderAttenParams = []
  let maxFilterOrder = Number.MIN_VALUE; // Max filter order (min required for good results)
  for (let i = 0; i < targetFrequencies.length; i++) {
    orderAttenParams.push(filterOrderAndAttenuation(sampleRate, 30, 96-Math.abs(targetMagnitudes[i]))); // Attenuates by a meaningful value, 30Hz transition width
    //console.log("What we should attenuate by: " + (96-Math.abs(targetMagnitudes[i])));
    if (orderAttenParams[i][0] > maxFilterOrder) {
      maxFilterOrder = orderAttenParams[i][0]
    }
  }
  console.log("Max Filter Order:" + maxFilterOrder);

  let bandstopSet = [];
  for (let i = 0; i < targetFrequencies.length; i++) {
    if (targetFrequencies[i] > 5) { //Greater than 5Hz
      bandstopSet.push(bandstopCoefficients(sampleRate, targetFrequencies[i]-2, targetFrequencies[i]+2, orderAttenParams[i][1], maxFilterOrder));
    } else {
      bandstopSet.push(bandstopCoefficients(sampleRate, 0, targetFrequencies[i]+2, orderAttenParams[i][1], maxFilterOrder));
    }
  }

  console.log("Noisy lower frequencies: " + targetFrequencies);
  if (bandstopSet.length > 0) {
    // Safely assume independence of bands
    var sum = (r, a) => r.map((b, i) => a[i] + b);
    let noisyCoefficients = bandstopSet.reduce(sum);
    let quantizedNoisyCoefficients = quantizeCoefficients(noisyCoefficients);
    //console.log("Noisy Coefficients: " + noisyCoefficients);
    //console.log("Quantized Noisy Coefficients: " + quantizedNoisyCoefficients);
    return quantizedNoisyCoefficients;
  }
  return [];
  
}

const generalAnalysis = (frequencies, magnitudes) => {
  const magnitudesDescending = [...magnitudes].sort(function (a, b) {  return a - b;  }).reverse();
  const magnitudesThreshold = magnitudesDescending[15];

  for (let i = 0; i < frequencies.length; i++) {
    if (magnitudes[i] > magnitudesThreshold) {
      console.log("General Frequency (Hz): "+ frequencies[i] + ", Noise Magnitude: "+ magnitudes[i])
    }
  }
  console.log("");
}

// Deprecated analysis method using pitch values instead of FFT
const GetPitchValue = (recordedData) => {
  const detectPitch = Pitchfinder.AMDF();
  const pitch = detectPitch(recordedData);
  return pitch;
};

module.exports = {
  GetPitchValue: GetPitchValue,
  fftAnalysis: fftAnalysis
};