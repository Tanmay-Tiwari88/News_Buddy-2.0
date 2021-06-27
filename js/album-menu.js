db = require("../js/db.js")

const mongoose = require('mongoose');

const {
    ipcRenderer
} = require('electron');




ipcRenderer.on('Send-Article-menu', (event, tp) => {

    var menuGrp = document.getElementById("menu-grp");
    menuGrp.innerHTML = '';

    var url = tp['url'];
    var title = tp['title'];
    var source = tp['source']['name'];
    var desc = tp['description'];
    var pubAt = tp['publishedAt'];
    console.log(tp);




    //trying to get collection names
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        menuGrp.innerHTML = '';
        for (i in names) {
            var name = names[i]["name"];
            console.log(i);

            console.log(name);
            menuGrp.innerHTML += `<a href="#" class="list-group-item list-group-item-action" onclick="saveArticle('${name}','${url}','${title}','${source}','${desc}','${pubAt}')">
          ${names[i]['name']}</a>`
        }
        menuGrp.innerHTML +=
            `<div class="footer fixed-bottom" style="background-color: #141518; margin: 5 5 0 5; padding: 10px; position:fixed;">
        <div class="input-group rounded">
        <input  class="form-control rounded" placeholder="Add to new album" id="newAlbum-name" />
            <span class="btn input-group-text border-0 " id="search-addon" style="background-color: #141518" onclick="addnewalb('${url}','${title}','${source}','${desc}','${pubAt}')">
                <i class="fa fa-plus" aria-hidden="true"></i>
            </span>
        </div>
        </div>
        </div>`

    });





})




function saveArticle(albName, url, title, source, description, pubAt) {

    db.CreatDocument(albName, url, title, source, description, pubAt);
    ipcRenderer.send('close-menu', 'success');
}

function addnewalb(url, title, source, desc, pubAt) {

    albName = document.getElementById("newAlbum-name").value
    db.CreatDocument(albName, url, title, source, desc, pubAt);
    ipcRenderer.send('close-menu', 'success');


}