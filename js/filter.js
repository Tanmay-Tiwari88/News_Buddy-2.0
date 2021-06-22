const path = require("path");
const BrowserWindow = require('electron').remote.BrowserWindow;
const {
  ipcRenderer
} = require("electron");


ipcRenderer.on('show-them', (event, tp) => {

    console.log(tp);

})