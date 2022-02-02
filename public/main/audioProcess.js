const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Pitchfinder = require("pitchfinder");
const fft = require('fft-js').fft;
const fftUtil = require('fft-js').util;

const fftAnalysis = (arrayData) => {

    var phasors = fft(arrayData.slice(0, 32768)); // 48000 > samples 
    var frequencies = fftUtil.fftFreq(phasors, 48000); // Sample rate and coef is just used for length, and frequency step
    var magnitudes = fftUtil.fftMag(phasors);

    console.log(frequencies)
    console.log(magnitudes)
}

const firFilterTaps = (frequencyData, magnitudeData) => {
    console.log(frequencyData);
    console.log(magnitudeData);
}

const GetPitchValue = (arrayData) => {
  const detectPitch = Pitchfinder.AMDF();
  const pitch = detectPitch(arrayData);
  return pitch;
};

module.exports = {
  GetPitchValue: GetPitchValue,
  fftAnalysis: fftAnalysis
};
