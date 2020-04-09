<template>
  <v-dialog :value="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card style="background-color:rgba(247,247,252,1);">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="close_dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ location_obj.location_name }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-col class="d-flex" cols="12" sm="6">
        <v-select :value="day" :items="days" label="Duration" @change="change_days"></v-select>
      </v-col>
      <v-divider></v-divider>

      <div class="pa-2" v-for="measure in measures" :key="measure.value">
        <v-card class="mx-auto elevation-2 mt-1 mb-1" max-width="800">
          <lines
            :xdata="data.received_time"
            :ydata="data[measure.value]"
            :index="location"
            :measure="measure"
            :days="day"
          />
        </v-card>
      </div>
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
    location_obj() {
      let prereqs = this.$store.state.prerequisites.data;
      console.log(prereqs, this.location);
      let u = prereqs.filter(d => d.location_id == this.location);
      return u[0];
    },

    data() {
      return this.history[this.day];
    },

    measures() {
      return this.$store.state.master.measures;
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
            this.$set(this.history[days], k, response[k]);
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