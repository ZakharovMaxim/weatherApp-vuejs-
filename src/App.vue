<template>
  <div id="app">
    <myForm :isActiveWidget='isActiveWidget' @pressed="search" />
    <widget-container v-if="isActiveWidget" :city="city" />
  </div>
</template>

<script>
import WidgetContainer from './components/WidgetContainer'
import myForm from './components/myForm'
export default {
  name: 'app',
  data () {
    return {
      isActiveWidget: false,
      city: ''
    }
  },
  components: {
    WidgetContainer,
    myForm
  },
  methods: {
    search (city) {
      this.city = city
      this.isActiveWidget = true
    }
  }
}
</script>

<style>
#app {
  font-family: "Bubbler One", Helvetica, sans-serif;
  width: 100%;
  height: 100vh;
  min-height: 838px;
  background: url("./assets/bg4b.jpg") no-repeat;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  color: #fff;
}
</style>
