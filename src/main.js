import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
 
const socket = io('http://13.235.245.238:9889/'); 
Vue.use(VueSocketIOExt, socket, { store });


//Vue.config.productionTip = false
//const socket = io('http://192.168.1.2:5000');
//Vue.use(VueSocketIOExt, socket);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
