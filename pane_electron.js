const {app, BrowserWindow, screen, Tray, webContents} = require("electron");
const path = require("path");
const { clearInterval } = require("timers");

let win;
const widthx=500;
let tray;
let temp=-widthx;
var loadInTimer;
var loadoutTimer;

var slidein;
var slideout
var movingin=false;
var movingout=true;


function movein()
{
  temp+=10;
  
  win.setPosition(temp,0);
  if(temp==0){

    clearInterval(slidein);
  }
 
}
function moveout()
{
  temp-=10;
  
  win.setPosition(temp,0);
  if(temp<=-1*widthx){
    
    win.hide();
    clearInterval(slideout);
    
  }
}



app.on('ready',() => {

  var {width,height} = screen.getPrimaryDisplay().workArea;


  win = new BrowserWindow({
    height: height,
    width: 500,
    frame: false,
    show:false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload:path.join(__dirname,"js/dbconnect.js")
    },
    transparent:true
    




  });
  win.loadFile("./html/pane.html");
  win.setPosition(-widthx,0);


  tray = new Tray(path.join(__dirname, "images/newsbuddy.png"));

  tray.on("click", (events, bounds) => {

    if (!movingin && movingout) {
      //console.log("sliding in")
      win.show();
      movingin=true;
      movingout=false;
      clearInterval(slideout);
      slidein=setInterval(()=>movein(),4);   
      
    } 
    // else{
    //   console.log("sliding out");
    //   clearInterval(slidein)
    //   movingin=false;
    //   movingout=true;
    //   slideout=setInterval(()=>moveout(),0.00000000000000000000000000000000001);
    // }

   
  


  });
  


  win.on("blur", () => {
    
    if(movingin || !movingout ){
      //console.log("sliding out");
      clearInterval(slidein);
      movingin=false;
      movingout=true;
      slideout=setInterval(()=>moveout(),4);
    }
     
   });
  
  
});

function search(){
  var kw= document.getElementById("search-text").value;
  load
}
