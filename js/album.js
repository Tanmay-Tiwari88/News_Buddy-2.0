const {
  spawn
} = require("child_process");
const fs = require('fs');
const db = require("../js/db");
var x;


function callScript(url, source) {
  article = null;
  const childPython = spawn('python', ['pythonScript/newsArticleScraper.py', url]);


  childPython.stdout.on('data', (data) => {
    console.log(`${data}`);
    const datastring = data.toString();


    const tp = eval(`(${datastring})`);
    x.innerHTML += `<div class="card" id="new-card">
            <div class="card-header">
              Source : ${source}
            </div>
            <div class="card-body">
              <h5 class="card-title"><b>${tp['title']} </b></h5>
              <p>${tp['description']}</p>
              <a href="#" class="btn btn-primary">Read More</a>
              <a href="#" class="btn btn-primary">Un-Save</a>
            </div>
          </div>`


  });

  childPython.stderr.on('data', (data) => {
    console.log(`${data}`);


    console.error(`${data}`);
  });

  childPython.on('close', (code) => {
    console.log(`child process exited code with ${code}`);
  });




}
async function loadAlbum(AlbumName) {

  var articles = await db.getDocument(AlbumName);
  console.log(articles)
  x = document.getElementById("news-cards");

  x.innerHTML = ``


  for (i in articles) {

    var id_desc = "new-card-desc" + i;
    var rid_btn = "new-card-desc-R" + i;
    var lid_btn = "new-card-desc-L" + i;
    console.log(articles[i]["url"], articles[i]["source"]);
    //callScript(articles[i]["url"],articles[i]["source"]);
    x.innerHTML += `<div class="card" id="new-card">
            <div class="card-header">
              Source : ${articles[i]["source"]}
            </div>
            <div class="card-body">
              <h5 class="card-title"><b>${articles[i]["title"]} </b></h5>
              <p class="desc" id='${id_desc}'>${articles[i]['description']}</p>
              <a href="#" class="btn btn-primary " id="${rid_btn}" onclick="showDesc('${id_desc}','${rid_btn}','${lid_btn}')" >Read More</a>
              <a href="#" class="btn btn-primary rl-btn" id="${lid_btn}" onclick="hideDesc('${id_desc}','${rid_btn}','${lid_btn}')" >Read Less</a>
              <a href="#" class="btn btn-primary">Un-Save</a>
            </div>
          </div>`
  }









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