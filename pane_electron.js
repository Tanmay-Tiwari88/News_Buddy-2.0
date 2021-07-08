const {
  app,
  BrowserWindow,
  screen,
  Tray,
  webContents
} = require("electron");

const {
  ipcMain
} = require('electron');


const path = require("path");

const {
  clearInterval
} = require("timers");


let win;
var width=0;
let tray;
var temp=0;
var loadInTimer;
var loadoutTimer;
var albumMenu;
var filterWindow;
var slidein;
var slideout
var movingin = false;
var movingout = true;

//recive article from pane to be saved and pass it to alum-menu
ipcMain.on('Sending-Article', (event, tp) => {
  albumMenu.webContents.send('Send-Article-menu', tp);


});

//hides album menu after saving the article
ipcMain.on('close-menu', (event, message) => {
  albumMenu.hide();
});

//launch filterWindow
ipcMain.on('launch-filterWindow', (event, tp) => {
  filterWindow.show()
  filterWindow.webContents.send('show them', tp);


});

//recieve articel from filter and send it to pane page
ipcMain.on("sending-Parameters", (event, paras) => {
  filterWindow.hide()
  win.webContents.send("sending filter para", JSON.parse(paras));
})


//function than move in the pane window in electron by increasing its x-cordinate 
function movein() {
  temp += 10;

  win.setPosition(temp, 0);
  if (temp == 0) {
      clearInterval(slidein);
  }

}



//function than move out the pane window in electron by decreasing its x-cordinate 
function moveout() {
 
  temp -= 10;
 
  win.setPosition(temp, 0);
  if (temp <= -1 * width) {
  
    win.hide();
    clearInterval(slideout);

  }
}



app.on('ready', () => {

  var {
    height
  } = screen.getPrimaryDisplay().workArea;
  
  //main window 
  var ration = 2;
  width = height/ration;
  width = width - (width%10);
 
  temp = -1*width;
  win = new BrowserWindow({
    height: height,
    width: width,
    frame: false,
    show: false,
    resizable: false,

    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "/js/dbconnect.js")

    },
    transparent: true

  });
  win.loadFile("./html/pane.html");
  win.setPosition(-1*width, 0);

  // album menu window
  albumMenu = new BrowserWindow({
    height: 600,
    width: 400,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "/js/dbconnect.js")

    }
  });
  albumMenu.loadFile("./html/album-menu.html");
  albumMenu.setPosition(10, 10);


  //window to apply filter
  filterWindow = new BrowserWindow({
    height: 600,
    width: 400,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,


    }
  });
  filterWindow.loadFile("./html/filter.html");
  filterWindow.setPosition(10, 10);

  // produce tray icon in icon trays
  tray = new Tray(path.join(__dirname, "images/newsbuddy.png"));

  // moves in the window when u click the try icon
  tray.on("click", (events, bounds) => {

    if (!movingin && movingout) {

      win.show();
      movingin = true;
      movingout = false;
      clearInterval(slideout);
      slidein = setInterval(() => movein(), 4);

    } else {
      
      clearInterval(slidein);
      movingin = false;
      movingout = true;
      slideout = setInterval(() => moveout(), 4);
      
    }
  });


  //moves out the window when we click somewhhere else on screen
  // win.on("blur", () => {

  //   if (movingin || !movingout) {
  //     //console.log("sliding out");
  //     clearInterval(slidein);
  //     movingin = false;
  //     movingout = true;
  //     slideout = setInterval(() => moveout(), 4);
  //   }

  // });

  //hiding secondary screens to of clicking somewhere else on screen
  albumMenu.on("blur", () => {
    albumMenu.hide();
  });
  filterWindow.on("blur", () => {
    filterWindow.hide();

  });


});