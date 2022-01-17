const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const fs = require("fs");
const { resolve } = require("path");
const { PythonShell } = require("python-shell");
const SerialPort = require('serialport')

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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

  //readFile('test.wav','base64');
  //recordAudio('output.wav', analyzeAudio);
  //recordAudio('output.wav');
  //analyzeAudio('output.wav');

  //Creates output.wav
  //Creates output.f0.csv -- Take data from columns and average for metadata
  //Creates output.activation.png -- Plot this in react

  // TODO: Fill in parseCSV function below
  listPorts();

  ipcMain.on("recordButton", async () => {
    console.log("heyo!");
    let status = await recordAnalyzeAudio("output.wav");
    let imagePath = "output.activation.png";
    win.webContents.send("recordMain", {
      STATUS: "finished",
      IMG_PATH: imagePath,
      IMG_ALT: "Output graph from analysis",
    });
  });
}

function listPorts() {
	SerialPort.list().then(ports => {
		ports.forEach(function(port) {
			console.log(port.path)
		})
	})	
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

//Enlists Python to analyze audio data
function analyzeAudio(file_name) {
  let options = {
    mode: "text",
    pythonOptions: ["-u"],
    args: [file_name],
  };

  PythonShell.run("analyze.py", options, function (err, results) {
    if (err) throw err;
    console.log("Script finished.");
    for (let i = 0; i < results.length; i++) {
      if (results[i].length < 35) {
        console.log("Pitch Measurement:", results[i]);
      }
    }
  });
}

//Enlists Python to record microphone input
function recordAudio(file_name, callback) {
  let options = {
    mode: "text",
    args: [file_name],
  };

  PythonShell.run("record.py", options, function (err, results) {
    if (err) throw err;
    console.log("Recording finished.");
    for (let i = 0; i < results.length; i++) {
      console.log(results[i]);
    }
  });

  callback(file_name);
}

//Record and analyze
async function recordAnalyzeAudio(file_name) {
  let options = {
    mode: "text",
    args: [file_name],
  };

  let { success } = await new Promise((resolve, reject) => {
    PythonShell.run("master.py", options, function (err, results) {
      if (err) throw err;
      console.log("Master Script Finished.");
      for (let i = 0; i < results.length; i++) {
        if (results[i].length < 35) {
          console.log(results[i]);
        }
      }
      resolve({ success: true });
    });
  });

  console.log(success);
}

//Helper function that parses CSV into array. Need to get a NodeJS library I believe
function parseCSV(filename, delimiter = ",") {
  return;
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
