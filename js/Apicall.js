const request = require('request');


function fetchApiResult(endPoint = 'everything' ,category='',country = '', keyword = '', dateFrom = '', dateTo = '', sortBy = '', source = '',language='') {
    return new Promise(function (resolve, reject) {


        console.log(dateTo);
        var url = `https://newsapi.org/v2/${endPoint}?`
        if (keyword != '') url += `q=${keyword}&`
        if (country != '') url += `country=${country}&`
        if (dateFrom != '') url += `from=${dateFrom}&`
        if (dateTo != '') url += `to=${dateTo}&`
        if (sortBy != '') url += `sortBy=${sortBy}&`
        if (source != '') url += `sources=${source}&`
        if (category != '') url += `category=${category}&`
        if (language != '') url += `language=${language}&`
        url += 'apiKey=2f1766759ade49a88efdd06cc1b580ae'
        console.log(url);
        request(url, (err, res, body) => {

            if (err) return reject(err);

            try {
                resolve(JSON.parse(body)['articles']);

            } catch (e) {
                reject(e);
            }
        })

    });
}

module.exports = fetchApiResult;