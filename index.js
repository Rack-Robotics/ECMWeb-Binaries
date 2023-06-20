const config = require('lw.comm-server/config.js');
const { createServer } = require('http');
const nstatic = require('node-static');
const electron = require('electron');
const axios = require('axios');

const { app, BrowserWindow } = electron;

// This is for Squirrel. Windows and it does some initialization that needs to be done one windows.
if (require('electron-squirrel-startup')) app.quit();


let mainWindow;

const webServer = new nstatic.Server(config.uipath || path.join(__dirname, '/app'));
const httpServer = createServer((req, res) => {
  webServer.serve(req, res, (err, result) => {
    if (err) {
      console.error('webServer error:' + req.url + ' :' + err.message);
    }
  });
});

httpServer.listen(config.webPort, config.IP, () => {
  console.log(`Server listening on ${config.IP}:${config.webPort}`);
});

let io = require('socket.io')(httpServer, {
  maxHttpBufferSize: config.socketMaxDataSize,
  cors: {
    origin: config.socketCorsOrigin,
    methods: ['GET', 'POST'],
  },
  pingTimeout: config.socketPingTimeout,
  pingInterval: config.socketPingInterval,
});

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    fullscreen: false,
    center: true,
    resizable: true,
    title: 'LaserWeb',
    frame: true,
    autoHideMenuBar: true,
    icon: '/public/favicon.png',
  });

  let serverAvailable = false;
  while (!serverAvailable) {
    try {
      await axios.get('http://' + config.IP + ':' + config.webPort);
      serverAvailable = true;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  mainWindow.loadURL('http://' + config.IP + ':' + config.webPort);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.maximize();
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
// // -----------------------
// const axios = require('axios');

// const config = require('lw.comm-server/config.js');
// require('lw.comm-server');


// // Electron app
// const electron = require('electron');
// const autoUpdater = require("electron-updater").autoUpdater
//       autoUpdater.checkForUpdatesAndNotify();
      
// // Module to control application life.
// const electronApp = electron.app;
// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// var mainWindow = null;

// // const shouldQuit = electronApp.makeSingleInstance((commandLine, workingDirectory) => {
// //   // Someone tried to run a second instance, we should focus our window.
// //   if (mainWindow) {
// //     if (mainWindow.isMinimized()) mainWindow.restore();
// //     mainWindow.focus();
// //   }
// // });

// // if (shouldQuit) {
// //   electronApp.quit();
// // }

// const gotSingleInstanceLock = electronApp.requestSingleInstanceLock();

// if (!gotSingleInstanceLock) {
//   electronApp.quit();
// } else {
//   electronApp.on('second-instance', (event, commandLine, workingDirectory) => {
//     // Someone tried to run a second instance, we should focus our window.
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       mainWindow.focus();
//     }
//   });

//   // Place the rest of your code here to initialize the window and perform other tasks.
//   // Create myWindow, load the rest of the app, etc...
//   console.log("Starting LaserWeb on " + config.IP + ':' + config.webPort);
//   if (electronApp) {
//     // Module to create native browser window.
//     const BrowserWindow = electron.BrowserWindow;

//     // function createWindow() {
//     // async function createWindow() {
//     //     // Create the browser window.
//     //     mainWindow = new BrowserWindow({width: 1200, height: 900, fullscreen: false, center: true, resizable: true, title: "LaserWeb", frame: true, autoHideMenuBar: true, icon: '/public/favicon.png' });
//     //     // Add a delay to ensure the server is running
//     //     await new Promise(resolve => setTimeout(resolve, 3000));

//     //     // And load the index.html of the app.
//     //     mainWindow.loadURL('http://127.0.0.1:' + config.webPort);

//     //     // Emitted when the window is closed.
//     //     mainWindow.on('closed', function () {
//     //         // Dereference the window object, usually you would store windows
//     //         // in an array if your app supports multi windows, this is the time
//     //         // when you should delete the corresponding element.
//     //         mainWindow = null;
//     //     });
//     //     mainWindow.once('ready-to-show', () => {
//     //       mainWindow.show()
//     //     })
//     //     mainWindow.maximize()
//     //     //mainWindow.webContents.openDevTools() // Enable when testing
//     // };
//     async function createWindow() {
//       // Create the browser window.
//       mainWindow = new BrowserWindow({
//         width: 1200,
//         height: 900,
//         fullscreen: false,
//         center: true,
//         resizable: true,
//         title: 'LaserWeb',
//         frame: true,
//         autoHideMenuBar: true,
//         icon: '/public/favicon.png',
//       });
    
//       // Wait for a successful connection to the server.
//       let serverAvailable = false;
//       while (!serverAvailable) {
//         try {
//           // await axios.get('http://127.0.0.1:' + config.webPort);
//           await axios.get('http://' + config.IP + ':' + config.webPort);
//           serverAvailable = true;
//         } catch (error) {
//           // Wait for 500ms before trying again.
//           await new Promise((resolve) => setTimeout(resolve, 500));
//           console.log("Cannot connect to server. Retrying...");
//         }
//       }
//       console.log("Server seems to be available.");
    
//       // Load the URL once the server is available.
//       // mainWindow.loadURL('http://127.0.0.1:' + config.webPort);
//       mainWindow.loadURL('http://' + config.IP + ':' + config.webPort);
    
//       // Emitted when the window is closed.
//       mainWindow.on('closed', function () {
//         mainWindow = null;
//       });
    
//       mainWindow.once('ready-to-show', () => {
//         mainWindow.show();
//       });
    
//       mainWindow.maximize();
//     }

//     electronApp.commandLine.appendSwitch("--ignore-gpu-blacklist");
//     electronApp.commandLine.appendSwitch("--disable-http-cache");
//     // This method will be called when Electron has finished
//     // initialization and is ready to create browser windows.
//     // Some APIs can only be used after this event occurs.


//     electronApp.on('ready', createWindow);

//     // Quit when all windows are closed.
//     electronApp.on('window-all-closed', function () {
//         // On OS X it is common for applications and their menu bar
//         // to stay active until the user quits explicitly with Cmd + Q
//         if (process.platform !== 'darwin') {
//             electronApp.quit();
//         }
//     });

//     electronApp.on('activate', function () {
//         // On OS X it's common to re-create a window in the app when the
//         // dock icon is clicked and there are no other windows open.
//         if (mainWindow === null) {
//             createWindow();
//         }
//     });
//   }
// }

// // ------------------------------------------------------

// // Create myWindow, load the rest of the app, etc...
// if (electronApp) {
//     // Module to create native browser window.
//     const BrowserWindow = electron.BrowserWindow;

//     function createWindow() {
//         // Create the browser window.
//         mainWindow = new BrowserWindow({width: 1200, height: 900, fullscreen: false, center: true, resizable: true, title: "LaserWeb", frame: true, autoHideMenuBar: true, icon: '/public/favicon.png' });

//         // and load the index.html of the app.
//         mainWindow.loadURL('http://127.0.0.1:' + config.webPort);

//         // Emitted when the window is closed.
//         mainWindow.on('closed', function () {
//             // Dereference the window object, usually you would store windows
//             // in an array if your app supports multi windows, this is the time
//             // when you should delete the corresponding element.
//             mainWindow = null;
//         });
//         mainWindow.once('ready-to-show', () => {
//           mainWindow.show()
//         })
//         mainWindow.maximize()
//         //mainWindow.webContents.openDevTools() // Enable when testing
//     };

//     electronApp.commandLine.appendSwitch("--ignore-gpu-blacklist");
//     electronApp.commandLine.appendSwitch("--disable-http-cache");
//     // This method will be called when Electron has finished
//     // initialization and is ready to create browser windows.
//     // Some APIs can only be used after this event occurs.


//     electronApp.on('ready', createWindow);

//     // Quit when all windows are closed.
//     electronApp.on('window-all-closed', function () {
//         // On OS X it is common for applications and their menu bar
//         // to stay active until the user quits explicitly with Cmd + Q
//         if (process.platform !== 'darwin') {
//             electronApp.quit();
//         }
//     });

//     electronApp.on('activate', function () {
//         // On OS X it's common to re-create a window in the app when the
//         // dock icon is clicked and there are no other windows open.
//         if (mainWindow === null) {
//             createWindow();
//         }
//     });
// }