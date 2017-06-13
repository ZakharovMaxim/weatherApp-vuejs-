<template>
  <div class="widget">
    <div v-if="status != 200">
      <div v-if="status == 404">
        <img src="../assets/404.jpg" alt="" style="max-width: 100%">
      </div>
      <div v-if="status == 500">
        500
      </div>
    </div>
    <div v-else>
      <div class="widget__weather">
        <div class="widget__menu">
          <ul>
            <li v-for="(day, index) in weather" class="day">
              <a href="" @click.prevent='changeTab(index + 1, $event)'>
                <div class="day__name">{{day.dayName}}</div>
                <div class="day__icon">
                  <i class="wi"
                    :class="{
                      'wi-day-sunny': (day.cloudySky < day.clearSky) && !day.isRain && !day.isSnow && !day.isStorm,
                      'wi-day-rain': day.isRain,
                      'wi-day-lightning': day.isStorm,
                      'wi-day-snow': day.isSnow,
                      'wi-day-cloudy': ((day.cloudySky >= day.clearSky) && !day.isRain && !day.isSnow && !day.isStorm)
                    }"></i>
                </div>
                <div class="day__temp-range">{{day.minT}}<sup>o</sup>/{{day.maxT}}<sup>o</sup></div>
              </a>
            </li>
        <!--    <div class="widget__hoverEffect" v-bind:style="{left: hoverElement.pos + 'px'}"></div> !-->
          </ul>
        </div>
        <div class="widget__tabs">
          <div class="widget__tab"
               v-for="(day, i) in weather"
               :class='currentTab == i + 1 ? "active" : ""'>
          <div class="total-description">
            <div class="avg-temp">{{ day.avgT}}<sup>o</sup></div>
            <div class="range-temp">
              <span>{{day.minT}}<sup>o</sup></span>
              <span>{{day.maxT}}<sup>o</sup></span>
            </div>
            <div class="day-icon">
              <i class="wi"
                :class="{
                  'wi-day-sunny': (day.cloudySky < day.clearSky) && day.cloudySky < 3 && !day.isRain && !day.isSnow && !day.isStorm,
                  'wi-day-rain': day.isRain,
                  'wi-day-lightning': day.isStorm,
                  'wi-day-snow': day.isSnow,
                  'wi-day-cloudy': ((day.cloudySky >= day.clearSky) && !day.isRain && !day.isSnow && !day.isStorm)
                }">
              </i>
            </div>
            <div class="desc">
              Облачно
            </div>
          </div>
          <div v-for="(time, j) in day.list" class="widget__time_wrap">
            <div class="time">
              {{ time.dt_txt.split(" ")[1].split(':').slice(0, 2).join(':') }}
            </div>
            <div class="temp">
              Температура {{ time.main.temp }}<sup>o</sup>
            </div>
            <div class="humidity">
              Влажность - {{ time.main.humidity }}%
            </div>
            <div class="wind">
              Ветер  <i class="wi wi-wind" :style="{transform: 'rotate(' + time.wind.deg + 'deg)'}"></i>{{ time.wind.speed}} км/час
            </div>
            <div class="description">
              {{ time.weather[0].description.slice(0, 1).toUpperCase() + time.weather[0].description.slice(1)}}
              <i class="wi" :class='time.dt_txt.split(" ")[1].split(":")[0] > 3 && time.dt_txt.split(" ")[1].split(":")[0] < 19 ? iconsDay[time.weather[0].description] : iconsNight[time.weather[0].description]'></i>
            </div>
          </div>
         </div>
        </div>
      </div>
      <div class="widget__map">
      <mapLoader v-if="loadingMap" :loading="loadingMap"></mapLoader>
        <iframe
          v-show="!loadingMap"
          width="450"
          height="250"
          frameborder="0" style="border:0"
          :src="mapURL"
          @load="loaded">
        </iframe>
      </div>
    </div>
  </div>
</template>
<script>
import mapLoader from './mapLoader'

export default {
  name: 'widget',
  props: ['weather', 'mapURL', 'city', 'status'],
  data () {
    return {
      currentTab: 1,
      loadingMap: true,
      hoverElement: {
        'el': document.querySelector('.widget__hoverEffect'),
        'pos': 0
      },
      iconsDay: {
        'ясно':'wi-day-sunny',
        'пасмурно': 'wi-cloudy',
        'легкий дождь': 'wi-sprinkle',
        'слегка облачно': 'wi-day-cloudy',
        'дождь': 'wi-rain',
        'облачно': 'wi-cloudy',
        'снег': '.wi-day-snow',
        'молния': '.wi-day-thunderstorm'
      },
      iconsNight: {
        'ясно':'wi-night-clear',
        'пасмурно': 'wi-cloudy',
        'легкий дождь': 'wi-night-showers',
        'слегка облачно': 'wi-night-alt-cloudy',
        'дождь': 'wi-night-rain',
        'облачно': 'wi-cloudy',
        'снег': 'wi-night-alt-snow',
        'молния': 'wi-night-alt-lightning'
      }
    }
  },
  methods: {
    changeTab(n, event) {
      this.currentTab = n;
      let target = event.target.nodeName == "A" ? event.target.parentNode : event.target.parentNode.parentNode;
      this.hoverElement.pos = target.getBoundingClientRect().left;
    },
    loaded() {
      this.loadingMap = false;
    }
  },
  components: {mapLoader}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Bubbler+One');
  .widget {
    width: 980px;
    height: 450px;
    position: absolute;
    top: 400px;
    left: 50%;
    margin-top: -225px;
    margin-left: -490px;
    animation: fade 1s ease-in-out;
  }
  @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .widget__weather {
    width: 60%;
    float: left;
  }
  .widget__map {
    width: 40%;
    padding-left: 5px;
    float: left;
  }
  .widget__map > iframe {
    width: 100%;
  }
  .widget__menu {
    width: 100%;
    height: 9%;
    position: relative;

  }
  .widget__menu ul {
    list-style: none;
    display: flex;
    justify-content: space-around;
  }
  .widget__menu li {
    float: left;
    background: rgba(255, 255, 255, .35);
    height: 190px;
    width: 110px;
    margin-left: 5px;
  }
  .widget__menu li:first-child {
    margin-left: 0;
  }
  .widget__menu li > a {
    width: 100%;
    text-align: center;
    text-decoration: none;
    display: block;
    height: 100%;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
  }
  .widget__menu li > a > div {
    margin: 10px 0;
  }
  .widget__menu .day__name {
    color: #00BFFF;
    font-size: 20px;
  }
  .widget__menu .day__icon i {
    color: #8B008B;
  }
  .widget__menu .day__temp-range {
    color: #8B008B;
    font-size: 14px;
  }
  .widget__hoverEffect {
    width: 94px;
    background: rgba(0, 0, 0, .15);
    position: absolute;
    left: 0;
    top: 0;
    height: 190px;
    transition: all .5s cubic-bezier(0.4, 0, 0, 1.29);
  }
  .widget__tabs {
    height: 91%;
  }
  .widget__tab {
    display: none;
  }
  .widget__tab.active {
    display: block;
    animation: fadeAndRoll 1s ease-in-out;
  }
  @keyframes fadeAndRoll {
    0% {
      opacity: 0;
      transform: translateX(-25px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .total-description {
    width: 33%;
    height: 100px;
    margin-top: 15px;
    display: table;
    clear: both;
  }
  .total-description > div {
    float: left;
    height: 100%;
    color: #fff;
  }
  .total-description .avg-temp {
    font-size: 60px;
    width: 51%;
  }
  .total-description .range-temp {
    font-size: 22px;
    width: 20%;
    color: #ccc;
  }
  .total-description .range-temp > span {
    display: block;
    margin-top: 10px;
  }
  .total-description .desc {
    font-size: 36px;
    width: 100%;
    text-align: center;
    color: #ccc;
  }
  .total-description .day-icon {
    padding-top: 22px;
  }
  .widget__time_wrap {
    width: 100%;
  }
  .widget__time_wrap > div {
    display: inline-block;
  }
  .widget__time_wrap .time {

  }
  .widget__time_wrap .temp {

  }
  .widget__time_wrap .humidity {

  }
  .widget__time_wrap .wind {

  }
  .description {

  }
  /*WeatherFont
-----------------------------------------------------------------
  */
  @font-face {
    font-family: 'weathericons';
    src: url('../assets/weatherFont/weathericons-regular-webfont.eot');
    src: url('../assets/weatherFont/weathericons-regular-webfont.eot?#iefix') format('embedded-opentype'), url('../assets/weatherFont/weathericons-regular-webfont.woff2') format('woff2'), url('../assets/weatherFont/weathericons-regular-webfont.woff') format('woff'), url('../assets/weatherFont/weathericons-regular-webfont.ttf') format('truetype'), url('../assets/weatherFont/weathericons-regular-webfont.svg#weather_iconsregular') format('svg');
    font-weight: normal;
    font-style: normal;
  }
  .wi {
    display: inline-block;
    font-family: 'weathericons';
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 2.5em;
    color: #f2f2f2;
  }

.wi-day-sunny:before {
  content: "\f00d";
}
.wi-day-cloudy:before {
  content: "\f002";
}
.wi-sprinkle:before {
  content: "\f01c";
}
.wi-day-lightning:before {
  content: "\f005";
}
.wi-day-rain:before {
  content: "\f008";
}
.wi-day-snow:before {
  content: "\f00a";
}
.wi-day-thunderstorm:before {
  content: "\f010";
}
.wi-cloudy:before {
  content: "\f013";
}
.wi-rain:before {
  content: "\f019";
}

.wi-night-alt-snow:before {
  content: "\f02a";
}
.wi-night-clear:before {
  content: "\f02e";
}
.wi-night-alt-cloudy:before {
  content: "\f086";
}
.wi-night-showers:before {
  content: "\f037";
}
.wi-night-rain:before {
  content: "\f036";
}
.wi-night-alt-lightning:before {
  content: "\f025";
}

.wi-celsius:before {
  content: "\f03c";
}




.wi-wind:before {
  content: "\f0b1";
}

</style>
