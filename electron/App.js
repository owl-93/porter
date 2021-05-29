"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var PorterService_1 = require("./PorterService");
var PorterTrayUtil_1 = require("./PorterTrayUtil");
var path = require("path");
require('dotenv').config();
var dev = process.env.NODE_ENV === "development";
var devUrl = "http://localhost:3000";
var os = process.platform;
console.info("running in '" + process.env.NODE_ENV + "' on host " + os);
//globals
var mainWindow;
var trayUtil;
electron_1.ipcMain.on("ports", function (event, arg) {
    PorterService_1.getPorts(function (data, error) {
        console.log("[" + new Date().toISOString() + "] - " + (error ? "Error fetching ports" : "[" + ((data === null || data === void 0 ? void 0 : data.length) || 'no') + "] ports in use"));
        if (error) {
            console.warn("error fetching ports", error);
        }
        event.reply("ports-reply", { data: data, error: error });
    });
});
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 320,
        height: 480,
        show: false,
        frame: os !== 'mac',
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
electron_1.app.whenReady().then(function () {
    createWindow(); //create webview
    trayUtil = new PorterTrayUtil_1["default"](mainWindow);
    trayUtil.logging = true;
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
electron_1.app.on('window-all-closed', function () {
    if (os === 'mac') {
        electron_1.app.quit();
    }
});
