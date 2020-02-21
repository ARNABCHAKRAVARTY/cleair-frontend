import Vue from 'vue'
import Vuex from 'vuex'
const moment = require('moment')
const apis = require("@/resources/apis");

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appTitle: "CleAir",
    appVersion: "0.0.1 (Beta)",
    user: '',
    auth_token: '',

    feedback: {
      kind: null,
      show: false,
      message: ''
    },

    devices: {
      data: [],
      updated: null
    },

    locations: {
      data: [],
      updated: null
    }

  },

  mutations: {
    SET_FEEDBACK(state, payload) {
      state.feedback.kind = payload.kind
      state.feedback.message = payload.message
    },

    SHOW_FEEDBACK(state) {
      state.feedback.show = true
    },

    CLEAR_FEEDBACK(state) {
      state.feedback.show = false
      state.feedback.kind = null
      state.feedback.message = ''
    },

    SET_DEVICES(state, payload) {
      state.devices.data = payload
      state.devices.updated = moment()
    },

    SET_LOCATIONS(state, payload) {
      state.locations.data = payload
      state.locations.updated = moment()
    }

  },

  actions: {
    get_devices({ commit }) {
      apis.devices.get_devices().then(
        response => {
          console.log('API call done, commiting')
          commit('SET_DEVICES', response);
          commit('SET_FEEDBACK', {
            kind: 'success',
            message: 'Devices Loaded'
          })
        })
        .catch(
          error => {
            commit('SET_FEEDBACK', {
              kind: 'error',
              message: 'ERROR: ' + error
            })
          })
        .finally(() => {
          commit('SHOW_FEEDBACK')
        })
    },

    get_locations({ commit }) {
      apis.locations.get_locations().then(
        response => {
          console.log('API call done, commiting')
          commit('SET_LOCATIONS', response);
          commit('SET_FEEDBACK', {
            kind: 'success',
            message: 'Locations Loaded'
          })
        })
        .catch(
          error => {
            commit('SET_FEEDBACK', {
              kind: 'error',
              message: 'ERROR: ' + error
            })
          })
        .finally(() => {
          commit('SHOW_FEEDBACK')
        })
    }


    // GET PREREQUISITES FROM SERVER
  },
  getters: {
    is_logged_in(state) {
      return state.user ? true : false
    },

    devices(state) {
      return state.devices.data
    },

    locations(state) {
      return state.locations.data
    }

    // GET UNASSIGNED DEVICES
    // GET ASSIGNED DEVICES
    // GET 
  },
  modules: {
  }
})
