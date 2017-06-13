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
                    weatherForDay.clearSky = 0;
                    weatherForDay.cloudySky = 0;
                    weatherForDay.isStorm = false;
                    weatherForDay.isSnow = false;
                    weatherForDay.isRain = false;
                    item.wind.deg = Math.round(item.wind.deg);
                    item.main.temp = Math.round(item.main.temp);
                    item.main.temp_min = Math.round(item.main.temp_min);
                    item.main.temp_max = Math.round(item.main.temp_max);
                    let desc = item.weather[0].description;
                    console.log(desc);
                    if(!~this.find(this.weather, date)) {
                      weatherForDay.date = date;
                      let dayName = new Date(date.split("-")[0], date.split("-")[1], date.split("-")[2] - 2).toLocaleString("ru", {weekday: 'short'});
                      weatherForDay.dayName = dayName.slice(0, 1).toUpperCase() + dayName.slice(1);
                      weatherForDay.minT = item.main.temp_min;
                      weatherForDay.maxT = item.main.temp_max;
                      weatherForDay.avgT = item.main.temp;
                      weatherForDay.list = [];
                      weatherForDay.list.push(item);
                      if(~desc.indexOf('дождь')){
                        console.log('я тут');
                        weatherForDay.isRain = true;
                      }
                      if(~desc.indexOf('снег')) weatherForDay.isSnow = true;
                      if(~desc.indexOf('молния') || ~desc.indexOf('гроза')) weatherForDay.isStorm = true;
                      if(~desc.indexOf('облачно') || ~desc.indexOf('пасмурно')) weatherForDay.cloudySky++;
                      if(~desc.indexOf('ясно')) weatherForDay.clearSky++;
                      currentDay++;
                      this.weather.push(weatherForDay);
                    } else {
                      this.weather[currentDay].list.push(item);
                      if(this.weather[currentDay].minT > item.main.temp_min) this.weather[currentDay].minT = item.main.temp_min;
                      if(this.weather[currentDay].maxT < item.main.temp_max) this.weather[currentDay].maxT = item.main.temp_max;
                      this.weather[currentDay].avgT = Math.round((this.weather[currentDay].avgT + item.main.temp) / 2);
                      if(~desc.indexOf('дождь')) this.weather[currentDay].isRain == true;
                      if(~desc.indexOf('снег')) this.weather[currentDay].isSnow == true;
                      if(~desc.indexOf('молния') || ~desc.indexOf('гроза')) this.weather[currentDay].isStorm == true;
                      if(~desc.indexOf('облачно') || ~desc.indexOf('пасмурно')) this.weather[currentDay].cloudySky++;
                      if(~desc.indexOf('ясно')) weatherForDay.clearSky++;
                    }
                  });
                  this.mapURL = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCUFi97R3tGrOFSwrooJPWr1m0wDsZBm1U&q="${city}"`;
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
  min-height: 917px;
  height: 100vh;
  background: url('./assets/bg.jpg') no-repeat;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  color: #8B008B;
}
</style>
