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
			var jsonarray = [];


			$('.restaurant-list').each(function(){
				console.log($(this).attr('data-restaurant-name'));
			});
			/*
			for (r=0;r < restaurants.length;r++) {
	      var restaurant = restaurants[r];
				restaurant = $(restaurant);
				console.log(restaurant);
				//var json = { name : "" };
				//json.name = restaurant ;
				//jsonarray.push(json);
			}
			*/
		}//end if error
		//fakeresponse
		jsonarray.push({'status':'OK'});
		//endfakeresponse
  	res.json(jsonarray);
	})//end request
})//end app.get call

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
