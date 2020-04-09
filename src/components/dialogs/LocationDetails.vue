<template>
  <v-dialog :value="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="close_dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Dashboard</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-col class="d-flex" cols="12" sm="6">
        <v-select :value="day" :items="days" label="Duration" @change="change_days"></v-select>
      </v-col>
      <v-divider></v-divider>

      <template>
        <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
          <lines :xdata="data.x" :ydata="data.y" :index="location" name="PM 2.5" chart="pm25"/>
        </v-card>
      </template>
    </v-card>
  </v-dialog>
</template>
    
<script>
const apis = require("@/resources/apis");

export default {
  props: {
    show: Boolean,
    location: { type: String, required: false, default: null }
  },

  components: {
    Lines: () => import("@/components/charts/Lines")
  },

  data() {
    return {
      day: 1,
      days: [
        { value: 1, text: "Today", history: null, last: null },
        { value: 7, text: "This Week", history: null, last: null },
        { value: 28, text: "This Month", history: null, last: null },
        { value: 365, text: "This Year", history: null, last: null }
      ],
      history: {
        1: {
          received_time: [],
          bat_v: [],
          pm25: [],
          bat_soc: [],
          vout: [],
          bat_temp: [],
          cpu_temp: [],
          temperature: [],
          sdt: [],
          vin: [],
          humidity: [],
          pressure: [],
          pm10: []
        },
        7: {
          received_time: [],
          bat_v: [],
          pm25: [],
          bat_soc: [],
          vout: [],
          bat_temp: [],
          cpu_temp: [],
          temperature: [],
          sdt: [],
          vin: [],
          humidity: [],
          pressure: [],
          pm10: []
        },
        28: {
          received_time: [],
          bat_v: [],
          pm25: [],
          bat_soc: [],
          vout: [],
          bat_temp: [],
          cpu_temp: [],
          temperature: [],
          sdt: [],
          vin: [],
          humidity: [],
          pressure: [],
          pm10: []
        },
        365: {
          received_time: [],
          bat_v: [],
          pm25: [],
          bat_soc: [],
          vout: [],
          bat_temp: [],
          cpu_temp: [],
          temperature: [],
          sdt: [],
          vin: [],
          humidity: [],
          pressure: [],
          pm10: []
        }
      }
    };
  },

  computed: {
    data() {
      return {
        x: this.history[this.day]['received_time'],
        y: this.history[this.day]['pm25']
      }
    }
  },

  methods: {
    change_days($event) {
      console.log($event);
      this.get_history($event);
      this.day = $event;
    },

    close_dialog() {
      this.$emit("update:show", false);
    },

    get_history(days) {
      apis.history
        .get_location_history(this.location, days)
        .then(response => {
          for (let k in response) {
            this.$set(this.history[days], k, response[k])
          }
        })
        .catch(error => console.log("Error: ", error));
    }
  },

  mounted() {
    this.get_history(1);
  }
};
</script>

<style scoped>
</style>