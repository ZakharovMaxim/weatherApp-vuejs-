<template>
  <div class="widget">
    <widget-loader v-if='loading' />
    <div class="error" v-else-if='error'>{{error}}</div>
    <div v-else>
      <div class="widget__weather">
        <div class="widget__menu">
          <ul>
            <li v-for="(day, index) in weather" class="day" :key="index" :class="{'active': index === currentTab - 1}">
              <a href="" @click.prevent='changeTab(index + 1, $event)'>
                <span class="day__name">{{day.dayName}}</span>
                <span class="day__icon">
                  <i class="wi" :class="day.condition.icon"></i>
                </span>
                <span class="day__temp-range">{{day.minT}}<sup>o</sup>/{{day.maxT}}<sup>o</sup></span>
              </a>
            </li>
          </ul>
        </div>
        <div class="widget__tabs">
          <div class="widget__tab"
               v-for="(day, i) in weather"
               :key="i"
               :class='currentTab === i + 1 ? "active" : ""'>
          <div class="total-description">
            <div class="avg-temp">{{ day.avgT}}<sup>o</sup></div>
            <div class="range-temp">
              <span>{{day.minT}}<sup>o</sup></span>
              <span>{{day.maxT}}<sup>o</sup></span>
            </div>
            <div class="day-icon">
              <i class="wi" :class="day.condition.icon"></i>
            </div>
            <div class="desc">
              {{ day.condition.conditionNameRu}}
            </div>
          </div>
          <div class="table">
            <div class="col">
              <div class="row th">Время</div>
              <div class="row th">Температура</div>
              <div class="row th">Влажность</div>
              <div class="row th">Ветер км/час</div>
              <div class="row th">Состояние</div>
            </div>
            <div v-for="(time, j) in day.list" :key="j" class="col">
              <div class="time row">
                {{ time.dt_txt.split(" ")[1].split(':').slice(0, 2).join(':') }}
              </div>
              <div class="temp row">
                {{ time.main.temp }}<sup>o</sup>
              </div>
              <div class="humidity row">
                {{ time.main.humidity }}%
              </div>
              <div class="wind row"><i class="wi wi-wind" :style="{ transform: 'rotate(' + time.wind.deg + 'deg)'}"> </i>{{ time.wind.speed}}
              </div>
              <div class="description row">
                {{ time.weather[0].description.slice(0, 1).toUpperCase() + time.weather[0].description.slice(1)}}
                <i class="wi" :class='time.dt_txt.split(" ")[1].split(":")[0] > 3 && time.dt_txt.split(" ")[1].split(":")[0] < 19 ? icons["iconsDay"][time.weather[0].description] : icons["iconsNight"][time.weather[0].description]'></i>
              </div>
            </div>
          </div>
         </div>
        </div>
      </div>
      <Map :city="city" />
    </div>
  </div>
</template>
<script>
import Map from './Map'
import widgetLoader from './widgetLoader'
export default {
  name: 'widget',
  props: {
    currentTab: {
      type: Number,
      default: 1
    },
    city: String,
    icons: Object,
    weather: Array,
    loading: Boolean,
    error: {
      default: null
    }
  },
  methods: {
    changeTab (n) {
      this.$emit('tabChanged', n)
    }
  },
  components: {Map, widgetLoader}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poiret+One&subset=cyrillic');
  .widget {
    width: 980px;
    height: 450px;
    position: absolute;
    top: 400px;
    left: 50%;
    margin-top: -225px;
    margin-left: -490px;
    animation: fade 1s ease-in-out;
    font-family: 'Poiret One', Arial,cursive;
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
    justify-content: space-between;
  }
  .widget__menu li {
    float: left;
    background: rgba(255, 255, 255, .35);
    height: 190px;
    width: 18%;
    margin-left: 5px;
  }
  .widget__menu li.active {
    background: rgba(0,0,0,.5);
  }
  .widget__menu li:first-child {
    margin-left: 0;
  }
  .widget__menu li a {
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
  .widget__menu li span {
    margin: 10px 0;
    display: inline-block;
  }
  .widget__menu .day__name {
    color: #fff;
    font-size: 20px;
  }
  .widget__menu .day__icon i {
    color: #00BFFF;
  }
  .widget__menu .day__temp-range {
    color: #fff;
    font-size: 14px;
  }
  .widget__tabs {
    height: 91%;
  }
  .widget__tab {
    display: none;
  }
  .widget__tab.active {
    display: block;
    background: rgba(0,0,0,.5);
    padding: 6px 3px;
  }
  .total-description {
    width: 240px;
    height: 80px;
    margin: 15px 0 90px 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .total-description > div {
    height: 100%;
    color: #fff;
    text-align: center;
  }
  .total-description .avg-temp {
    font-size: 60px;
  }
  .total-description .range-temp {
    font-size: 22px;
    color: #ccc;
    margin: 0 10px;
  }
  .total-description .range-temp > span {
    display: block;
    margin-top: 10px;
  }
  .total-description .day-icon {
    padding-top: 22px;

  }
  .total-description .desc {
    font-size: 36px;
    width: 100%;
    text-align: center;
    color: #ccc;
  }
  .table {
    width: 100%;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    margin-bottom: 50px;
  }
  .table .col {
    width: 11%;
    text-align: center;
  }
  .table .row {
    height: 45px;
  }
  .table .th {
    font-size: 0.65em;
    text-align: left;
  }
  .table .description {
    font-size: 0.9em;
    position: relative;
  }
  .table .description i {
    display: block;
    position: absolute;
    bottom: -41px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .table .wind i {
    display: block;
    margin-top: -23px;
  }
  .table .wind {
    margin-bottom: 23px;
  }
  @media screen and (max-width: 1008px) {
    .widget {
      width: 95%;
      left: 2.5%;
      margin-left: 0;
    }
    .widget__weather {
      width: 100%;
      float: none;
    }
    .widget__map {
      width: 100%;
      padding-left: 5px;
      float: none;
      margin: 15px 0;
    }
    .table {
      width: 100%;
    }
  }
  @media screen and (max-width: 640px) {
    .table {
      font-size: 10px;
    }
    .table .wind i {
      font-size: 20px;
    }
    .table .th {
      font-size: 0.9em;
    }
    .table .description i {
      bottom: -12px;
    }
    .table .wind {
      margin-bottom: 10px;
    }
    .table .wind i {
      margin-top: -10px;
    }
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
    color: #00BFFF;
  }

.wi-day-sunny:before {
  content: "\f00d";
}
.wi-day-cloudy:before {
  content: "\f002";
}

.wi-day-rain:before {
  content: "\f008";
}
.wi-day-snow:before {
  content: "\f00a";
}

.cloudy:before {
  content: "\f013";
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
.wi-night-alt-lightning:before {
  content: "\f025";
}
.wi-day-showers:before {
  content: "\f01a";
}
.wi-day-sleet-storm:before {
  content: "\f068";
}
.wi-night-alt-sprinkle:before {
  content: "\f02b";
}
.wi-night-alt-rain:before {
  content: "\f028";
}
.wi-night-alt-lightning:before {
  content: "\f025";
}
.wi-wind:before {
  content: "\f0b1";
}

</style>
