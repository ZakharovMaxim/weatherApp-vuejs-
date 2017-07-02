var express = require('express');
var http = require('http');
var router = express.Router();
var mongo = require('mongodb').MongoClient();
var request = require('request');
var assert = require('assert');
var transliteration = require('transliteration.cyr');

router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/:cityName', function(req, res, next) {
  var url = 'mongodb://localhost:27017/test';
  let weather = [];
  let currentDay = -1;
  var key = 'ddb7e5337922c03da66ddcbd429aea6e';
  var city = req.params.cityName;
  function find(array, date) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].date === date) return i;
    }
    return -1;
  }
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var result = [];
    cursor = db.collection('weather').find({cityName: city}).nextObject(function(err, item) {
      if(item) {
        if((new Date() - item.modified) >= 60*60*24*100) {
          console.log('update in db');
          getDataFromApi(db, true);
        } else {
          item = JSON.parse(JSON.stringify(item));
          console.log('from db');
          res.send(item.data);
        }
      } else {
        console.log('from api');
        getDataFromApi(db);
      }
    });
  });

function getDataFromApi(db, update) {
  request(`http://api.openweathermap.org/data/2.5/forecast?q=${transliteration.transliterate(city)}&APPID=${key}&lang=ru&units=metric`, function (error, response, body) {
    body = JSON.parse(body);
    if(body.cod != 200) res.send(404);
    else {
      body.list.forEach(item => {
        let date = item.dt_txt.split(" ")[0];
        let weatherForDay = {};
        weatherForDay.condition = {};
        weatherForDay.condition.clearSky = 0;
        weatherForDay.condition.cloudySky = 0;
        weatherForDay.condition.liteCloudySky = 0;
        weatherForDay.condition.storm = 0;
        weatherForDay.condition.snow = 0;
        weatherForDay.condition.liteRain = 0;
        weatherForDay.condition.rain = 0;

        item.wind.deg = Math.round(item.wind.deg);
        item.main.temp = Math.round(item.main.temp);
        item.main.temp_min = Math.round(item.main.temp_min);
        item.main.temp_max = Math.round(item.main.temp_max);
        let desc = item.weather[0].description;
        if(!~find(weather, date)) {
          weatherForDay.date = date;
          let dayName = new Date(date.split("-")[0], date.split("-")[1], date.split("-")[2] - 2).toLocaleString("ru", {weekday: 'short'});
          weatherForDay.dayName = dayName.slice(0, 1).toUpperCase() + dayName.slice(1);
          weatherForDay.minT = item.main.temp_min;
          weatherForDay.maxT = item.main.temp_max;
          weatherForDay.avgT = item.main.temp;
          weatherForDay.list = [];
          weatherForDay.list.push(item);

          if(desc == 'дождь' || desc =='сильный дождь' || desc =='ливень') weatherForDay.condition.rain++;
          if(~desc.indexOf('снег')) weatherForDay.condition.snow++;
          if(~desc.indexOf('молния') || ~desc.indexOf('гроза')) weatherForDay.condition.storm++;
          if((~desc.indexOf('облачно') || ~desc.indexOf('пасмурно')) && desc != 'слегка облачно') weatherForDay.condition.cloudySky++;
          if(~desc.indexOf('ясно')) weatherForDay.condition.clearSky++;
          if(desc == 'слегка облачно') weatherForDay.condition.liteCloudySky++;
          if(desc == 'легкий дождь') weatherForDay.condition.liteRain++;
          currentDay++;
          weather.push(weatherForDay);
        } else {
          weather[currentDay].list.push(item);
          if(weather[currentDay].minT > item.main.temp_min) weather[currentDay].minT = item.main.temp_min;
          if(weather[currentDay].maxT < item.main.temp_max) weather[currentDay].maxT = item.main.temp_max;
          weather[currentDay].avgT = Math.round((weather[currentDay].avgT + item.main.temp) / 2);

          if(desc == 'дождь' || desc =='сильный дождь' || desc =='ливень') weather[currentDay].condition.rain++;
          if(~desc.indexOf('снег')) weather[currentDay].condition.snow++;
          if(~desc.indexOf('молния') || ~desc.indexOf('гроза')) weather[currentDay].condition.storm++;
          if((~desc.indexOf('облачно') || ~desc.indexOf('пасмурно')) && desc != 'слегка облачно') weather[currentDay].condition.cloudySky++;
          if(~desc.indexOf('ясно')) weather[currentDay].condition.clearSky++;
          if(desc == 'слегка облачно') weather[currentDay].condition.liteCloudySky++;
          if(desc == 'небольшой дождь') weather[currentDay].condition.liteRain++;

        }
      });
        for(let i = 0; i < weather.length; i++) {
          const condition = {};
          let max = 0;
          let conditionNameEn = '';
          condition.conditionNameRu = '';
          condition.icon = '';
          for(let s in weather[i].condition) {
            if(weather[i].condition[s] > max) {
              max = weather[i].condition[s];
              conditionNameEn = s;
            }
          }
          switch(conditionNameEn){
            case 'rain': condition.conditionNameRu = 'Дождь';  condition.icon = 'wi-day-rain'; break;
            case 'snow': condition.conditionNameRu = 'Снег'; condition.icon = 'wi-day-snow'; break;
            case 'storm': condition.conditionNameRu = 'Гроза'; condition.icon = 'wi-day-sleet-storm'; break;
            case 'cloudySky': condition.conditionNameRu = 'Облачно'; condition.icon = 'cloudy'; break;
            case 'clearSky': condition.conditionNameRu = 'Ясно'; condition.icon = 'wi-day-sunny'; break;
            case 'liteCloudySky': condition.conditionNameRu = 'Слегка облачно'; condition.icon = 'wi-day-cloudy'; break;
            case 'liteRain': condition.conditionNameRu = 'Небольшой дождь'; condition.icon = 'wi-day-showers'; break;
          }
          weather[i].condition = condition;
        }
        if(!update) {
          db.collection('weather').insertOne({cityName: city, data: weather, modified: new Date()}, function(err) {
            assert.equal(null, err);
            db.close();
            res.send(weather);
          });
        } else {
          db.collection('weather').update( {cityName: city},{cityName: city, data: weather, modified: new Date()}, function(err) {
            assert.equal(null, err);
            db.close();
            res.send(weather);
          });
        }
    }

  });
}
});

module.exports = router;
