import { BrowserWindow, Tray, Menu } from "electron";
import { OS } from './App'
import * as path  from 'path'

export default class TrayUtil {
  mainWindow: BrowserWindow;
  tray: Tray;
  logging: boolean = false
  os: OS;

  constructor(window: BrowserWindow | undefined, os?: OS) {
    if(!window) throw new Error("main window argument is undefined/null")
    this.mainWindow = window;
    this.os = os || "mac"
    this.tray = this.createTray()
  }

  getWindowPosition = () => {
    const windowBounds = this.mainWindow.getBounds();
    const trayBounds = this.tray.getBounds();
    this.logging && console.log(`tray bounds: `, trayBounds)

    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );
    const y = Math.round(trayBounds.y + trayBounds.height);
    this.logging && console.log(`window position: `, {x, y})
    return this.os === 'mac' ? { x, y } : { x: 0, y: 0};
  };

  showWindow = () => {
    const position = this.getWindowPosition();
    this.mainWindow.setPosition(position.x, position.y, false);
    this.mainWindow.show();
    this.mainWindow.setVisibleOnAllWorkspaces(true);
    this.mainWindow.focus();
    this.mainWindow.setVisibleOnAllWorkspaces(true);
  };

  toggleWindow = () => {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showWindow();
    }
  };

  rightClickMenu = () => {
    this.tray.popUpContextMenu(
      Menu.buildFromTemplate([
        {
          label: "quit porter",
          role: "quit",
          accelerator: "Command+Q",
        },
      ])
    );
  };

  createTray = () => {
    this.tray = new Tray(path.join(__dirname, "../src/assets/IconTemplate.png"));
    this.tray.setIgnoreDoubleClickEvents(true);
    this.tray.on("click", this.toggleWindow);
    this.tray.on("right-click", this.rightClickMenu);
    return this.tray
  };
}