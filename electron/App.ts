import { BrowserWindow, ipcMain, app } from "electron";
import { getPorts, PortData } from "./PorterService";
import TrayUtil from "./PorterTrayUtil";
import * as path from "path";
import * as isDev from "electron-is-dev";
require("dotenv").config();

const dev = process.env.NODE_ENV === "development";
const appUrl = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "index.html")}`;
// const devUrl = `http://localhost:3000`
//const appPath = path.resolve(app.getAppPath(), 'preload.js')

export type OS = "windows" | "darwin" | "linux";
const os = process.platform as OS;

console.info(`running in '${process.env.NODE_ENV}' on host ${os}`);

//globals
let mainWindow: BrowserWindow;
let trayUtil: TrayUtil;
let interval: NodeJS.Timeout;
let currentPortData: PortData[] | undefined;

ipcMain.on("ports", (event, arg) => {
  getPorts((data: PortData[] | undefined, error: any) => {
    console.log(
      `[${new Date().toISOString()}] - ${
        error
          ? "Error fetching ports"
          : `[${data?.length || "no"}] ports in use`
      }`
    );
    if (error) {
      console.warn("error fetching ports", error);
    }
    event.reply("ports-reply", { data, error });
  });
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 480,
    show: false,
    frame: os !== "darwin",
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      devTools: dev,
      nodeIntegration: true,
    },
  });

  console.log("loading appUrl: ", appUrl);
  dev && mainWindow.webContents.openDevTools({ mode: "detach" });
  mainWindow.loadURL(appUrl);
}

app.whenReady().then(() => {
  createWindow(); //create webview
  mainWindow.on("blur", mainWindow.hide);
  trayUtil = new TrayUtil(mainWindow);
  trayUtil.logging = false;
  interval = setInterval(() => {
    getPorts((data: PortData[] | undefined, error: any) => {
      console.log(
        `[${new Date().toISOString()}] - ${
          error
            ? "Error fetching ports"
            : `[${data?.length || "no"}] ports in use`
        }`
      );
      error && console.warn("error fetching ports", error);
      mainWindow.webContents.send("ports", { data, error });
    });
  }, 5000);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  clearInterval(interval);
  if (os === "darwin") {
    app.quit();
  }
});

export {};
