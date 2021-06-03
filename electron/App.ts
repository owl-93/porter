import { BrowserWindow, ipcMain, app} from 'electron'
import { getPorts, PortData } from './PorterService'
import TrayUtil from './PorterTrayUtil'
import * as path from 'path'
require('dotenv').config()

const dev = process.env.NODE_ENV === "development"
const devUrl = `http://localhost:3000`
//const appPath = path.resolve(app.getAppPath(), 'preload.js')

export type OS = 'windows' | 'darwin' | 'linux'
const os = process.platform as OS

console.info(`running in '${process.env.NODE_ENV}' on host ${os}`)


//globals
let mainWindow: BrowserWindow;
let trayUtil: TrayUtil;

ipcMain.on("ports", (event, arg) => {
  getPorts((data: PortData[] | undefined, error: any) => {
    console.log(`[${new Date().toISOString()}] - ${error ? "Error fetching ports" : `[${data?.length ||'no'}] ports in use`}`)
    if (error) {
      console.warn("error fetching ports", error);
    }
    event.reply("ports-reply", { data, error });
  });
});

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 480,
    show: false,
    frame: os !== 'darwin',
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      devTools: dev,
      nodeIntegration: true
    }
  })

  if (dev) {
    console.log("loading dev server url: ", devUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadURL(devUrl);
  } else {
    console.log("loading built app")
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"))
  }

}

app.whenReady().then(() => {
  createWindow(); //create webview
  trayUtil = new TrayUtil(mainWindow)
  trayUtil.logging = true
})



app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (os === 'darwin') {
    app.quit()
  }
})

export {}