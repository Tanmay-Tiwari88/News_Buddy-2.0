const fs = require("fs");
var k1in=[1,2,3];
var k2in=[1,2,3];
var k3in=[1,2,3];
var k4in=[1,2,3];

var articles ={};
var articlesmap={};
function setTile(id,obj,divclass) {
    
    var tpn1 = document.getElementById(id);

    var titleClass ='';

    articlesmap[id]=obj;

    if(divclass=="cn-img")
        titleClass='cn-title'

    else titleClass = 'tn-title'

    var imgurl =obj['urlToImage'];
        
    
        
    if (imgurl==null)imgurl = 'img/news-450x350-1.jpg';
    const popid = 'myPop'+id.replace('-','')

    

    tpn1.innerHTML+=`
    <div class="popup" onmouseenter="myFunction('${popid}')" onmouseleave="anfunc('${popid}')">
        <div class="${divclass}">
            <img src="${imgurl}" />
            <div class="${titleClass}">
                <a href=""><b>${obj['title']}</b></a>
            </div>
        </div>
    
        <div class="row popuptext" id = "${popid}" onclick= "loadSingleArticle('${id}')">
            <div class="col s12 m6">
                <div class="card " style="width: 18rem;">
                    <img class="card-img-top" src="${imgurl}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${obj['title']}</h5>
                        <p class="card-text">${obj['description']}</p>
                    
                    </div>
                </div>
            </div>
        </div>
  </div>`
}

const x=fs.readFile("js/homepage.json", 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file from disk:", err)
        return
    }
    try {
        articles = JSON.parse(jsonString);

        setTile("top-news1",articles['top-headlines'][0],"tn-img");
        setTile("top-news2",articles['top-headlines'][1],"tn-img");
        setTile("top-news3",articles['top-headlines'][2],"tn-img");
        setTile("top-news4",articles['top-headlines'][3],"tn-img");
        setTile("top-news5",articles['top-headlines'][4],"tn-img");
        setTile("top-news6",articles['top-headlines'][5],"tn-img");
        setTile("top-news7",articles['top-headlines'][6],"tn-img");
        setTile("top-news8",articles['top-headlines'][7],"tn-img");

        setTile("cat1-news1",articles['sports'][0],"cn-img");
        setTile("cat1-news2",articles['sports'][1],"cn-img");
        setTile("cat1-news3",articles['sports'][2],"cn-img");
        setTile("cat1-news4",articles['sports'][3],"cn-img");

        setTile("cat2-news1",articles['technology'][0],"cn-img");
        setTile("cat2-news2",articles['technology'][1],"cn-img");
        setTile("cat2-news3",articles['technology'][2],"cn-img");
        setTile("cat2-news4",articles['technology'][3],"cn-img");

        setTile("cat3-news1",articles['Business'][0],"cn-img");
        setTile("cat3-news2",articles['Business'][1],"cn-img");
        setTile("cat3-news3",articles['Business'][2],"cn-img");
        setTile("cat3-news4",articles['Business'][3],"cn-img");

        setTile("cat4-news1",articles['entertainment'][0],"cn-img");
        setTile("cat4-news2",articles['entertainment'][1],"cn-img");
        setTile("cat4-news3",articles['entertainment'][2],"cn-img");
        setTile("cat4-news4",articles['entertainment'][3],"cn-img");

        
        
    
    }catch(err){
        console.log(err);
    }
});

const y= async ()=>{
    var x=await x;
    console.log(articles["sports"]);
}

function myFunction(idx) {

    var popup = document.getElementById(idx);
    popup.classList.toggle("show",true);
}
function anfunc(idx){
    var popup = document.getElementById(idx);
    popup.classList.toggle("show",false);
}
async function  loadSingleArticle(id) {
    console.log("yo")
    const x=await fs.writeFile("js/temp.json",JSON.stringify( articlesmap[id]) ,(err)=>{
        if(err)console.log(err);
        else console.log("successes")
    });
    
        
        location.href = 'single-page.html';

    
}