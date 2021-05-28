require('dotenv').config();
var getPorts = require('./PorterService').getPorts;
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow, Tray = _a.Tray, Menu = _a.Menu, ipcMain = _a.ipcMain;
var path = require('path');
var TrayUtil = require('./PorterTrayUtil');
var dev = process.env.NODE_ENV === "development";
var devUrl = "http://localhost:3000";
//const appPath = path.resolve(app.getAppPath(), 'preload.js')
//globals
var mainWindow;
var tray;
ipcMain.on("ports", function (event, arg) {
    console.log("ports request");
    getPorts(function (data, error) {
        if (error) {
            console.warn("error fetching ports", error);
        }
        event.reply("ports-reply", { data: data, error: error });
    });
});
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 320,
        height: 480,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            devTools: dev,
            nodeIntegration: true
        }
    });
    if (dev) {
        console.log("loading dev server url: ", devUrl);
        mainWindow.webContents.openDevTools({ mode: 'detach' });
        mainWindow.loadURL(devUrl);
    }
    else {
        console.log("loading built app");
        mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
    }
}
app.whenReady().then(function () {
    createWindow(); //create webview
    var trayUtil = new TrayUtil(mainWindow);
    tray = trayUtil.createTray(); //make system tray
});
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// const getWindowPosition = () => {
//   const windowBounds = mainWindow.getBounds();
//   const trayBounds = tray.getBounds();
//   const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
//   const y = Math.round(trayBounds.y + trayBounds.height);
//   return { x, y };
// };
// const showWindow = () => {
//   const position = getWindowPosition();
//   mainWindow.setPosition(position.x, position.y, false);
//   mainWindow.show();
//   mainWindow.setVisibleOnAllWorkspaces(true);
//   mainWindow.focus();
//   mainWindow.setVisibleOnAllWorkspaces(false);
// };
// const toggleWindow = () => {
//   if (mainWindow.isVisible()) {
//     mainWindow.hide();
//   } else {
//     showWindow();
//   }
// };
// const rightClickMenu = () => {
//   tray.popUpContextMenu(Menu.buildFromTemplate([
//     {
//       label: "quit porter",
//       role: 'quit',
//       accelerator: 'Command+Q'
//     }
//   ]));
// }
// const createTray = () => {
//   tray = new Tray(path.join(__dirname, '../src/assets/IconTemplate.png'));
//   tray.setIgnoreDoubleClickEvents(true);
//   tray.on('click', toggleWindow);
//   tray.on('right-click', rightClickMenu);
// };
