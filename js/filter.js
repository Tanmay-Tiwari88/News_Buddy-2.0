const path = require("path");
const BrowserWindow = require('electron').remote.BrowserWindow;
const {
  ipcRenderer
} = require("electron");


ipcRenderer.on('show-them', (event, tp) => {

    console.log(tp);

})

filter-form.addEventListener("submit", function(e) {
  e.preventDefault();
  var data = new FormData(form);
  for (const [name,value] of data) {
    console.log(name,value)
  }
})