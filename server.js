var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
//adding these to decode html elements
var Encoder = require('node-html-encoder').Encoder;
var encoder = new Encoder('entity');
var apicache = require('apicache').options({ debug: true }).middleware;


app.get('/restaurants', apicache('10 minutes'), function(req, res){
	url = 'https://www.skipthedishes.com/winnipeg/restaurants';
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var jsonarray = [];

			//$('.restaurant-list').each(function(){ console.log($(this).attr('data-restaurant-name'));});
			var baseUrl = "https://www.skipthedishes.com"
			$('.restaurant-list').each(function(){
				var restaurantName = $(this).find('span.restaurant-name').html();
				var link = $(this).find('a.show-loading').attr('href');
				var rating = $(this).attr('data-restaurant-rating');
				restaurantNamePretty = encoder.htmlDecode(restaurantName.replace(/\&apos;/g, "'"));
				//build the JSON object then add it to the array
				var json = {name : '', url : '', rating : ''};
				json.name = restaurantNamePretty;
				json.url = baseUrl+link;
				json.rating = rating;
				jsonarray.push(json);
			});
		}//end if error
		//build final JSON object
		var restaurantsJson = { restaurants : '' };
		restaurantsJson.restaurants = jsonarray;
  	res.json(restaurantsJson);
	})//end request
})//end app.get call

app.listen('8080');
console.log('Magic happens on port 8080');
exports = module.exports = app;
