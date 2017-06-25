var mongoose    = require('mongoose');
var config      = require('./config');

mongoose.connect('localhost:3000');
var db = mongoose.connection;

db.on('error', function (err) {
    console.log(err.message);
});
db.once('open', function callback () {
  console.log("Connected to DB!");
});

var Schema = mongoose.Schema;

var Weather = new Schema({
    city: { type: String, required: true },
    list: { type: Array, required: true },
    modified: { type: Date, default: Date.now }
});


var WeatherModel = mongoose.model('Weather', Weather);

module.exports.WeatherModel = WeatherModel;
