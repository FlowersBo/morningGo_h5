import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import 'vant/lib/index.css';
import Vant from 'vant';
import './asstes/font/iconfont.css'
import axios from 'axios';
Vue.prototype.$axios = axios
// import VueAxios from 'vue-axios';
// Vue.use(axios);
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

import qs from 'qs';
Vue.prototype.$qs = qs;

// 滑动
import VueTouch from 'vue-touch'
Vue.use(VueTouch, {
  name: 'v-touch'
})
VueTouch.config.swipe = {
  threshold: 50 //设置左右滑动的距离
}

//视频组件
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
Vue.use(VideoPlayer)
import wx from "weixin-js-sdk";

// import wxsdk from 'weixin-jsapi';
// Vue.prototype.wx = wxsdk
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { //判断是否要登录才能打开页面
    if (localStorage.getItem('token')) { //有登录状态,直接跳转
      next()
    } else {
      if (to.path == '/Login') {
        //如果是登录页面,就停留登录页,不在重复跳转
        next();
      } else {
        next({
          path: '/', //无登录状态,先跳转到登录页面
          query: {
            redirect: to.fullPath
          } // 登录成功后跳转回到该路由
        })
      }
    }
  } else {
    next()
  }
})

Vue.config.productionTip = false
fastClick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')