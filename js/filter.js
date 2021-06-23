const path = require("path");
const BrowserWindow = require('electron').remote.BrowserWindow;
const {
  ipcRenderer
} = require("electron");

var parameters;
ipcRenderer.on('show-them', (event, tp) => {

  console.log(tp);

})

function sendParameters() {
  var source = document.getElementById("src").value;
  var country = document.getElementById("con").value;
  var category = document.getElementById("cat").value;
  //var  sort-by= document.getElementById("sort");
  var dateFrom = document.getElementById("dateFrom").value;
  var dateTo = document.getElementById("dateTo").value;

  source = source.replace(" ", "-").toLowerCase();
  country = country.toLowerCase();

  parameters = {
    "source": source,
    "category": category,
    "country": country,
    "dateFrom": dateFrom,
    "dateTo": dateTo
  };
  parameters = JSON.stringify(parameters)
  ipcRenderer.send('sending-Parameters', parameters);

}