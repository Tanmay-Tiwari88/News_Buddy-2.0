db = require("../js/db.js")

const mongoose = require('mongoose');

const {
    ipcRenderer
} = require('electron');

var article;



ipcRenderer.on('Send-Article-menu', (event, tp) => {

    var menuGrp = document.getElementById("menu-grp");
    menuGrp.innerHTML = '';

    article = tp;





    //trying to get collection names
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        menuGrp.innerHTML = '';
        for (i in names) {
            var name = names[i]["name"];

            menuGrp.innerHTML += `<a href="#" class="list-group-item list-group-item-action"  
            style = "background-color:#202225; color:#DEEEEA; margin_bottom:10%"
            onclick="saveArticle('${name}')">
          ${names[i]['name']}</a>`
        }
        menuGrp.innerHTML +=
            `<div class="footer fixed-bottom" style="background-color: #141518; margin: 5 5 0 5; padding: 10px; position:fixed;">
        <div class="input-group rounded">
        <input  class="form-control rounded" placeholder="Add to new album" id="newAlbum-name" />
            <span class="btn input-group-text border-0 " id="search-addon" style="background-color: #141518" 
            onclick="addnewalb()">
                <i class="fa fa-plus" aria-hidden="true"></i>
            </span>
        </div>
        </div>
        </div>`

    });





})




function saveArticle(albName) {
    console.log(article["url"])
    db.CreatDocument(albName, article['url'], article['title'], article['source']['name'], article['description'], article['publishedAt'], article['urlToImage']);
    ipcRenderer.send('close-menu', 'success');
}

function addnewalb() {

    albName = document.getElementById("newAlbum-name").value
    db.CreatDocument(albName, article['url'], article['title'], article['source']['name'], article['description'], article['publishedAt'], article['urlToImage']);
    ipcRenderer.send('close-menu', 'success');


}