import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
import Vant from 'vant';
import axios from 'axios';
// import './asstes/iconfont'; // 这行代码
import './asstes/font/iconfont.css'
// Vue.use(axios);
Vue.prototype.$ajax = axios;
Vue.use(Vant);
import {Icon} from 'vant';
Vue.use(Icon);
// 解决300ms延迟
import fastClick from 'fastclick';
// 引入amfe-flexible
import 'amfe-flexible'

import './utils/rem'
import './styles/reset.css'
import './styles/border.css'

Vue.config.productionTip = false
fastClick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
