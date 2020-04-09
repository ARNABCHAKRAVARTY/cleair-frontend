import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import CurrentLocations from '../components/CurrentLocations.vue'
import CurrentDevices from '../components/CurrentDevices.vue'
import LocationsTable from '../components/LocationsTable.vue'
import DevicesTable from '../components/DevicesTable.vue'
import Devices from '../components/Devices.vue'
import Locations from '../components/Locations.vue'
import SignIn from '../components/Signin.vue'
import Dashboard from '../components/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/currentlocations',
    name: 'currentlocations',
    component: CurrentLocations
  },
  {
    path: '/locationstable',
    name: 'locationstable',
    component: LocationsTable
  },
  {
    path: '/devicestable',
    name: 'devicestable',
    component: DevicesTable
  },
  {
    path: '/currentdevices',
    name: 'currentdevices',
    component: CurrentDevices
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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
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
