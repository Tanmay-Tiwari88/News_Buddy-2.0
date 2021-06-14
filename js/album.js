var x;

async function loadAlbum(AlbumName) {


  mongoose.connect('mongodb://localhost:27017/Albums', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => console.log("connection succesful"))
    .catch((err) => {
      console.log(err)
    });

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
              <a href="#" ><i class="fa fa-trash"></i></a>
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


function showAlbums() {



  var x = document.getElementById("news-cards");
  


  mongoose.connect('mongodb://localhost:27017/Albums', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => console.log("connection succesful"))
    .catch((err) => {
      console.log(err)
    });


     
    
     mongoose.connection.on('open', function (ref) {
      console.log('Connected to mongo server.');
      //trying to get collection names
      mongoose.connection.db.listCollections().toArray(function (err, names) {
          x.innerHTML = ``;
          for (i in names) {
              var name = names[i]["name"];

              console.log(name);
              x.innerHTML += `<div class="card">
            
              <div class="card-body">
              <a href="#" onclick="loadAlbum('${name}')">
                      ${names[i]['name']}</a>
                      
              </div>
              </div>`
          }

      });
      
  })
  

}