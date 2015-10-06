var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/skipApp');
var Collection = require('./models/collection');
var Encoder = require('node-html-encoder').Encoder;
var encoder = new Encoder('entity');

//url = 'https://www.skipthedishes.com/winnipeg/restaurants';
var cities = [
    {
      name: 'winnipeg',
      url: 'https://www.skipthedishes.com/winnipeg/restaurants'
    },
    {
      name: 'regina',
      url: 'https://www.skipthedishes.com/regina/restaurants'
    },
    {
      name: 'edmonton',
      url: 'https://www.skipthedishes.com/edmonton/restaurants'
    }
  ];

var minutes = 2, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my 2 minute scrape");
    
  cities.forEach(function(city){
    request(city.url, function(error, response, html){
      console.log(city.name);
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
          var restaurantsJson = { restaurants : '' };
          restaurantsJson.restaurants = jsonarray;
          console.log("Connection Served");
          //console.log(restaurantsJson);
          var collection = new Collection(); //create instance of bear object
          collection.status = 'OK';
          collection.date = new Date();
          collection.city = city.name ; //grab the request body property of name and set it as the bears name
          collection.restaurants = jsonarray;
          //save it and check for errors
          collection.save(function(err) {
            if (err) {
              console.log('Error occurred');
            } else {
              console.log('collection saved for '+city.name);
            }
          });
        } else {
          console.log('error occurred');
        }// end if not error
     });
  });//end for each city loop
}, the_interval);
