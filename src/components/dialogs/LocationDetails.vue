<template>
  <v-dialog :value="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-container class="pt-0" style="background-color:rgba(247,247,252,1);">
        <v-row>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="close_dialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ location_obj.location_name }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-row>
        <v-row>
          <v-col cols="12" sm="8">
            <h2 class="headline">{{ location_obj.location_name }}</h2>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select :value="day" :items="days" label="Duration" @change="change_days"></v-select>
          </v-col>
        </v-row>

        <v-row class="pa-2" v-for="measure in measures" :key="measure.value">
          <v-col cols="12" sm="6">
            <v-card class="mx-auto elevation-2 mt-1 mb-1" max-width="800">
              <lines
                :xdata="data.received_time"
                :ydata="data[measure.value]"
                :index="location"
                :measure="measure"
                :current="current[measure.value]"
                :days="day"
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="mx-auto elevation-2 mt-1 mb-1" max-width="800">
              <histogram
                :xdata="data[measure.value]"
                :index="location"
                :measure="measure"
                :days="day"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <template v-for="measure in measures">
            <v-col cols="12" sm="6" :key="measure.value" v-if="measure.value != 'pm25'">
              <v-card class="mx-auto elevation-2 mt-1 mb-1" max-width="800">
                <heatmap
                  :xdata="data[measure.value]"
                  :ydata="data.pm25"
                  :index="location"
                  :measure="get_measure(measure.value)"
                  :days="day"
                />
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
    
<script>
const apis = require("@/resources/apis");

export default {
  props: {
    show: Boolean,
    location: { type: String, required: false, default: null },
    device: { type: String, required: false, default: null }
  },

  components: {
    Lines: () => import("@/components/charts/Lines"),
    Histogram: () => import("@/components/charts/Histogram"),
    Heatmap: () => import("@/components/charts/Heatmap")
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
    },

    current() {
      if (!!this.$store.state.current.data)
        return this.$store.state.current.data[this.device];
    }
  },

  methods: {
    get_measure(measure) {
      let m = this.measures.filter(m => m.value == measure);
      console.log("MEASURE: ", m[0]);
      return m[0];
    },

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