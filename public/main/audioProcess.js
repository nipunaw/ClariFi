const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Pitchfinder = require("pitchfinder");
// FIR and FFT Analysis
const fft = require("fft-js").fft;
const fftUtil = require("fft-js").util;
const windowing = require("fft-windowing");
const Fili = require("fili");
var ft = require("fourier-transform");
var db = require("decibels");
// Smoothing and Plots
const smoothed_z_score = require("@joe_six/smoothed-z-score-peak-signal-detection");
const detect_peaks = require("@joe_six/duarte-watanabe-peak-detection");
const { plot, Plot } = require("nodeplotlib");

const fftAnalysis = (rawData, sampleRate, fftData) => {
  let N = 32768;
  let win = windowing.hann(rawData.slice(0, N), N); //rawData.slice(0, N),
  let spectrum = fft(win); // 48000 > samples
  let frequencies = fftUtil.fftFreq(spectrum, sampleRate); // Sample rate and coef is just used for length, and frequency step
  let magnitudes = fftUtil.fftMag(spectrum);
  let spectrum2 = ft(rawData.slice(0, N));
  let decibels = spectrum2.map((value) => db.fromGain(value));

  console.log("##### META-DATA ON FFT-JS #####");
  console.log("Sample Rate: " + sampleRate);
  console.log("Length of raw data: " + rawData.length);
  console.log("Length of windowed data: " + win.length);
  console.log("Length of phasors: " + spectrum.length);
  console.log("Length of frequencies: " + frequencies.length);
  console.log("Length of magnitudes: " + magnitudes.length);
  console.log("");

  let fftFreq = new Float32Array(fftData.length);
  for (let i = 0; i < fftData.length; i++) {
    fftFreq[i] = i * (sampleRate / 2 / fftData.length);
  }

  graphFrequencySpectrum(fftFreq, fftData, {
    title: "AnalyserNode Frequency Spectrum",
  }); //{"logFreq": true}
  graphFrequencySpectrum(frequencies, magnitudes, {
    title: "FFT-JS Frequency Spectrum",
  }); //{"scaleMagnitude": true, "logFreq": true}
  graphFrequencySpectrum(frequencies, decibels, {
    title: "FFT-ASM Frequency Spectrum",
  });
  return firFilterTaps(frequencies, magnitudes, sampleRate);
};

const firFilterTaps = (frequencies, magnitudes, sampleRate) => {
  // TO-DO: Continue testing smoothing methods, for now electing Watanabe method
  //const peaksSmoothed = smoothed_z_score(magnitudes, {lag: 40, threshold: 4.5, influence: 0.2});
  const noiseTaps = noiseRemoval(frequencies, magnitudes, 101, sampleRate, 150);
  return noiseTaps;
};

const identifyPeaks = (magnitudes, mpdVal) => {
  const magnitudesNoiseDescending = [...magnitudes]
    .sort(function (a, b) {
      return a - b;
    })
    .reverse();
  const magnitudesNoiseThreshold = magnitudesNoiseDescending[15]; // Assumes no more than 15 peaks
  return detect_peaks(magnitudes, {
    mpd: mpdVal,
    mph: magnitudesNoiseThreshold,
  });
};

// Helper function for graphing/testing
const graphFrequencySpectrum = (frequencies, magnitudes, params = {}) => {
  if (frequencies.length != magnitudes.length) {
    console.log("Frequency bins length mismatches magnitude length");
    return;
  }

  let length = frequencies.length;
  let xaxisType = params["logFreq"] || "log";
  let scaleMagnitude = params["scaleMagnitude"] || false;
  let fftSize = params["fftSize"] || 32768;
  let title = params["title"] || "Frequency Spectrum";
  let plotType = "scatter";

  let graphFrequencies = new Array(length);
  let graphMagnitudes = new Array(length);

  for (let i = 0; i < length; i++) {
    graphFrequencies[i] = frequencies[i];
  }

  if (scaleMagnitude == true) {
    for (let i = 0; i < length; i++) {
      graphMagnitudes[i] = 20 * Math.log10((2 * magnitudes[i]) / fftSize);
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
      type: plotType,
    },
  ];

  const layout = {
    title: title,
    xaxis: {
      title: "Frequency [Hz]",
      type: xaxisType,
    },
    yaxis: {
      title: "Magnitude [dBFS]",
    },
  };

  plot(data, layout);
};

const bandstopTaps = (
  filterOrder,
  sampleRate,
  lowerFreq,
  upperFreq,
  attenuation
) => {
  var firCalculator = new Fili.FirCoeffs();
  var firFilterCoeffsK = firCalculator.kbFilter({
    order: filterOrder, // filter order (must be odd)
    Fs: sampleRate, // sampling frequency
    Fa: lowerFreq, // rise, 0 for lowpass
    Fb: upperFreq, // fall, Fs/2 for highpass
    Att: attenuation, // attenuation in dB
  });
  return firFilterCoeffsK;
};

const noiseRemoval = (
  frequencies,
  magnitudes,
  filterOrder,
  sampleRate,
  limit
) => {
  const peaksWatanabeIndices = identifyPeaks(magnitudes, 50);
  let strongLowerFreq = [];
  for (let i = 0; i < peaksWatanabeIndices.length; i++) {
    if (frequencies[peaksWatanabeIndices[i]] < limit) {
      strongLowerFreq.push(Math.round(frequencies[peaksWatanabeIndices[i]]));
    }
  }

  let bands = [];
  for (let i = 0; i < strongLowerFreq.length; i++) {
    if (strongLowerFreq[i] > 5) {
      //Greater than 5Hz
      bands.push(
        bandstopTaps(
          filterOrder,
          sampleRate,
          strongLowerFreq[i] - 5,
          strongLowerFreq[i] + 5,
          5
        )
      ); //Attenuate by 5 dB, order of 101
    } else {
      bands.push(
        bandstopTaps(filterOrder, sampleRate, 0, strongLowerFreq[i] + 5, 5)
      ); //Attenuate by 5 dB, order of 101
    }
  }

  console.log(strongLowerFreq);
  if (bands.length > 0) {
    // Safely assume independence of bands
    var sum = (r, a) => r.map((b, i) => a[i] + b);
    let noisyTaps = bands.reduce(sum);
    return noisyTaps;
  }
  return [];
};

const generalAnalysis = (frequencies, magnitudes) => {
  const magnitudesDescending = [...magnitudes]
    .sort(function (a, b) {
      return a - b;
    })
    .reverse();
  const magnitudesThreshold = magnitudesDescending[15];

  for (let i = 0; i < frequencies.length; i++) {
    if (magnitudes[i] > magnitudesThreshold) {
      console.log(
        "General Frequency (Hz): " +
          frequencies[i] +
          ", Noise Magnitude: " +
          magnitudes[i]
      );
    }
  }
  console.log("");
};

// Deprecated analysis method using pitch values instead of FFT
const GetPitchValue = (recordedData) => {
  const detectPitch = Pitchfinder.AMDF();
  const pitch = detectPitch(recordedData);
  return pitch;
};

module.exports = {
  GetPitchValue: GetPitchValue,
  fftAnalysis: fftAnalysis,
};
