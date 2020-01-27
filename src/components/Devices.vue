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
                  <h2>{{ item.dev_id }}</h2>
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

            
            <v-expand-transition
            >
              <div v-show="item.show">
                <v-divider></v-divider>

                  <v-sparkline
                    :labels="labels"
                    :fill="fill"
                    :gradient="gradient"
                    :line-width="width"
                    height="45"
                    :smooth="radius || false"
                    :value="getGraphValue()"
                    auto-draw
                  ></v-sparkline>
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
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea'],
]

export default {
  data() {
    return {
      fill: true,
      gradient: gradients[2],
      gradients,
      padding: 8,
      radius: 10,
      width: 2, 
      labels: [
        '8am',
        '9am',
        '10am',
        '11am',
        '12pm',
        '1pm',
        '2pm',
        '3pm',
        '4pm',
        '5pm',
      ],
      show: false,
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
    getGraphValue() {
      var arr = [];
      for (var i = 1; i < 10; i++) {
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