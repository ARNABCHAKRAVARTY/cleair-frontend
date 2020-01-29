<template>
  <v-card class="mx-auto" max-width="1200">
    <v-card-title>
      Devices
      <v-spacer></v-spacer>
      <v-select
        v-model="dropdown_select"
        :hint="`${dropdown_select.state}, ${dropdown_select.abbr}`"
        :items="dropdown_items"
        item-text="state"
        item-value="abbr"
        label="Select"
        persistent-hint
        return-object
        single-line
      ></v-select>
    </v-card-title>

    <template>
      <v-container>
        <v-col v-for="(item, i) in items" :key="i" cols="12">
          <v-card elevation="3">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">
                  <h2>ID: {{ item.dev_id }}</h2>
                </div>

                <v-list-item-title
                  class="headline mb-1"
                  v-if="dropdown_select.abbr === 'bat_temp'"
                >Battery Temp: {{item.bat_temp}}°C</v-list-item-title>
                <v-list-item-title
                  class="headline mb-1"
                  v-else-if="dropdown_select.abbr === 'cpu_temp'"
                >CPU Temp: {{item.cpu_temp}}°C</v-list-item-title>
                <v-list-item-title
                  class="headline mb-1"
                  v-else-if="dropdown_select.abbr === 'vin'"
                >Voltage IN: {{item.vin}} V</v-list-item-title>
                <v-list-item-title
                  class="headline mb-1"
                  v-else-if="dropdown_select.abbr === 'vout'"
                >Voltage OUT: {{item.vout}} V</v-list-item-title>
                <v-list-item-title
                  class="headline mb-1"
                  v-else-if="dropdown_select.abbr === 'bat_v'"
                >Battery Voltage: {{item.bat_v}} V</v-list-item-title>

                <v-list-item-title right></v-list-item-title>
                <v-list-item-subtitle>{{item.receive_time | date_filt}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="item.show = !item.show">
                  <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-expand-transition>
              
              <div v-show="item.show">
                <v-divider></v-divider>
                   <v-row>
                      <v-col class="d-flex" cols="6" md="4">
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-select
                          :items="label_items"
                          v-model="label_select"
                          label="Duration"
                        ></v-select>
                      </v-col>
                   </v-row>
                <div v-if="label_select==='Last 24 hours'">
                <v-sparkline
                  :labels="labels_1"
                  :fill="fill"
                  :gradient="gradient"
                  :line-width="width"
                  height="30"
                  :smooth="radius || false"
                  :value="getGraphValue(12)"
                  auto-draw
                ></v-sparkline>
                </div>
                <div v-if="label_select==='Last 7 days'">
                <v-sparkline
                  :labels="labels_2"
                  :fill="fill"
                  :gradient="gradient"
                  :line-width="width"
                  height="30"
                  :smooth="radius || false"
                  :value="getGraphValue(7)"
                  auto-draw
                ></v-sparkline>
                </div>
                <div v-if="label_select==='Last 30 days'">
                <v-sparkline
                  :labels="labels_3"
                  :fill="fill"
                  :gradient="gradient"
                  :line-width="width"
                  height="30"
                  :smooth="radius || false"
                  :value="getGraphValue(8)"
                  auto-draw
                ></v-sparkline>
                </div>
                <div v-if="label_select==='Last 90 days'">
                <v-sparkline
                  :labels="labels_4"
                  :fill="fill"
                  :gradient="gradient"
                  :line-width="width"
                  height="30"
                  :smooth="radius || false"
                  :value="getGraphValue(6)"
                  auto-draw
                ></v-sparkline>
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-container>
    </template>
  </v-card>
</template>

<script>
const axios = require("axios");
const moment = require("moment");
const server_host = "http://192.168.100.117:5000/";
const http = axios.create({
  baseURL: server_host
});
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"]
];

export default {
  data() {
    return {
      fill: true,
      gradient: gradients[2],
      gradients,
      padding: 2,
      radius: 8,
      width: 1,
      labels_1: ["12am","2am","4am","6am","8am","10am","12pm","2pm","4pm","6pm","8pm","10pm"],
      labels_2: ["Sun","Mon","Tue","Wed","Thurs","Fri","Sat"],
      labels_3: ["Jan 27","Jan 23","Jan 20","Jan 16","Jan 13","Jan 9","Jan 6","Jan 2"],
      labels_4: ["Jan 16","Jan 1","Dec 16","Dec 1","Nov 16","Nov 1"],
      show: false,
      label_select: null,
      label_items: ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 90 days'],
      dropdown_select: { state: "Battery Temperature", abbr: "bat_temp" },
      dropdown_items: [
        { state: "Battery Temperature", abbr: "bat_temp" },
        { state: "CPU Temperature", abbr: "cpu_temp" },
        { state: "Voltage IN", abbr: "vin" },
        { state: "Voltage OUT", abbr: "vout" },
        { state: "Battery Voltage", abbr: "bat_v" }
      ],
      items: [
        {
          bat_temp: "18",
          pm25: "70",
          humidity: "25",
          sdt: "15",
          pm10: "43",
          cpu_temp: "35",
          dev_id: "021",
          receive_time: "2020-01-17 10:48:25.389279+00:00",
          bat_soc: "5",
          bat_v: "50",
          pressure: "54",
          vout: "68",
          vin: "73",
          temperature: "41",
          status: "RUNNING",
          show: false
        },
        {
          bat_temp: "55",
          pm25: "23",
          humidity: "48",
          sdt: "15",
          pm10: "200",
          cpu_temp: "78",
          dev_id: "007",
          receive_time: "2020-01-17 10:48:25.389279+00:00",
          bat_soc: "5",
          bat_v: "47",
          pressure: "85",
          vout: "37",
          vin: "33",
          temperature: "40",
          status: "RUNNING",
          show: false
        },
        {
          bat_temp: "39",
          pm25: "137",
          humidity: "54",
          sdt: "15",
          pm10: "72",
          cpu_temp: "63",
          dev_id: "075",
          receive_time: "2020-01-17 10:48:25.389279+00:00",
          bat_soc: "5",
          bat_v: "54",
          pressure: "20",
          vout: "38",
          vin: "5",
          temperature: "43",
          status: "RUNNING",
          show: false
        },
        {
          bat_temp: "45",
          pm25: "163",
          humidity: "86",
          sdt: "15",
          pm10: "172",
          cpu_temp: "95",
          dev_id: "005",
          receive_time: "2020-01-17 10:48:25.389279+00:00",
          bat_soc: "5",
          bat_v: "58",
          pressure: "28",
          vout: "32",
          vin: "25",
          temperature: "20",
          status: "RUNNING",
          show: false
        }
      ]
    };
  },

  sockets: {},

  computed: {},

  methods: {
    getGraphValue(n) {
      var arr = [];
      for (var i = 1; i <= n; i++) {
        arr.push(Math.floor(Math.random() * 15) + 1);
      }
      return arr;
    }
  },

  mounted() {},

  filters: {
    from_now(date_time) {
      return moment(date_time).fromNow();
    },

    date_filt(date) {
      return moment(date).format("MMMM Do, YYYY HH:MM:SS");
    }
  }
};
</script>>

<style scoped>
</style>