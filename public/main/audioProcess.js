const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Pitchfinder = require("pitchfinder");

const GetPitchValue = (arrayData) => {
  const detectPitch = Pitchfinder.AMDF();
  const pitch = detectPitch(arrayData);
  return pitch;
};

module.exports = {
  GetPitchValue: GetPitchValue,
};
