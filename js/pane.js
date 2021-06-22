const fetchApiResult = require('../js/Apicall');
const path = require("path");
const BrowserWindow = require('electron').remote.BrowserWindow;
const {
  ipcRenderer
} = require("electron");
const db = require("../js/db");
const mongoose = require("mongoose")

//global Variables in use
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
async function loadCategotry(category = 'everything', country = '', keyword = defaultkeyword, dateFrom = getTodaysDate(), dateTo = '', sortBy = '', source = '') {

  var tp = await fetchApiResult(category, country, keyword, dateFrom, dateTo, sortBy, source).then(function (val) {
    return val;

  }).catch(function (err) {
    console.log(err)
  });


  var x = document.getElementById("news-cards");

  x.innerHTML = ``

  for (i in tp) {

    var tps = JSON.stringify(tp);
    var news_card_id = "news_car" + i;
    var id_desc = "new-card-desc" + i;
    var rid_btn = "new-card-desc-R" + i;
    var lid_btn = "new-card-desc-L" + i;
    articles[news_card_id] = tp[i];

    x.innerHTML += `<div class="card" id="${news_card_id}">
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
              <a href="#"  onclick="saveArticle('${news_card_id}')"><i class="fa fa-bookmark" aria-hidden="true"></i></a>
              <a href="#" class="Album-btn" onclick="sendArticle('${news_card_id}')"><i class="fa fa-plus-circle" aria-hidden="true"></i>
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


  var albumArticles = await db.getDocument(AlbumName);

  x = document.getElementById("news-cards");

  x.innerHTML = ``


  for (i in albumArticles) {

    var news_card_id = "news_car" + i;
    var id_desc = "new-card-desc" + i;
    var rid_btn = "new-card-desc-R" + i;
    var lid_btn = "new-card-desc-L" + i;
    articles[news_card_id] = albumArticles[i];

    x.innerHTML += `<div class="card" id="${news_card_id}">
            <div class="card-header">
              Source : ${albumArticles[i]["source"]}
            </div>
            <div class="card-body">
              <h5 class="card-title"><b>${albumArticles[i]["title"]} </b></h5>
              <p class="desc" id='${id_desc}'>${albumArticles[i]['description']}</p>
              <a href="#"  id="${rid_btn}" onclick="showDesc('${id_desc}','${rid_btn}','${lid_btn}')" ><i class="fa fa-arrow-down" aria-hidden="true"></i>
              </a>
              <a href="#" class=" rl-btn" id="${lid_btn}" onclick="hideDesc('${id_desc}','${rid_btn}','${lid_btn}')" ><i class="fa fa-arrow-up" aria-hidden="true"></i>
              </a>
              <a href="#" ><i class="fa fa-trash" onclick="deleteArticle('${AlbumName}', '${albumArticles[i]['url']}')"></i></a>
            </div>
          </div>`
  }

}



//Fuction to show the list off albums user have
function showAlbums() {


  
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

//Sends article to Album menu process
function sendArticle(id) {

  ipcRenderer.send('Sending-Article', articles[id]);

}

function launchFilterWin(){

  ipcRenderer.send('launch-filterWindow', "get filtering parameter");

}

ipcRenderer.on("sending filter para",(event,paras)=>{
  console.log(paras)
  var kw = document.getElementById("search-text").value;
  loadCategotry(paras["category"], paras["country"], kw, paras["dateFrom"], paras["to"],undefined, paras["source"]);
})


//function to save Article to savedArtice collection in database
function saveArticle(id) {


  db.CreatDocument("savedArticle", articles[id]["url"], articles[id]["title"], articles[id]["source"]["name"], articles[id]["description"]);

}

//Function to delete Atricle from give collecction
async function deleteArticle(AlbumName, url) {
  db.deletDocument(AlbumName, url);
  var artCount = await db.getCount(AlbumName);

  console.log(artCount);
  //if number of article in Article is 0 we drop that Article
  if (artCount == 0)
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