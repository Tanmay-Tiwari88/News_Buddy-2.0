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
        url += 'apiKey=b7cff19d4d9f4d5482ac2bf9e8098874'
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