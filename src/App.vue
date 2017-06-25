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
      mapURL: '',
      weather: [],
      status: 200,
      loading: false
    }
  },
  methods: {
    search(city) {
      this.loading = true;
      this.isActiveWidget = false;
      let currentDay = -1;
      this.$http.get(`/${city}`)
                .then(function(response){
                  console.log(response);
                  this.loading = false;
                  this.isActiveWidget = true;
                  this.weather = response.body;
                  this.status = 200;
                  this.mapURL = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCUFi97R3tGrOFSwrooJPWr1m0wDsZBm1U&q="${city}"`;
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
  min-height: 838px;
  background: url('./assets/bg4b.jpg') no-repeat;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  color: #fff;
}
</style>
