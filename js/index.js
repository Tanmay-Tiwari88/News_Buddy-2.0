const fetchApiResult = require('../js/Apicall');

var defaultkeyword ="Covid";
var articles = {};

function getTodaysDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

async function loadCategotry(category = 'everything', country = '', keyword = defaultkeyword, dateFrom = getTodaysDate(), dateTo = '', sortBy = '', source = '') {

    var tp = await fetchApiResult(category, country, keyword, dateFrom, dateTo, sortBy, source).then(function (val) {
        return val;

    }).catch(function (err) {
        console.log(err)
    });

    var x = document.getElementById("news-cards");

    x.innerHTML = ``

    for (i in tp) {
        
            if(tp[i]["urlToImage"]==null)
            continue;

            x.innerHTML += `<div class="card">
            <div class="row no-gutters">
            <div class="col-auto">
            <img src="${tp[i]["urlToImage"]}" class="news-img" alt="">
            </div>
            <div class="col">
             <div class="card-block px-2">
            <h4 class="card-title"><b>${tp[i]["title"]}</b></h4>
            <p class="card-text">${tp[i]["description"]}</p>
            
            </div>
            </div>  
            </div>

            </div>`
        }
    

}

function search() {
    var search_text = document.getElementById("searchText");
    var kw = search_text.value
    console.log(kw)

    loadCategotry(undefined, undefined, kw)
}