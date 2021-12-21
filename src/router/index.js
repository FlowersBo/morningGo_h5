import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/Repertory',
    name: 'Repertory',
    component: () => import(/* webpackChunkName: "Repertory" */ '../views/Repertory.vue')
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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
