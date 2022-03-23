"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var isDev = require("electron-is-dev");
var TrayUtil = /** @class */ (function () {
    function TrayUtil(window, os) {
        var _this = this;
        this.logging = false;
        this.getWindowPosition = function () {
            var windowBounds = _this.mainWindow.getBounds();
            var trayBounds = _this.tray.getBounds();
            _this.logging && console.log("tray bounds: ", trayBounds);
            var x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
            var y = Math.round(trayBounds.y + trayBounds.height);
            _this.logging && console.log("window position: ", { x: x, y: y });
            return _this.os === "darwin" ? { x: x, y: y } : { x: 0, y: 0 };
        };
        this.showWindow = function () {
            var position = _this.getWindowPosition();
            _this.mainWindow.setPosition(position.x, position.y, false);
            _this.mainWindow.show();
            _this.mainWindow.focus();
            _this.mainWindow.setVisibleOnAllWorkspaces(true);
            //this.mainWindow.on('blur', this.mainWindow.hide)
        };
        this.toggleWindow = function () {
            if (_this.mainWindow.isVisible()) {
                _this.mainWindow.hide();
            }
            else {
                _this.showWindow();
            }
        };
        this.rightClickMenu = function () {
            _this.tray.popUpContextMenu(electron_1.Menu.buildFromTemplate([
                {
                    label: "quit porter",
                    role: "quit",
                    accelerator: "Command+Q"
                },
            ]));
        };
        this.createTray = function () {
            var trayIcon = _this.os === "darwin" ? "IconTemplate@2x" : "IconTemplate";
            var iconPath = isDev
                ? path.join(__dirname, "../src/assets/" + trayIcon + ".png")
                : path.join(__dirname, "./" + trayIcon + ".png");
            _this.tray = new electron_1.Tray(iconPath);
            _this.tray.setIgnoreDoubleClickEvents(true);
            _this.tray.on("click", _this.toggleWindow);
            _this.tray.on("right-click", _this.rightClickMenu);
            return _this.tray;
        };
        if (!window)
            throw new Error("main window argument is undefined/null");
        this.mainWindow = window;
        this.os = os || "darwin";
        this.tray = this.createTray();
    }
    return TrayUtil;
}());
exports["default"] = TrayUtil;
