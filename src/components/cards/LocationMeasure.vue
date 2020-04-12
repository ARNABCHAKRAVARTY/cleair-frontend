<template>
  <v-card
    class="mx-auto elevation-2"
    outlined
    tile
    max-width="360px"
    min-width="290px"
    @click="open_dashboard(item.location_id)"
  >
    <v-row no-gutters>
      <v-col cols="8">
        <v-row align="start" no-gutters>
          <v-col cols="12">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>{{ item.location_name }}</v-list-item-title>
                <v-list-item-subtitle class="font-weight-light">{{ measure.text }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-sparkline
              v-if="!!history"
              :fill="true"
              :value="history"
              :gradient="spark.gradient"
              :smooth="spark.radius"
              :padding="spark.padding"
              :line-width="spark.width"
              :stroke-linecap="spark.lineCap"
              :gradient-direction="spark.gradientDirection"
              :type="spark.type"
              auto-draw
            ></v-sparkline>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row no-gutters class="fill-height pr-2">
          <v-col
            cols="12"
            style="overflow: visible; white-space: nowrap; text-align: right;
                              font-size: 3.8rem; font-weight:500; font-variant: proportional-nums;
                              letter-spacing:-0.15rem; line-height: 5rem; 
                              padding-top:0.5rem;"
          >
            <div class="blue--text" style="float:right; ">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ current[measure.value] | fix(measure.precision)}}</span>
                </template>
                <span>Max: {{ scale.max | fix(measure.precision)}}, Min: {{ scale.min | fix(measure.precision)}}</span>
              </v-tooltip>
            </div>
          </v-col>
          <v-col cols="12">
            <div
              class="text-right"
              style="font-size: 0.85rem; font-weight:700; 
                            letter-spacing:normal; line-height: 1rem;
                            width: 100%; margin-top:-0.75rem; padding-right:0.25rem;"
            >{{measure.unit}}</div>
          </v-col>
          <v-col cols="12">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
              <div
                class="text-right" v-on="on"
                style="font-size: 0.8rem; font-weight:300; 
                              letter-spacing:normal; line-height: 1.4rem;
                              width: 100%; padding-right:0.25rem;"
              >{{current.received_time | from_now}}</div>
              </template>
              <span>Last Updated: {{current.received_time | date_filt}}</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <location-details v-if="details.show"
      :show.sync="details.show" :location="details.location" :device="item.device_idx">
    </location-details>
  </v-card>
</template>

<script>
const moment = require("moment");
const apis = require("@/resources/apis");

export default {
  props: {
    measure: { type: Object, required: true },
    item: { type: Object, required: true }
  },

  components: {
    LocationDetails: () => import("@/components/dialogs/LocationDetails")
  },

  data() {
    return {
      spark: {
        gradient: ["rgba(10,10,240,0.80)", "rgba(33,150,243,0.20)"],
        radius: 8,
        padding: 10,
        width: 4,
        lineCap: "round",
        gradientDirection: "top",
        type: "trend"
      },
      data: {
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

      details: {
        show: false,
        location: this.item.location_id
      }
    };
  },

  computed: {
    current() {
      if (!!this.$store.state.current.data)
        return this.$store.state.current.data[this.item.device_idx];
    },

    history() {
      let d = this.data[this.measure.value].filter(x => x > 0)
      let min = Math.min(...d)
      return this.data[this.measure.value].map(x => x>0 ? x : min)
    },

    scale() {
        return {
          max: Math.max(...this.history),
          min: Math.min(...this.history)
        };
    }

  },

  methods: {
    get_data() {
      console.log('HISTORY: ', this.item.location_id, 1)
      apis.history.get_location_history(this.item.location_id, 1)
        .then(response => {
          for (let k in response) {
            this.$set(this.data, k, response[k])
          }
        })
        .catch(error => console.log('Error: ', error))
    },

    open_dashboard() {
      console.log("OPEN: ", this.details)
      this.details.show = true
    }
  },

  filters: {
    fix(number, digits) {
      return number.toFixed(digits || 0);
    },

    from_now(date_time) {
      return moment(date_time).fromNow();
    },

    date_filt(date) {
      return moment(date).format("MMMM Do, YYYY HH:mm:ss");
    },

  },

  mounted() {
    this.get_data();
  }
};
</script>

<style scoped>
</style>