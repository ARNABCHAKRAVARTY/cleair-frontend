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
        <v-row wrap>
          <v-col cols="12">
            <h2 class="font-weight-thin">Located Devices</h2>
          </v-col>
          <v-col v-for="item in mapped_devices" :key="item.device_idx" cols="10">
            <v-card elevation="3" @click="open_dashboard(item.location_id)">
              <v-card-subtitle class="caption font-weight-medium pb-0">{{ item.device_name }}</v-card-subtitle>
              <v-card-title class="pt-0" style="align-items: end">
                <span
                  class="display-3 text-weight-bold"
                >{{ current[item.device_idx][dropdown_select.abbr] | fix}}</span>
                <span class="headline">{{dropdown_select.unit}}</span>
              </v-card-title>
              <v-card-subtitle class="caption pb-0">{{ dropdown_select.state }}</v-card-subtitle>
              <v-card-text>
                <span>{{current[item.device_idx].received_time | date_filt}}</span>
              </v-card-text>
              <v-card-actions>
                <span class="body-2">{{current[item.device_idx].location_name}}</span>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon>
                      <v-icon color="gray" dark v-on="on">mdi-map-marker-off</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove Location</span>
                </v-tooltip>
              </v-card-actions>

              <v-sparkline
                :value="get_history_day1"
                :gradient="gradient"
                :smooth="radius || false"
                :padding="padding"
                :line-width="width"
                :stroke-linecap="lineCap"
                :gradient-direction="gradientDirection"
                :fill="fill"
                :type="type"
                :auto-line-width="autoLineWidth"
                :labels="labels_1"
                auto-draw
              ></v-sparkline>
            </v-card>
          </v-col>
        </v-row>
        <!--
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline mb-4">
                    <h2 class="caption">{{ item.device_name }}</h2>
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
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn @click="assignLocation(item)">
                        <v-icon color="primary" dark v-on="on">mdi-map-marker-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Assign Location</span>
                  </v-tooltip>
                  <v-btn icon @click="item.show = !item.show">
                    <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
        -->
        <!--
            <v-expand-transition>
              <div v-show="item.show">
                <v-divider></v-divider>
                <v-row>
                  <v-col class="d-flex" cols="6" md="4">
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-select :items="label_items" v-model="label_select" label="Duration"></v-select>
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
        -->

        <v-row wrap>
          <v-col cols="12">
            <h2 class="font-weight-thin">Unassigned Devices</h2>
          </v-col>
          <v-col v-for="item in available_devices" :key="item.device_idx" cols="12" sm="4" md="3">
            <v-card elevation="3">
              <v-card-actions>
                <span class="title text-weight-bold">{{ item.device_name }}</span>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon @click="assignLocation(item)">
                      <v-icon color="primary" dark v-on="on">mdi-map-marker-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove Location</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!--
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline mb-4">
                    <h2>ID: {{ item.device_name }}</h2>
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
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn @click="assignLocation(item)">
                        <v-icon color="primary" dark v-on="on">mdi-map-marker-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Assign Location</span>
                  </v-tooltip>
                  <v-btn icon @click="item.show = !item.show">
                    <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

      -->
    </template>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }"></template>
      <v-card>
        <v-card-title>
          <span class="headline">Assign Location</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <span>
                <h2>Device ID: {{assign_device}}</h2>
              </span>
              <v-col cols="12">
                <v-select
                  :items="available_locations"
                  item-value="location_id"
                  item-text="location_name"
                  v-model="assign_location"
                  label="Location"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="save_location">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dashboard_dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dashboard_dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Dashboard</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
          <v-card-title class="headline">Last 24 hours</v-card-title>
          <v-card-subtitle class="overline">{{dropdown_select.state}}</v-card-subtitle>
          <v-sparkline
            :gradient="gradient"
            :line-width="width"
            :padding="padding"
            :smooth="radius || false"
            :value="get_history_day1"
            auto-draw
          ></v-sparkline>
        </v-card>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
const axios = require("axios");
const moment = require("moment");
const server_host = "http://13.235.245.238:9889/";
//const server_host = "http://192.168.1.2:5000/";
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
      padding: 1,
      radius: 2,
      width: 1,
      labels_1: [
        "12am",
        "2am",
        "4am",
        "6am",
        "8am",
        "10am",
        "12pm",
        "2pm",
        "4pm",
        "6pm",
        "8pm",
        "10pm"
      ],
      labels_2: ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
      labels_3: [
        "Jan 2",
        "Jan 6",
        "Jan 9",
        "Jan 13",
        "Jan 16",
        "Jan 20",
        "Jan 23",
        "Jan 27"
      ],
      labels_4: ["Nov 1", "Nov 16", "Dec 1", "Dec 16", "Jan 1", "Jan 16"],
      location_dropdown: [
        "Esplanade",
        "Exide Crossing",
        "Lord's Crossing",
        "SDF Building"
      ],
      assign_location: "",
      show: false,
      label_select: null,
      label_items: [
        "Last 24 hours",
        "Last 7 days",
        "Last 30 days",
        "Last 90 days"
      ],
      dropdown_items: [
        { state: "Battery Temperature", abbr: "bat_temp", unit: "°C" },
        { state: "CPU Temperature", abbr: "cpu_temp", unit: "°C" },
        { state: "Voltage IN", abbr: "vin", unit: "V" },
        { state: "Voltage OUT", abbr: "vout", unit: "V" },
        { state: "Battery Voltage", abbr: "bat_v", unit: "V" }
      ],
      dropdown_select: {state: "Battery Voltage", abbr: "bat_v", unit: "V"},
      dialog: false,
      dashboard_dialog: false,
      assign_device: "",
      assign_device_details: "",
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
          show: false
        }
      ],
      history_data_day1: [],
      history_data: [],

      graph_data : 
      [
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1428.0016,
            "temperature": 35.72,
            "humidity": 60.7664,
            "pm25": 88.8,
            "pm10": 90.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T00:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },

        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1548.0016,
            "temperature": 32.72,
            "humidity": 65.7664,
            "pm25": 93.8,
            "pm10": 95.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T01:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1228.0016,
            "temperature": 25.72,
            "humidity": 53.7664,
            "pm25": 40.8,
            "pm10": 43.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T02:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1328.0016,
            "temperature": 28.72,
            "humidity": 56.7664,
            "pm25": 84.8,
            "pm10": 80.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T03:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1478.0016,
            "temperature": 37.72,
            "humidity": 70.7664,
            "pm25": 78.8,
            "pm10": 70.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T04:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1558.0016,
            "temperature": 35.55,
            "humidity": 50.7664,
            "pm25": 85.8,
            "pm10": 95.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T05:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1468.0016,
            "temperature": 36.72,
            "humidity": 66.7664,
            "pm25": 68.8,
            "pm10": 60.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T06:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1477.0016,
            "temperature": 37.72,
            "humidity": 67.7664,
            "pm25": 78.8,
            "pm10": 70.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T07:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1488.0016,
            "temperature": 38.72,
            "humidity": 68.7664,
            "pm25": 80.8,
            "pm10": 78.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T08:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1428.0016,
            "temperature": 35.72,
            "humidity": 60.7664,
            "pm25": 88.8,
            "pm10": 90.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T09:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1328.0016,
            "temperature": 30.72,
            "humidity": 65.7664,
            "pm25": 45.8,
            "pm10": 40.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T10:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1228.0016,
            "temperature": 25.72,
            "humidity": 50.7664,
            "pm25": 60.8,
            "pm10": 65.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T11:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1228.0016,
            "temperature": 31.72,
            "humidity": 40.7664,
            "pm25": 70.8,
            "pm10": 71.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T12:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1428.0016,
            "temperature": 35.72,
            "humidity": 60.7664,
            "pm25": 88.8,
            "pm10": 90.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T13:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },

        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1548.0016,
            "temperature": 32.72,
            "humidity": 65.7664,
            "pm25": 93.8,
            "pm10": 95.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T14:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1228.0016,
            "temperature": 25.72,
            "humidity": 53.7664,
            "pm25": 40.8,
            "pm10": 43.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T15:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1328.0016,
            "temperature": 28.72,
            "humidity": 56.7664,
            "pm25": 84.8,
            "pm10": 80.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T16:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1478.0016,
            "temperature": 37.72,
            "humidity": 70.7664,
            "pm25": 78.8,
            "pm10": 70.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T17:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1558.0016,
            "temperature": 35.55,
            "humidity": 50.7664,
            "pm25": 85.8,
            "pm10": 95.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T18:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1468.0016,
            "temperature": 36.72,
            "humidity": 66.7664,
            "pm25": 68.8,
            "pm10": 60.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T19:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1477.0016,
            "temperature": 37.72,
            "humidity": 67.7664,
            "pm25": 78.8,
            "pm10": 70.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T20:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1488.0016,
            "temperature": 38.72,
            "humidity": 68.7664,
            "pm25": 80.8,
            "pm10": 78.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T21:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1428.0016,
            "temperature": 35.72,
            "humidity": 60.7664,
            "pm25": 88.8,
            "pm10": 90.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T22:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        },
        {
            "longitude": 88.373197,
            "location_name": "Rabindra Bhariti University",
            "bat_v": 7.8757,
            "start": "2020-01-21T13:40:58+05:30",
            "stop": null,
            "point": "Point 2",
            "pressure": 1328.0016,
            "temperature": 30.72,
            "humidity": 65.7664,
            "pm25": 45.8,
            "pm10": 40.8,
            "vout": 7.86,
            "latitude": 22.622906,
            "current": true,
            "bat_soc": 0.0,
            "device_name": "KOL02",
            "vin": 0.0347,
            "sdt": 32.8375,
            "cpu_temp": 35.91,
            "location_id": "6E7362DC5CB411EA9DAE02C15CCABC9A",
            "received_time": "2020-03-16T23:43:50.325878+00:00",
            "device_idx": "DB8BA05656E611EA9DAE02C15CCABC9A",
            "bat_temp": 0.0
        }],

      width: 1,
      radius: 1,
      padding: 10,
      lineCap: 'round',
      gradient: gradients[5],
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8],
      gradientDirection: 'top',
      gradients,
      fill: false,
      type: 'trend',
      autoLineWidth: false,
    };
  },

  sockets: {},

  computed: {
    available_devices() {
      return this.$store.getters.available_devices;
    },

    mapped_devices() {
      return this.$store.getters.mapped_devices;
    },

    available_locations() {
      return this.$store.getters.available_locations;
    },

    current() {
      return this.$store.state.current.data
      //return this.$store.getters.current
      /*
      let current_data = this.$store.getters.current;
      let dev_data = {};
      current_data.forEach(dev => {
        dev_data[dev.device_idx] = dev;
      });
      return dev_data;
      */
    },

    get_history_day1() {
      let hist = this.graph_data.map(item => item[this.dropdown_select.abbr])
      //this.history_data.forEach(item => hist.push(item[this.dropdown_select.abbr]))
      console.log("HIST: ", hist)
      return hist
    }
  },

  methods: {
    get_data() {
      this.$store.dispatch("get_prerequisites");
    },

    get_current_data() {
      this.$store.dispatch("get_current");
    },

    getGraphValue(n) {
      var arr = [];
      for (var i = 1; i <= n; i++) {
        arr.push(Math.floor(Math.random() * 15) + 1);
      }
      return arr;
    },

    assignLocation(new_device_assign) {
      this.dialog = true;
      console.log(new_device_assign.device_name);
      this.assign_device = new_device_assign.device_name;
      this.assign_device_details = new_device_assign;
    },

    save_location() {
      let new_mapping = {
        location_id: this.assign_location,
        device_id: this.assign_device_details.device_id,
        start: moment().format()
      };
      console.log("PAYLOAD:", new_mapping);

      this.$store.dispatch("create_mapping", new_mapping);

      this.dialog = false;
      this.assign_location = null;
      this.assign_device = null;
    },

    open_dashboard(loc_id){
      const endpoint = "/history"
      this.dashboard_dialog = true
      let url = endpoint + "/?days=1&location="+loc_id
      console.log("URL: ", url)
      //apis.history.get_history_data(loc_id) 
      http.get(url).then(
        response => {
          this.history_data = response.data;
          console.log("HISTORY:", this.history_data)
        },
        error => {
          console.log(error);
        }
      );  
    }
  },

  mounted() {
    this.get_data();
    this.get_current_data();
  },

  filters: {
    from_now(date_time) {
      return moment(date_time).fromNow();
    },

    date_filt(date) {
      return moment(date).format("MMMM Do, YYYY hh:mm:ss");
    },

    fix(number) {
      return number.toFixed(2);
    }
  }
};
</script>>

<style scoped>
</style>