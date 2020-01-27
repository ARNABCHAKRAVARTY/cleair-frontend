import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Current from '../components/Current.vue'
import Devices from '../components/Devices.vue'
import Locations from '../components/Locations.vue'
import SignIn from '../components/Signin.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/current',
    name: 'current',
    component: Current
  },
  {
    path: '/locations',
    name: 'locations',
    component: Locations
  },
  {
    path: '/devices',
    name: 'devices',
    component: Devices
  },
  {
    path: '/SignIn',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
