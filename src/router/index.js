import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
