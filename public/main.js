const { app, BrowserWindow, Menu } = require("electron");
const fs = require("fs");
const {PythonShell} = require('python-shell');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  //load the index.html from a url
  win.loadURL("http://localhost:3000");

  // Open the DevTools.
  win.webContents.openDevTools();

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); //Set menu
  Menu.setApplicationMenu(mainMenu);
  
  //readFile('test.wav','base64');
  //recordAudio('output.wav', analyzeAudio);
  //recordAudio('output.wav');
  //analyzeAudio('output.wav');
  
  recordAnalyzeAudio('output.wav');
  
}

//Helps you read file contents
function readFile(filepath, mimeType){
   pathToFile = filepath.replace("file:\\\\",'');
   pathToFile = pathToFile.replace(/\\/,'\\\\')

   fs.readFile(filepath, mimeType, (err, data) => {
        if(err){
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
		mode: 'text',
		args: [file_name]
	};
	
	PythonShell.run('analyze.py', options,  function(err, results)  {
		if (err) throw err;
		console.log('Script finished.');
		for (let i = 0; i < results.length; i++) {
			if (results[i].length < 35) {
				console.log('Pitch Measurement:', results[i]);
			}
		}
		
	});
}

//Enlists Python to record microphone input
function recordAudio(file_name, callback) {
	let options = {
		mode: 'text',
		args: [file_name]
	};
	
	PythonShell.run('record.py', options,  function(err, results)  {
		if (err) throw err;
		console.log('Recording finished.');
		for (let i = 0; i < results.length; i++) {
			console.log(results[i]);
		}
		
	});
	
	callback(file_name);
}

//Record and analyze
function recordAnalyzeAudio(file_name) {
	let options = {
		mode: 'text',
		args: [file_name]
	};
	
	PythonShell.run('master.py', options,  function(err, results)  {
		if (err) throw err;
		console.log('Master Script Finished.');
		for (let i = 0; i < results.length; i++) {
			if (results[i].length < 35) {
				console.log(results[i]);
			}
		}
		
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
