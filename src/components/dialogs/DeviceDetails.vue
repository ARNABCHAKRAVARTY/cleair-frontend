<template>
  <v-dialog :value="show" fullscreen transition="dialog-bottom-transition">
    <v-card style="background-color:rgba(247,247,252,1);">
      <v-container class="pa-0">
        <v-toolbar flat>
          <v-toolbar-title>{{ device_obj.device_name }}: {{ device_obj.location_name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn fab small icon color="accent" @click="close_dialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-row class="px-2 py-1">
          <v-col cols="6">
            <v-btn-toggle class="chart-choice" :value="items.show" multiple @change="update_items">
              <v-btn>
                <v-icon>mdi-chart-line</v-icon>
              </v-btn>
              <v-btn>
                <v-icon>mdi-chart-histogram</v-icon>
              </v-btn>
              <v-btn>
                <v-icon>mdi-view-grid</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="6">
            <v-select
              solo
              hide-details
              single-line
              :value="day"
              :items="days"
              label="Duration"
              @change="change_days"
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="pa-2">
          <template v-for="measure in measures">
            <v-col
              class="px-3 py-1"
              cols="12"
              sm="6"
              v-if="charts.timeseries"
              :key="`ts-${measure.value}`"
            >
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
            <v-col
              class="px-3 py-1"
              cols="12"
              sm="6"
              v-if="charts.distributions"
              :key="`ds-${measure.value}`"
            >
              <v-card class="mx-auto elevation-2 mt-1 mb-1" max-width="800">
                <histogram
                  :xdata="data[measure.value]"
                  :index="location"
                  :measure="measure"
                  :days="day"
                />
              </v-card>
            </v-col>
          </template>
        </v-row>
        <v-row  class="pa-2" v-if="charts.correlations">
          <template v-for="measure in measures">
            <v-col
              class="px-3 py-1"
              cols="12"
              sm="6"
              :key="measure.value"
              v-if="measure.value != 'pm25'"
            >
              <v-card class="mx-auto elevation-2 mt-1 mb-1" max-width="800">
                <heatmap
                  :xdata="data[measure.value]"
                  :ydata="data.pm25"
                  :index="location"
                  :measure="get_measure(measure.value)"
                  :target="get_measure('pm25')"
                  scheme="bluegreen"
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
      items: {
        show: [0, 1, 2]
      },
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
    device_obj() {
      let prereqs = this.$store.state.prerequisites.data;
      console.log("DEVICE PREREQ", prereqs, this.device);
      let u = prereqs.filter(d => d.device_idx == this.device);
      return u[0];
    },

    charts() {
      return {
        timeseries: this.items.show.includes(0),
        distributions: this.items.show.includes(1),
        correlations: this.items.show.includes(2)
      };
    },

    data() {
      return this.history[this.day];
    },

    measures() {
      return this.$store.state.master.device_measures;
    },

    current() {
      if (!!this.$store.state.current.data)
        return this.$store.state.current.data[this.device];
    }
  },

  methods: {
    update_items($event) {
      console.log("ITEMS: ", $event);
      this.items.show = $event;
    },

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
  .chart-choice button.v-item--active {
    background-color: rgba(128,192,128,0.8) !important;
  }

  .chart-choice button {
    background-color: rgba(230,255,250,0.6) !important;
  }
  .chart-choice i.mdi {
    color: rgb(96,128,96) !important;
  }
  .chart-choice .v-item--active i.mdi {
    color: rgb(230,255,250) !important;
  }
</style>