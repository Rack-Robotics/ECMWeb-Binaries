const { app, BrowserWindow } = require('electron')

// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;

function createTestWindow() {
  const testWindow = new BrowserWindow({ width: 1200, height: 900 });
  testWindow.loadURL('http://127.0.0.1:8000');
}

// app.on('ready', createTestWindow);

app.whenReady().then(() => {
    createTestWindow()
})

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createTestWindow();
//   }
// });

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});