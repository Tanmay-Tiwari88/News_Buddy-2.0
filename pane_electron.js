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
const widthx = 500;
let tray;
let temp = -widthx;
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
  albumMenu.show()
  albumMenu.webContents.send('Send-Article-menu', tp);


});

//launch filterWindow
ipcMain.on('launch-filterWindow', (event, tp) => {
  filterWindow.show()
  filterWindow.webContents.send('show them', tp);


});


//hides album menu after saving the article
ipcMain.on('close-menu', (event, message) => {
  albumMenu.hide();
});

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
  if (temp <= -1 * widthx) {

    win.hide();
    clearInterval(slideout);

  }
}



app.on('ready', () => {

  var {
    width,
    height
  } = screen.getPrimaryDisplay().workArea;

  //main window 
  win = new BrowserWindow({
    height: height,
    width: 500,
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
  win.setPosition(-widthx, 0);

  // album menu window
  albumMenu = new BrowserWindow({
    height: 600,
    width: 400,
    show: false,
    parent: win,
    modal: true,
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
    parent: win,
    modal: true,
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
      //console.log("sliding in")
      win.show();
      movingin = true;
      movingout = false;
      clearInterval(slideout);
      slidein = setInterval(() => movein(), 4);

    }
  });


  //moves out the window when we click somewhhere else on screen
  win.on("blur", () => {

    if (movingin || !movingout) {
      //console.log("sliding out");
      clearInterval(slidein);
      movingin = false;
      movingout = true;
      slideout = setInterval(() => moveout(), 4);
    }

  });


  albumMenu.on("blur", () => {
    albumMenu.hide();
  });
  filterWindow.on("blur", () => {
    filterWindow.hide();

  });


});