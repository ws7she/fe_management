// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'

window._ = require('lodash')
window.$ = require('jquery')

axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
import Element from 'element-ui'
import 'element-theme-default'
Vue.use(Element)

require('./components/style/global.sass')
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
