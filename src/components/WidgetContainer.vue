<template>
  <Widget
    :currentTab='currentTab'
    :icons='icons'
    :weather='weather'
    :loading='loading'
    :error='error'
    :city='city'
    @tabChanged='changeTab'
  />
</template>
<script>
import Widget from './Widget'
import icons from '../assets/icons'
import api from '../configs/api'
export default {
  name: 'widget',
  props: ['city'],
  watch: {
    city () {
      this.search()
    }
  },
  data () {
    return {
      currentTab: 1,
      icons,
      loading: true,
      weather: [],
      error: null
    }
  },
  created () {
    this.search()
  },
  methods: {
    changeTab (n) {
      this.currentTab = n
    },
    loaded () {
      this.loadingMap = false
    },
    search () {
      this.loading = true
      this.error = null
      this.weather = []
      api(this.city).then(data => {
        this.weather = data
        this.error = null
      }).catch(e => {
        this.error = e.message
      }).then(() => {
        this.loading = false
      })
    }
  },
  components: {Map, Widget}
}
</script>
