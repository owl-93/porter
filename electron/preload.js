const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('ipcApi', {
  receive: (channel, callback) => {
    ipcRenderer.on(channel, (event, args) => {
      callback?.call(null, args)
    })
  },

  send: (channel) => {
    ipcRenderer.send(channel)
  }
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })