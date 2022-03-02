const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Pitchfinder = require("pitchfinder");
// FIR and FFT Analysis
const fft = require('fft-js').fft;
const fftUtil = require('fft-js').util;
const windowing = require('fft-windowing');
const Fili = require('fili');
// Smoothing and Plots
const smoothed_z_score = require("@joe_six/smoothed-z-score-peak-signal-detection");
const detect_peaks = require("@joe_six/duarte-watanabe-peak-detection")
const { plot, Plot} = require("nodeplotlib");

const fftAnalysis = (rawRecordedData, sampleRate, fftData) => {
  var windowedRecordedData = windowing.hann(rawRecordedData);
  var phasors = fft(windowedRecordedData.slice(0, 262144)); // 48000 > samples 
  var frequencies = fftUtil.fftFreq(phasors, sampleRate); // Sample rate and coef is just used for length, and frequency step
  var magnitudes = fftUtil.fftMag(phasors);

  console.log("Sample Rate: " + sampleRate);
  console.log("Length of raw data: " + rawRecordedData.length);
  console.log("Length of windowed data: " + windowedRecordedData.length);
  console.log("Length of phasors: " + phasors.length);
  console.log("Length of frequencies: " + frequencies.length);
  console.log("Length of magnitudes: " + magnitudes.length);
  console.log("");

  var fftFreq = [];
  for (let i =0; i < fftData.length; i++) { //TO-DO: Update to treat as bins rather than discrete values
    fftFreq.push((sampleRate/2)/(fftData.length)*i);
    fftData[i] = Math.round(Math.abs(fftData[i]));
  }
  graphFrequencies(fftFreq, fftData, false, true, 750, 32768, 'scatter');
  return firFilterTaps(frequencies, magnitudes, sampleRate);
}

const firFilterTaps = (frequencies, magnitudes, sampleRate) => {
  // TO-DO: Continue testing smoothing methods, for now electing Watanabe method
  //const peaksSmoothed = smoothed_z_score(magnitudes, {lag: 40, threshold: 4.5, influence: 0.2});
  graphFrequencies(frequencies, magnitudes, false, true, 750, 262144, 'scatter');
  const noiseTaps = noiseRemoval(frequencies, magnitudes, 101, sampleRate);
  return noiseTaps;
}

const identifyPeaks = (magnitudes, mpdVal) => {
  const magnitudesNoiseDescending = [...magnitudes].sort(function (a, b) {  return a - b;  }).reverse();
  const magnitudesNoiseThreshold = magnitudesNoiseDescending[15]; // Assumes no more than 15 peaks
  return detect_peaks(magnitudes, {mpd: mpdVal, mph: magnitudesNoiseThreshold});
}

// Helper function for graphing/testing
const graphFrequencies= (frequencies, magnitudes, logScale, limitLower, limitVal, fftSize, plotType) => {
  let graphFrequencies = [];
  let graphMagnitudes = [];
  if (logScale == true) {
    for (let i = 0; i < frequencies.length; i++) {
      graphFrequencies.push(Math.log10(frequencies[i]));
      graphMagnitudes.push(20*Math.log10((2*magnitudes[i])/fftSize)); 
    }
  } else if (limitLower == true) {
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] < limitVal) {
        graphFrequencies.push(frequencies[i]);
        graphMagnitudes.push(20*Math.log10((2*magnitudes[i])/fftSize)); 
      }
    }
  } else {
    for (let i = 0; i < frequencies.length; i++) {
      graphFrequencies.push(frequencies[i]);
      graphMagnitudes.push(20*Math.log10((2*magnitudes[i])/fftSize)); 
    }
  }
  
  const data = [
    {
      x: graphFrequencies,
      y: graphMagnitudes,
      type: plotType
    },
  ];
  
  plot(data);
}

const bandstopTaps = (filterOrder, sampleRate, lowerFreq, upperFreq, attenuation) => {
  var firCalculator = new Fili.FirCoeffs();
  var firFilterCoeffsK = firCalculator.kbFilter({
    order: filterOrder, // filter order (must be odd)
    Fs: sampleRate, // sampling frequency
    Fa: lowerFreq, // rise, 0 for lowpass
    Fb: upperFreq, // fall, Fs/2 for highpass
    Att: attenuation // attenuation in dB
  });
  return firFilterCoeffsK;
}

const noiseRemoval = (frequencies, magnitudes, filterOrder, sampleRate) => {
  const peaksWatanabeIndices = identifyPeaks(magnitudes, 50);
  let noisyFrequencies = [];
  for (let i = 0; i < peaksWatanabeIndices.length; i++) {
    if (frequencies[peaksWatanabeIndices[i]] < 80) {
      noisyFrequencies.push(Math.round(frequencies[peaksWatanabeIndices[i]]));
    }
  }

  
  let bands = [];
  for (let i = 0; i < noisyFrequencies.length; i++) {
    if (noisyFrequencies[i] > 5) {
      bands.push(bandstopTaps(filterOrder, sampleRate, noisyFrequencies[i]-5, noisyFrequencies[i]+5, 5)); //Attenuate by 5 dB, order of 101
    } else {
      bands.push(bandstopTaps(filterOrder, sampleRate, 0, noisyFrequencies[i]+5, 5)); //Attenuate by 5 dB, order of 101
    }
  }

  // Safely assume independence of bands
  // TO-DO: Handle edge case where bands is empty
  console.log(noisyFrequencies);
  var sum = (r, a) => r.map((b, i) => a[i] + b);
  let noisyTaps = bands.reduce(sum);

  return noisyTaps;
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
