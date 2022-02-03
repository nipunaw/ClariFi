const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Pitchfinder = require("pitchfinder");
const fft = require('fft-js').fft;
const fftUtil = require('fft-js').util;

const fftAnalysis = (recordedData, sampleRate) => {
    
    var phasors = fft(recordedData.slice(0, 262144)); // 48000 > samples 
    var frequencies = fftUtil.fftFreq(phasors, sampleRate); // Sample rate and coef is just used for length, and frequency step
    var magnitudes = fftUtil.fftMag(phasors);

    console.log("Sample Rate: " + sampleRate);
    console.log("Length of array: " + recordedData.length);
    console.log("Length of phasors: " + phasors.length);
    console.log("Length of frequencies: " + frequencies.length);
    console.log("Length of magnitudes: " + magnitudes.length);
    console.log("");
    firFilterTaps(frequencies, magnitudes)

}

const firFilterTaps = (frequencies, magnitudes) => {
    const magnitudesDescending = [...magnitudes].sort(function (a, b) {  return a - b;  }).reverse();
    const magnitudesThreshold = magnitudesDescending[10];

    for (let i = 0; i < frequencies.length; i++) {
      if (magnitudes[i] > magnitudesThreshold) {
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
