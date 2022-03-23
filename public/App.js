"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var PorterService_1 = require("./PorterService");
var PorterTrayUtil_1 = require("./PorterTrayUtil");
var path = require("path");
var isDev = require("electron-is-dev");
require("dotenv").config();
var dev = process.env.NODE_ENV === "development";
var appUrl = isDev
    ? "http://localhost:3000"
    : "file://" + path.join(__dirname, "index.html");
var os = process.platform;
console.info("running in '" + process.env.NODE_ENV + "' on host " + os);
//globals
var mainWindow;
var trayUtil;
var interval;
var currentPortData;
electron_1.ipcMain.on("ports", function (event, arg) {
    PorterService_1.getPorts(function (data, error) {
        console.log("[" + new Date().toISOString() + "] - " + (error
            ? "Error fetching ports"
            : "[" + ((data === null || data === void 0 ? void 0 : data.length) || "no") + "] ports in use"));
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
        frame: os !== "darwin",
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
            devTools: dev,
            nodeIntegration: true
        }
    });
    console.log("loading appUrl: ", appUrl);
    dev && mainWindow.webContents.openDevTools({ mode: "detach" });
    mainWindow.loadURL(appUrl);
}
electron_1.app.whenReady().then(function () {
    createWindow(); //create webview
    mainWindow.on("blur", mainWindow.hide);
    trayUtil = new PorterTrayUtil_1["default"](mainWindow);
    trayUtil.logging = false;
    interval = setInterval(function () {
        PorterService_1.getPorts(function (data, error) {
            console.log("[" + new Date().toISOString() + "] - " + (error
                ? "Error fetching ports"
                : "[" + ((data === null || data === void 0 ? void 0 : data.length) || "no") + "] ports in use"));
            error && console.warn("error fetching ports", error);
            mainWindow.webContents.send("ports", { data: data, error: error });
        });
    }, 5000);
});
electron_1.app.on("activate", function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
electron_1.app.on("window-all-closed", function () {
    clearInterval(interval);
    if (os === "darwin") {
        electron_1.app.quit();
    }
});
