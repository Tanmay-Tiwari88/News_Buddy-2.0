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
  
  //Geting form values
  var endPoint = $("input[type='radio'][name='endPoint']:checked").val();
  var source = document.getElementById("src").value;
  var country = document.getElementById("con").value;
  var category = document.getElementById("cat").value;
  var sortby = $("input[type='radio'][name='sort-by']:checked").val();
  var dateFrom = document.getElementById("dateFrom").value;
  var dateTo = document.getElementById("dateTo").value;

  //formating input
  source = source.replaceAll(" ", "-").toLowerCase();
  country = country.toLowerCase();

  parameters = {
    "endPoint": endPoint,
    "source": source,
    "category": category,
    "country": country,
    "sort-by": sortby,
    "dateFrom": dateFrom,
    "dateTo": dateTo,
    "language": "en"
  };
  
  //converting parameters to string to send to main process
  parameters = JSON.stringify(parameters)
  ipcRenderer.send('sending-Parameters', parameters);

}

//loading form according to input
$(document).ready(function () {
  $('input[name=endPoint]:radio').change(function (e) {
    let value = e.target.value.trim()
    console.log(value)


    switch (value) {
      case 'top-headlines':
        $('#src1').show();
        $('#con1').show();
        $('#cat1').show();
        $('#df').hide();
        $('#dt').hide();
        $('#sb').hide();

        break;
      case 'everything':
        $('#src1').show();
        $('#con1').hide();
        $('#cat1').hide();
        $('#df').show();
        $('#dt').show();
        $('#sb').show();

        break;
      default:
        break;
    }
  })
})