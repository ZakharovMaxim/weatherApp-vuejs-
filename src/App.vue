<template>
  <div id="app">
    <myForm :isActiveWidget='isActiveWidget' @pressed="search"></myForm>
    <widget v-if="isActiveWidget" :city="city" :weather="weather" :mapURL="mapURL" :status='status' ></widget>
    <widgetLoader v-if="loading"></widgetLoader>
  </div>
</template>

<script>

const key = 'ddb7e5337922c03da66ddcbd429aea6e';
import Widget from './components/Widget'
import myForm from './components/myForm'
import widgetLoader from './components/widgetLoader'

export default {
  name: 'app',
  data () {
    return {
      isActiveWidget: false,
      city: {},
      mapURL: '',
      weather: [],
      status: 200,
      loading: false
    }
  },
  methods: {
    find(array, date) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].date === date) return i;
      }
      return -1;
    },
    search(city) {
      this.loading = true;
      this.isActiveWidget = false;
      let currentDay = -1;
      this.$http.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${key}&lang=ru&units=metric`)
                .then(function(response){
                  this.loading = false;
                  this.isActiveWidget = true;
                  this.city = response.body.city;
                  this.city.name = city;
                  this.weather = [];
                  this.status = 200;
                  response.body.list.forEach(item => {
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
                    if(!~this.find(this.weather, date)) {
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
                      this.weather.push(weatherForDay);
                    } else {
                      this.weather[currentDay].list.push(item);
                      if(this.weather[currentDay].minT > item.main.temp_min) this.weather[currentDay].minT = item.main.temp_min;
                      if(this.weather[currentDay].maxT < item.main.temp_max) this.weather[currentDay].maxT = item.main.temp_max;
                      this.weather[currentDay].avgT = Math.round((this.weather[currentDay].avgT + item.main.temp) / 2);

                      if(desc == 'дождь' || desc =='сильный дождь' || desc =='ливень') this.weather[currentDay].condition.rain++;
                      if(~desc.indexOf('снег')) this.weather[currentDay].condition.snow++;
                      if(~desc.indexOf('молния') || ~desc.indexOf('гроза')) this.weather[currentDay].condition.storm++;
                      if((~desc.indexOf('облачно') || ~desc.indexOf('пасмурно')) && desc != 'слегка облачно') this.weather[currentDay].condition.cloudySky++;
                      if(~desc.indexOf('ясно')) this.weather[currentDay].condition.clearSky++;
                      if(desc == 'слегка облачно') this.weather[currentDay].condition.liteCloudySky++;
                      if(desc == 'небольшой дождь') this.weather[currentDay].condition.liteRain++;

                    }
                  });
                  
                  this.mapURL = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCUFi97R3tGrOFSwrooJPWr1m0wDsZBm1U&q="${city}"`;

                  for(let i = 0; i < this.weather.length; i++) {

                    const condition = {};
                    let max = 0;
                    let conditionNameEn = '';
                    condition.conditionNameRu = '';
                    condition.icon = '';
                    for(let s in this.weather[i].condition) {
                      if(this.weather[i].condition[s] > max) {
                        max = this.weather[i].condition[s];
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
                    this.weather[i].condition = condition;
                  }
                  console.log(this.weather);
                }, function(error) {
                  this.status = 500;
                });
    }
  },
  components: {
    Widget, myForm, widgetLoader
  }
}
</script>

<style scoped>
#app {
  font-family: 'Bubbler One', Helvetica, sans-serif;
  width: 100%;
  height: 100vh;
  min-height: 830px;
  background: url('./assets/bg4b.jpg') no-repeat;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  color: #fff;
}
</style>
