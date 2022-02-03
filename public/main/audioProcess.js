const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Pitchfinder = require("pitchfinder");
const fft = require('fft-js').fft;
const fftUtil = require('fft-js').util;

const fftAnalysis = (recordedData, sampleRate) => {
  console.log("Sample Rate: " + sampleRate);
    console.log("Length of array: " + recordedData.length);
    var phasors = fft(recordedData.slice(0, 32768)); // 48000 > samples 
    console.log("Length of phasors: " + phasors.length);
    var frequencies = fftUtil.fftFreq(phasors, sampleRate); // Sample rate and coef is just used for length, and frequency step
    var magnitudes = fftUtil.fftMag(phasors);

    firFilterTaps(frequencies, magnitudes)
}

const firFilterTaps = (frequencies, magnitudes) => {
    for (let i = 0; i < frequencies.length; i++) {
      if (magnitudes[i] > 0.3) {
        console.log("Frequency (Hz): "+ frequencies[i] + ", Magnitude: "+ magnitudes[i])
      }
    }
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
