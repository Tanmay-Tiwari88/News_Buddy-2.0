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
var curkw = defaultkeyword;

//Function too get todays date for default search 
function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
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

//Function to search a specific keyword and load it on main page
function search() {
  curkw = document.getElementById("search-text").value;
  loadCategotry('everything', undefined, undefined, curkw, undefined, undefined, 'date', undefined, "en");
}

function getDateString(dateString) {
  var res = '';

  var year = dateString.getFullYear();
  var month = dateString.getMonth() + 1;
  var date = dateString.getDate();
  if (date < 10) date = '0' + date;
  if (month < 10) month = '0' + month;

  return year + "-" + month + "-" + date;
}

//Function to make a api call all get artilce and load it on main page
async function loadCategotry(endPoint = '', category = '', country = '', keyword = '', dateFrom = '', dateTo = '', sortBy = '', source = '', lang = 'en') {
  
  var tp = await fetchApiResult(endPoint, category, country, keyword, dateFrom, dateTo, sortBy, source, lang).then(function (val) {
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
            <img class="card-img-top" src="${tp[i]["urlToImage"]}" alt="Card image">
            
            <div class="card-header">
              Source : ${tp[i]["source"]["name"]} 
              <span style="float:right;">Published At : ${tp[i]["publishedAt"].substr(0,10)} </span>
            </div>
            <div class="card-body">
              <h5 class="card-title"><b>${tp[i]['title']} </b></h5>
              <p class="desc" id='${id_desc}'>${tp[i]['description']}</p>
              <a href="#"  id="${rid_btn}" onclick="showDesc('${id_desc}','${rid_btn}','${lid_btn}')" style="margin-right:5%; margin-left:5%"><i class="fa fa-arrow-down" aria-hidden="true"></i>
              </a>
              <a href="#" class=" rl-btn" id="${lid_btn}" onclick="hideDesc('${id_desc}','${rid_btn}','${lid_btn}')" style="margin-right:5%"><i class="fa fa-arrow-up" aria-hidden="true"></i>
              </a>
              <a href="#"  onclick="saveArticle('${news_card_id}')" style="margin-right:5%"><i class="fa fa-bookmark" aria-hidden="true"></i></a>
              <a href="#" class="Album-btn" onclick="sendArticle('${news_card_id}')" style="margin-right:5%"><i class="fa fa-plus-circle" aria-hidden="true"></i>
              </a>
            </div>
          `
  }



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

    var date = albumArticles[i]["publishedAt"].getFullYear();
    date += '-' + albumArticles[i]["publishedAt"].getMonth();
    date += '-' + albumArticles[i]["publishedAt"].getDate();
    articles[news_card_id] = albumArticles[i];


    var date = getDateString(albumArticles[i]["publishedAt"]);

    console.log(date)

    x.innerHTML += `<div class="card" id="${news_card_id}">
            <img class="card-img-top" src="${albumArticles[i]["urlToImage"]}" alt="Card image">
            <div class="card-header">
              Source : ${albumArticles[i]["source"]}
              <span style="float:right;">Published At : ${date } </span>
            </div>
            <div class="card-body">
              <h5 class="card-title"><b>${albumArticles[i]["title"]} </b></h5>
              <p class="desc" id='${id_desc}'>${albumArticles[i]['description']}</p>
              <a href="#"  id="${rid_btn}" onclick="showDesc('${id_desc}','${rid_btn}','${lid_btn}')" style="margin-right:5%; margin-left:5%" ><i class="fa fa-arrow-down" aria-hidden="true"></i>
              </a>
              <a href="#" class=" rl-btn" id="${lid_btn}" onclick="hideDesc('${id_desc}','${rid_btn}','${lid_btn}')" style="margin-right:5%"><i class="fa fa-arrow-up" aria-hidden="true"></i>
              </a>
              <a href="#" ><i class="fa fa-trash" onclick="deleteArticle('${AlbumName}', '${albumArticles[i]['url']}' )"  style="margin-right:5%" ></i></a>
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

function launchFilterWin() {

  ipcRenderer.send('launch-filterWindow', "get filtering parameter");

}

ipcRenderer.on("sending filter para", (event, paras) => {
  
  loadCategotry(paras['endPoint'], paras["category"], paras["country"], curkw, paras["dateFrom"], paras["dateTo"], paras["sort-by"], paras["source"], paras["language"]);

})


//function to save Article to savedArtice collection in database
function saveArticle(id) {


  var save = db.CreatDocument("savedArticle", articles[id]["url"], 
        articles[id]["title"], articles[id]["source"]["name"], articles[id]["description"], articles[id]["publishedAt"],articles[id]["urlToImage"]);
  


}

//Function to delete Atricle from give collecction
async function deleteArticle(AlbumName, url) {

  db.deletDocument(AlbumName, url);
  var artCount = await db.getCount(AlbumName);

  //if number of article in Article is 0 we drop that Article
  if (artCount == 0)
    db.dropCollection(AlbumName);

  loadAlbum(AlbumName);
}

