import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
import Vant from 'vant';
// import axios from 'axios';
// import VueAxios from 'vue-axios';
import './asstes/font/iconfont.css'
// Vue.use(VueAxios, axios);
Vue.use(Vant);
import {
  Icon
} from 'vant';
Vue.use(Icon);
// 解决300ms延迟
import fastClick from 'fastclick';
// 引入amfe-flexible
import 'amfe-flexible'

import './utils/rem'
import './styles/reset.css'
import './styles/border.css'

import http from './api/http.js'
import api from './api/api.js'
Vue.prototype.$http = http
Vue.prototype.$api = api


// 引入js_sdk
import wxsdk from 'weixin-js-sdk';
Vue.prototype.wxsdk = wxsdk

Vue.config.productionTip = false
fastClick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')