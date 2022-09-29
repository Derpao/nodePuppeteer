// var axios = require('axios');
import axios from 'axios'
var data = JSON.stringify({
    "collection": "football",
    "database": "football",
    "dataSource": "derpao",
    "filter": {
        title: "api-football"
    }
});
            
var config = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/data-aumyv/endpoint/data/v1/action/findOne',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': 'xjWJ9LBwo6h4DGMS8EMB31vIlXDwlJcVrcVG4VeVHJ8OfznoxsivjFizQdsUKBaJ',
    },
    data: data
};
            
axios(config)
    .then(function (response) {
        // console.log(JSON.stringify(response.data));
        const testDD = response.data;
        console.log(testDD.document.title);
        console.log(testDD);
    })
    .catch(function (error) {
        console.log(error);
    });