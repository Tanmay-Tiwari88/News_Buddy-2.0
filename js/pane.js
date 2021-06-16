const fetchApiResult = require('../js/Apicall');
const path = require("path");
const BrowserWindow = require('electron').remote.BrowserWindow;
const {ipcRenderer} = require("electron");
const db = require("../js/db");
const mongoose = require("mongoose")

var x;
var defaultkeyword = "Covid";
var articles = {};

//Function too get todays date for default search 
function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}


//Function to make a api call all get artilce and load it on main page
async function loadCategotry(category = 'everything', country = '', keyword = defaultkeyword, dateFrom = '', dateTo = '', sortBy = '', source = '') {

  var tp = await fetchApiResult(category, country, keyword, dateFrom, dateTo, sortBy, source).then(function (val) {
    return val;

  }).catch(function (err) {
    console.log(err)
  });

  var x = document.getElementById("news-cards");

  x.innerHTML = ``

  for (i in tp) {

    var tps = JSON.stringify(tp);
    
    var id_desc = "new-card-desc" + i;
    var rid_btn = "new-card-desc-R" + i;
    var lid_btn = "new-card-desc-L" + i;

    x.innerHTML += `<div class="card">
            <div class="card-header">
              Source : ${tp[i]["source"]["name"]}
            </div>
            <div class="card-body">
              <h5 class="card-title"><b>${tp[i]['title']} </b></h5>
              <p class="desc" id='${id_desc}'>${tp[i]['description']}</p>
              <a href="#"  id="${rid_btn}" onclick="showDesc('${id_desc}','${rid_btn}','${lid_btn}')" ><i class="fa fa-arrow-down" aria-hidden="true"></i>
              </a>
              <a href="#" class=" rl-btn" id="${lid_btn}" onclick="hideDesc('${id_desc}','${rid_btn}','${lid_btn}')" ><i class="fa fa-arrow-up" aria-hidden="true"></i>
              </a>
              <a href="#"  onclick="saveArticle('${tp[i]["url"]}','${tp[i]["title"]}','${tp[i]["source"]["name"]}','${tp[i]["description"]}')"><i class="fa fa-bookmark" aria-hidden="true"></i></a>
              <a href="#" class="Album-btn" onclick="sendArticle('${tp[i]["url"]}','${tp[i]["title"]}','${tp[i]["source"]["name"]}','${tp[i]["description"]}')"><i class="fa fa-plus-circle" aria-hidden="true"></i>
              </a>
            </div>
          </div>`
  }



}

//Function to search a specific keyword and load it on main page
function search() {
  var kw = document.getElementById("search-text").value;
  loadCategotry(undefined, undefined, kw, undefined, undefined, 'date', undefined);
}



//Function to fetch a speciic collection from database and load it on main screen
async function loadAlbum(AlbumName) {


  var articles = await db.getDocument(AlbumName);

  x = document.getElementById("news-cards");

  x.innerHTML = ``


  for (i in articles) {

    var id_desc = "new-card-desc" + i;
    var rid_btn = "new-card-desc-R" + i;
    var lid_btn = "new-card-desc-L" + i;
    //callScript(articles[i]["url"],articles[i]["source"]);
    x.innerHTML += `<div class="card" id="new-card">
            <div class="card-header">
              Source : ${articles[i]["source"]}
            </div>
            <div class="card-body">
              <h5 class="card-title"><b>${articles[i]["title"]} </b></h5>
              <p class="desc" id='${id_desc}'>${articles[i]['description']}</p>
              <a href="#"  id="${rid_btn}" onclick="showDesc('${id_desc}','${rid_btn}','${lid_btn}')" ><i class="fa fa-arrow-down" aria-hidden="true"></i>
              </a>
              <a href="#" class=" rl-btn" id="${lid_btn}" onclick="hideDesc('${id_desc}','${rid_btn}','${lid_btn}')" ><i class="fa fa-arrow-up" aria-hidden="true"></i>
              </a>
              <a href="#" ><i class="fa fa-trash" onclick="deleteArticle('${AlbumName}', '${articles[i]['url']}')"></i></a>
            </div>
          </div>`
  }

}



//Fuction to show the list off albums user have
function showAlbums() {


  console.log("fuck");
  var x = document.getElementById("news-cards");



  mongoose.connection.db.listCollections().toArray(function (err, names) {
    x.innerHTML = ``;
    for (i in names) {
      var name = names[i]["name"];

      console.log(name);
      x.innerHTML += `<div class="card">
            
              <div class="card-body">
              <a href="#" onclick="loadAlbum('${name}')">
                      ${names[i]['name']}</a>
                      <a a href="#" onclick="db.dropCollection('${name}');showAlbums()" style="float:right")"><i class="fa fa-trash"></i></a>
                      
              </div>
             </div>`
    }
  })



}

function sendArticle(url, title, source, desc){

  console.log('yo');
  var tps ={
    "url":url,
    "title":title,
    "source":source,
    "desc":desc
  };

  ipcRenderer.send('Sending-Article',tps);

}


//function to save Article to savedArtice collection in database
function saveArticle(url, title, source, description) {


  db.CreatDocument("savedArticle", url, title, source, description);
  
}

//Function to delete Atricle from give collecction
async function deleteArticle(AlbumName,url)
{
    db.deletDocument(AlbumName,url);
    var artCount =await  db.getCount(AlbumName);

    console.log(artCount);
    //if number of article in Article is 0 we drop that Article
    if(artCount == 0)
    db.dropCollection(AlbumName);

    loadAlbum(AlbumName);
}

//function to show full description off News Article

function showDesc(id, rid_btn, lid_btn) {
  console.log(id);
  var x = document.getElementById(id);
  document.getElementById(rid_btn).style.display = "none";
  document.getElementById(lid_btn).style.display = "inline";

  x.style.display = "block";

}

//function to hide full description off News Article

function hideDesc(id, rid_btn, lid_btn) {

  console.log(id);
  var x = document.getElementById(id);
  document.getElementById(lid_btn).style.display = "none";
  document.getElementById(rid_btn).style.display = "inline";

  x.style.display = "none";

}


