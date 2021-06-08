const fetchApiResult = require('../js/Apicall');
//const db = require("../js/db")

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
  console.log(tp)
  for (i in tp) {

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
              <a href="#" class="btn btn-primary " id="${rid_btn}" onclick="showDesc('${id_desc}','${rid_btn}','${lid_btn}')" >Read More</a>
              <a href="#" class="btn btn-primary rl-btn" id="${lid_btn}" onclick="hideDesc('${id_desc}','${rid_btn}','${lid_btn}')" >Read Less</a>
              <a href="#" class="btn btn-primary" onclick="saveArticle('${tp[i]["url"]}','${tp[i]["title"]}','${tp[i]["source"]["name"]}','${tp[i]["description"]}')">Save</a>
              <a href="#" class="btn btn-primary">Add To Album</a>
            </div>
          </div>`
  }


}

function search() {
  var kw = document.getElementById("search-text").value;
  loadCategotry(undefined, undefined, kw, undefined, undefined, 'date', undefined);
}

function saveArticle(url, title, source, description) {
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