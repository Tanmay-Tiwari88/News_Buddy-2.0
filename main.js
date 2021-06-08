const {app,BrowserWindow,dialog} = require('electron');
const path = require('path')
//const PaneBrowserwindow = require('electron-pane-window');

let win;
app.on('ready',()=>{
    win = new BrowserWindow({
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
        
        
        },
        height:800,
        width:800,
        show:false,

    
    });
    win.loadFile('html/index.html')
    win.on('ready-to-show',()=>{
        win.show();
    });

});


 

