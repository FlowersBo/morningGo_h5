import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)
// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
const routes = [{
    path: '/Login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta:{
      requireAuth: false
    }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta:{
      requireAuth: false
    }
  },
  {
    path: '/Repertory',
    name: 'Repertory',
    component: () => import( /* webpackChunkName: "Repertory" */ '../views/Repertory.vue'),
    meta:{
      requireAuth: true
    }
  },
  {
    path: '/Prebake',
    name: 'Prebake',
    component: () => import('../views/Prebake.vue'),
    meta:{
      requireAuth: true
    }
  },
  {
    path: '/Equipment',
    name: 'Equipment',
    component: () => import('../views/Equipment.vue'),
    meta:{
      requireAuth: true
    }
  },
  {
    path: '/Mine',
    name: 'Mine',
    component: () => import('../views/Mine.vue'),
    meta:{
      requireAuth: true
    }
  },
  {
    path: '/Player',
    name: 'Player',
    component: () => import('../views/home/Player.vue')
  },
  {
    path: '/Alarm',
    name: 'Alarm',
    component: () => import('../views/home/Alarm.vue')
  },
  {
    path: '/SetRepertory',
    name: 'SetRepertory',
    component: () => import('../views/repertory/SetRepertory.vue')
  },
  {
    path: '/SetPrebake',
    name: 'SetPrebake',
    component: () => import('../views/prebake/SetPrebake.vue')
  },
  {
    path: '/EquipmentDetail',
    name: 'EquipmentDetail',
    component: () => import('../views/equipment/EquipmentDetail.vue')
  },
  {
    path: '/Ovenware',
    name: 'Ovenware',
    component: () => import('../views/equipment/Ovenware.vue')
  },
  {
    path: '/SetYukao',
    name: 'SetYukao',
    component: () => import('../views/equipment/SetYukao.vue')
  },
  {
    path: '/ReportAbandon',
    name: 'ReportAbandon',
    component: () => import('../views/equipment/ReportAbandon.vue')
  },
  {
    path: '/RepairRecord',
    name: 'RepairRecord',
    component: () => import('../views/equipment/RepairRecord.vue')
  },
  {
    path: '/Temperature',
    name: 'Temperature',
    component: () => import('../views/equipment/Temperature.vue')
  },
  {
    path: '/Facility',
    name: 'Facility',
    component: () => import('../views/equipment/Facility.vue')
  },
  {
    path: '/OrderList',
    name: 'OrderList',
    component: () => import('../views/mine/OrderList.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes
})


// ??????????????????
// router.beforeEach((to, from, next) => {
  // console.log('navigation-guards');
  // to: Route: ???????????????????????? ????????????
  // from: Route: ?????????????????????????????????
  // next: Function: ??????????????????????????? resolve ????????????????????????????????? next ?????????????????????
  // console.log(to, from);
  // const nextRoute = ['Home', 'Login'];
  // let isLogin = global.isLogin; // ????????????
  // // ??????????????????????????????nextRoute????????????????????????login
  // if (nextRoute.indexOf(to.name) >= 0) {
  //   if (!isLogin) {
  //     console.log('what fuck');
  //     router.push({
  //       name: 'Login'
  //     })
  //   }
  // }
  // // ??????????????????????????????login???????????????home 
  // if (to.name === 'Login') {
  //   if (isLogin) {
  //     router.push({
  //       name: 'Home'
  //     });
  //   }
  // }
  // next();
// });

export default router