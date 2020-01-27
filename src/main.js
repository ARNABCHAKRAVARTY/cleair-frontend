import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

Vue.config.productionTip = false

//const socket = io('http://192.168.1.21:5000');
const socket = io('http://192.168.100.117:5000');
Vue.use(VueSocketIOExt, socket);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
