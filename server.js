//importing modules
var express = require('express');
//var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/skipApp');
var Collection = require('./models/collection');
var apicache = require('apicache').options({ debug: true }).middleware;

//uncomment this to turn on CORS
/*
var cors = require('cors')
var corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));
*/

app.get('/restaurants', apicache('30 seconds'), function(req, res){
  Collection.find(function(err, restaurants) {
    if (!err) {
      res.json(restaurants);
    } else {
      res.json({ status: 'ERROR' })
    }
  }).sort({date: -1}).limit(20);
});

//serve static files in public directory

//app.use(express.static('public'));
//serve static content from /public.  Set cache headers to one day
var oneDay = 86400000;
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.get('/cities', apicache('30 seconds'), function(req, res){
  Collection.distinct('city', function(err, restaurants) {
    if (!err) {
      res.json(restaurants);
    } else {
      res.json({ status: "ERROR" });
    }
  });
});

app.get('/restaurants/:city', apicache('30 seconds'), function(req, res){
  Collection.find({city: req.params.city },function(err, restaurants) {
    if (!err) {
      res.json(restaurants[0]);
    } else {
      res.json({status: 'ERROR'});
    }
  }).sort({date: -1}).limit(1);
})//end app.get call

app.listen('8080');
console.log('Magic happens on port 8080');
exports = module.exports = app;
