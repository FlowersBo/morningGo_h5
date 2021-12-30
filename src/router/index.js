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
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/Repertory',
    name: 'Repertory',
    component: () => import( /* webpackChunkName: "Repertory" */ '../views/Repertory.vue')
  },
  {
    path: '/Prebake',
    name: 'Prebake',
    component: () => import('../views/Prebake.vue')
  },
  {
    path: '/Equipment',
    name: 'Equipment',
    component: () => import('../views/Equipment.vue')
  },
  {
    path: '/Mine',
    name: 'Mine',
    component: () => import('../views/Mine.vue')
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


// 全局路由守卫

router.beforeEach((to, from, next) => {
  console.log('navigation-guards');
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 必定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数
  console.log(to, from);
  // const nextRoute = ['home', 'good-list', 'good-detail', 'cart', 'profile'];
  // let isLogin = global.isLogin; // 是否登陆
  // // 未登陆状态；当路由到nextRoute指定页时，跳转至login
  // if (nextRoute.indexOf(to.name) >= 0) {
  //   if (!isLogin) {
  //     console.log('what fuck');
  //     router.push({
  //       name: 'login'
  //     })
  //   }
  // }
  // // 已登陆状态；当路由到login时，跳转至home 
  // if (to.name === 'login') {
  //   if (isLogin) {
  //     router.push({
  //       name: 'home'
  //     });
  //   }
  // }
  next();
});

export default router