var _a = require('electron'), contextBridge = _a.contextBridge, ipcRenderer = _a.ipcRenderer;
contextBridge.exposeInMainWorld('ipcApi', {
    subscribe: function (channel, callback) {
        ipcRenderer.on(channel, function (event, args) {
            callback === null || callback === void 0 ? void 0 : callback.call(null, args);
        });
    },
    send: function (channel) {
        ipcRenderer.send(channel);
    },
    unsubscribe: function (channel, listener) {
        ipcRenderer.removeListener(channel, listener);
    }
});
window.addEventListener('DOMContentLoaded', function () {
    var replaceText = function (selector, text) {
        var element = document.getElementById(selector);
        if (element)
            element.innerText = text;
    };
    for (var _i = 0, _a = ['chrome', 'node', 'electron']; _i < _a.length; _i++) {
        var type = _a[_i];
        replaceText(type + "-version", process.versions[type]);
    }
});
