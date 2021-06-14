const fetchApiResult = require('../js/Apicall');
const path = require("path");
const BrowserWindow = require('electron').remote.BrowserWindow;
const {ipcRenderer} = require("electron");
const db = require("../js/db");

const mongoose = require('mongoose');



var defaultkeyword = "Covid";
var articles = {};

function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

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


function search() {
  var kw = document.getElementById("search-text").value;
  loadCategotry(undefined, undefined, kw, undefined, undefined, 'date', undefined);
}

function saveArticle(url, title, source, description) {


  mongoose.connect('mongodb://localhost:27017/Albums', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        .then(() => console.log("connection succesful"))
        .catch((err) => {
            console.log(err)
        });

  db.CreatDocument("savedArticle", url, title, source, description);
  
}

function showDesc(id, rid_btn, lid_btn) {
  console.log(id);
  var x = document.getElementById(id);
  document.getElementById(rid_btn).style.display = "none";
  document.getElementById(lid_btn).style.display = "inline";

  x.style.display = "block";

}

function hideDesc(id, rid_btn, lid_btn) {
  
  console.log(id);
  var x = document.getElementById(id);
  document.getElementById(lid_btn).style.display = "none";
  document.getElementById(rid_btn).style.display = "inline";

  x.style.display = "none";

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

