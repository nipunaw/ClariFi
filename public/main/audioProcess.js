const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Pitchfinder = require("pitchfinder");
const fft = require('fft-js').fft;
const fftUtil = require('fft-js').util;
const windowing = require('fft-windowing');
const Fili = require('fili');

const fftAnalysis = (rawRecordedData, sampleRate) => {
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
  firFilterTaps(frequencies, magnitudes);
}

const firFilterTaps = (frequencies, magnitudes) => {
  noiseRemoval(frequencies, magnitudes);
  var firCalculator = new Fili.FirCoeffs();
  var firFilterCoeffs = firCalculator.lowpass({
    order: 100, // filter order
    Fs: 1000, // sampling frequency
    Fc: 100 // cutoff frequency
    // forbandpass and bandstop F1 and F2 must be provided instead of Fc
  });
  console.log(firFilterCoeffs);
}

const noiseRemoval = (frequencies, magnitudes) => {
  let noiseLength = 0;
  for (let i = 0; i < frequencies.length; i++) {
    if (frequencies[i] < 150) {
      noiseLength++;
    }
  }
  const magnitudesNoiseDescending = [...magnitudes.slice(0, noiseLength)].sort(function (a, b) {  return a - b;  }).reverse();
  const magnitudesNoiseThreshold = magnitudesNoiseDescending[20];
  for (let i = 0; i < noiseLength; i++) {
    if (magnitudes[i] > magnitudesNoiseThreshold) {
      console.log("Noise Frequency (Hz): "+ frequencies[i] + ", Noise Magnitude: "+ magnitudes[i])
    }
  }
  console.log("");

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

const GetPitchValue = (recordedData) => {
  const detectPitch = Pitchfinder.AMDF();
  const pitch = detectPitch(recordedData);
  return pitch;
};

module.exports = {
  GetPitchValue: GetPitchValue,
  fftAnalysis: fftAnalysis
};
