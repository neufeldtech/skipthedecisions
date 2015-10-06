// app/models/bear.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CollectionSchema = new Schema({
  status: String,
  date: Date,
  city: String,
  restaurants: [
    {
      name: String,
      url: String,
      rating: String
    }
  ]
});

module.exports = mongoose.model('Collection', CollectionSchema);
