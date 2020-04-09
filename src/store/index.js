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

    master: {
      measures: [
        { text: "Temperature", value: "temperature", unit: "°C" },
        { text: "Pressure", value: "pressure", unit: "Pa" },
        { text: "Humidity", value: "humidity", unit: "%" },
        { text: "PM 2.5", value: "pm25", unit: "μg/m³" },
        { text: "PM 10", value: "pm10", unit: "μg/m³" }
      ]  
    },

    feedback: {
      kind: null,
      show: false,
      message: ''
    },

    prerequisites: {
      data: [],
      updated: null
    },

    history: {
      data: [],
      updated: null
    },

    devices: {
      data: [],
      updated: null
    },

    locations: {
      data: [],
      updated: null
    }, 

    current: {
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
    
    SET_PREREQS(state, payload) {
      state.prerequisites.data = payload
      state.prerequisites.updated = moment()
    },

    SET_HISTORY(state, payload) {
      state.history.data = payload
      state.history.updated = moment()
    },

    SET_DEVICES(state, payload) {
      state.devices.data = payload
      state.devices.updated = moment()
    },

    SET_LOCATIONS(state, payload) {
      state.locations.data = payload
      state.locations.updated = moment()
    },

    SET_CURRENT(state, payload) {
      let struct_data = {}
      payload.forEach(data => {
        struct_data[data.device_idx] = data
      })
      state.current.data = struct_data
      state.current.updated = moment()
    },

    SOCKET_NEW_DATA_MAP(state, payload) {
      console.log('SOCKET (new_data_map):', payload)
      Vue.set(state.current.data, payload.device_idx, payload)
      //state.current.data[payload.idx] = payload
      state.current.updated = moment()
    }

  },

  actions: {
    socket_connect() {
      console.log('SOCKET CONNECTED')
    },

    socket_disconnect() {
      console.log('SOCKET DISCONNECTED')
    },

    socket_reconnect() {
      console.log('SOCKET RECONNECTED')
    },

    socket_storeDevice({ dispatch }, payload) {
      console.log('SOCKET (store_device):', payload)
      dispatch('get_devices')
    },

    socket_storeLocation({ dispatch }, payload) {
      console.log('SOCKET (store_locations):', payload)
      dispatch('get_locations')
    },

    socket_storeDeviceLocation({ dispatch }, payload) {
      console.log('SOCKET (store_device_locations):', payload)
      dispatch('get_prerequisites')
    },


    get_prerequisites({ state, commit }) {
      apis.prerequisites.get()
        .then(response => {
          console.log('prerequisites API call done, commiting')
          commit('SET_PREREQS', response)
          commit('SET_FEEDBACK', {
            kind: 'success',
            message: 'Pre-Requisites Loaded'
          })
          console.log('Calling history API')
          apis.history.get_history_data()
            .then(response => {
              commit('SET_HISTORY', response)
              console.log('history API done')
            })            
          console.log('Called history API')
          })
        .catch(error => {
          commit('SET_FEEDBACK', {
            kind: 'error',
            message: 'ERROR: ' + error
          })
        })
        .finally(() => {
          commit('SHOW_FEEDBACK')
        })
    },

    get_current({ commit, getters }) {
      if (getters.refresh_current) {
        apis.current.get_current().then(
          response => {
            console.log('current API call done, committing')
            commit('SET_CURRENT', response);
            commit('SET_FEEDBACK', {
              kind: 'success',
              message: 'Current Data Loaded'
            })
        })  
      }
    },
    
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
    },

    create_mapping(state, payload) {
      apis.mapping.create(payload).then(
        response => {
          console.log('mapping API call done:', response)
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
    
  },

  getters: {
    is_logged_in(state) {
      return state.user ? true : false
    },

    prerequisites(state) {
      return state.prerequisites.data
    },

    history(state) {
      return state.history.data
    },

    available_devices(state) {
      return state.prerequisites.data.filter(item => item.location_id == null && item.device_idx != null);
    },

    mapped_devices(state) {
      return state.prerequisites.data.filter(item => item.location_id != null && item.device_idx != null);
    },

    available_locations(state) {
      return state.prerequisites.data.filter(item => item.location_id != null && item.device_idx == null);
    },

    devices(state) {
      return state.devices.data
    },

    locations(state) {
      return state.locations.data
    },

    current(state) {
      return Object.values(state.current.data)
    },

    refresh_current(state) {
      let data_exists = Object.values(state.current.data).length > 0
      console.log('DATA_EXISTS:', data_exists)
      if (data_exists) {
        let data_stale = moment().diff(state.current.updated, 'minutes') > 20
        console.log('DATA_STALE:', data_stale)
        return data_stale
      } else {
        return !data_exists
      }
    }

    // GET UNASSIGNED DEVICES
    // GET ASSIGNED DEVICES
    // GET 
  },
  modules: {
  }
})
