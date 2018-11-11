<template>
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
</template>

<script>
import mapLoader from './mapLoader'
export default {
  name: 'Map',
  data () {
    return {
      loadingMap: true
    }
  },
  props: {
    city: {
      type: String,
      required: true
    }
  },
  computed: {
    mapURL () {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyCUFi97R3tGrOFSwrooJPWr1m0wDsZBm1U&q="${this.city}"`
    }
  },
  methods: {
    loaded () {
      this.loadingMap = false
    }
  },
  components: {mapLoader}
}
</script>

<style>

</style>
