import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appTitle: "CleAir",
    appVersion: "0.0.1(Beta)",
    user: '',
	  auth_token: '' 
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    is_logged_in(state) {
      return state.user ? true : false
    },
  },
  modules: {
  }
})
