// Generics
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const fs = require("fs");
const { resolve } = require("path");
const { electron } = require("process");
const { GetPitchValue, fftAnalysis } = require("./main/audioProcess");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: __dirname + "/preload.js",
    },
  });

  //load the index.html from a url
  win.loadURL("http://localhost:3000");

  // Open the DevTools.
  //win.webContents.openDevTools();

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); //Set menu
  Menu.setApplicationMenu(mainMenu);

  win.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "serial" || permission === "media") {
        return true;
      }
      return false;
    }
  );

  win.webContents.session.setDevicePermissionHandler((details) => {
    if (
      details.deviceType === "serial" &&
      details.device.vendorId === 1027 &&
      details.device.productId === 24592
    ) {
      return true;
    }
    return false;
  });

  win.webContents.session.on(
    "select-serial-port",
    (event, portList, webContents, callback) => {
      event.preventDefault();
      const selectedPort = portList.find((device) => {
        return device.vendorId === "1027" && device.productId === "24592";
      });
      if (!selectedPort) {
        callback("");
      } else {
        callback(selectedPort.portId);
      }
    }
  );

  ipcMain.on("process-audio", (event, rawRecordedData, sampleRate) => {
    //Pitch method is deprecated
    const pitch = GetPitchValue(rawRecordedData);
    const noiseTaps = fftAnalysis(rawRecordedData, sampleRate);
    
    win.webContents.send(
      "audio-finished",
      `Sent information over UART if connected`,
       noiseTaps
    );
  });
}

//Helps you read file contents
function readFile(filepath, mimeType) {
  pathToFile = filepath.replace("file:\\\\", "");
  pathToFile = pathToFile.replace(/\\/, "\\\\");

  fs.readFile(filepath, mimeType, (err, data) => {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
      return;
    }
    // Change how to handle the file content
    console.log("The file content is : " + data);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//Main Menu Template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "CTRL+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

//Mac device specific
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        role: "reload",
      },
      {
        label: "Toggle Dev Tools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
