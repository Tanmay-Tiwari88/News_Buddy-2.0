const request = require('request');


function fetchApiResult(category='everything',country='',keyword='Covid',dateFrom='',dateTo='',sortBy='',source='')
{
    return new Promise(function(resolve,reject){
        var url=`https://newsapi.org/v2/${category}?`
        if(keyword!='')url+=`q=${keyword}&`
        if(country!='')url+=`country=${country}&`
        if(dateFrom!='')url+=`from=${dateFrom}&`
        if(dateTo!='')url+=`to=${dateTo}&`
        if(sortBy!='')url+=`sortBy=${sortBy}&`
        if(source!='')url+=`source=${source}&`
        url+='apiKey=64b11e57419f455da95bd52189b56246'
        console.log(url);
        request(url,(err,res,body)=>{
        
        if(err) return reject(err);

        try{
            resolve(JSON.parse(body)['articles']);    

        }catch(e){
            reject(e);
        }
    })

    });
}

module.exports = fetchApiResult;






