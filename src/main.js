import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import Fetch from './common/js/fetch'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
// import font from '../static/music/iconfont.css'
// import fintjs from '../static/music/iconfont.js'

Vue.use(VueLazyLoad,{
  loading: require('../static/image/default.png')
})


fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
