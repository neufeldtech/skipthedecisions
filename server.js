var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
	// Let's scrape Anchorman 2
	url = 'https://www.skipthedishes.com/winnipeg/restaurants';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var title, release, rating;
			var jsonarray = [];

			$('.restaurant-name').filter(function(){
		        var data = $(this);

		    //    title = data.children().first().text();
//
	//	        json.title = title;
		//        json.release = release;
	    		//console.log(data);
					for (d=0; d < data.length; d++){
						//console.log('----------------------------');
						var restaurant = data[d].children[0].data
						//console.log(restaurant);
						var json = { name : "" };
						json.name = restaurant ;
						jsonarray.push(json);
					}
			    })
					console.log(jsonarray);
					console.log(jsonarray.length);
		}
/*
		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        })
*/
        res.json(jsonarray);
	})
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
