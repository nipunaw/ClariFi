const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', function() { //Wait for app to be ready
	mainWindow = new BrowserWindow({}); //Create browser window
	mainWindow.loadURL(url.format({  //Load HTML
		pathname: path.join(__dirname, 'src/index.html'),
		protocol: 'file:',
		slashes: true
	}));
	mainWindow.on('closed', function() { // Main window quitting = global quitting
		app.quit();
	});
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); //Set menu
	Menu.setApplicationMenu(mainMenu);
});


//Main Menu Template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{label: 'Quit', accelerator: process.platform == 'darwin' ? 'Command+Q' : 'CTRL+Q', click(){app.quit();}}
		]
	}

];

//Mac device specific
if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle Dev Tools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}