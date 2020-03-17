<template>
  <v-card class="mx-auto" max-width="1200">
    <v-card-title>
      Locations
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
          <v-col v-for="item in mapped_devices" :key="item.device_idx" cols="12">
            <v-card elevation="3" @click="open_dashboard(item.location_id)">
              <v-card-subtitle class="body-2 font-weight-medium pb-0">{{ item.location_name }}</v-card-subtitle>
              <v-card-title class="pt-0" style="align-items: end">
                <span
                  class="display-3 text-weight-bold"
                  :color="getColor(current[item.device_idx][dropdown_select.abbr])"
                >{{ current[item.device_idx][dropdown_select.abbr] | fix}}</span>
                <span class="headline">{{dropdown_select.unit}}</span>
              </v-card-title>
              <v-card-subtitle class="caption pb-0">{{ dropdown_select.state }}</v-card-subtitle>
              <v-card-text>
                <span>{{current[item.device_idx].received_time | date_filt}}</span>
              </v-card-text>
              <v-sparkline
                :value="get_history_day1"
                :gradient="gradient"
                :smooth="radius"
                :padding="padding"
                :line-width="width"
                :stroke-linecap="lineCap"
                :gradient-direction="gradientDirection"
                fill
                :type="type"
                :auto-line-width="autoLineWidth"
                auto-draw
              ></v-sparkline>
              <v-card-actions>
                <v-card-subtitle
                  class="font-weight-medium pb-0"
                >{{current[item.device_idx].device_name}}</v-card-subtitle>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon>
                      <v-icon color="gray" dark v-on="on">mdi-link-off</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove Device</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row wrap>
          <v-col cols="12">
            <h2 class="font-weight-thin">Unassigned Devices</h2>
          </v-col>
          <v-col v-for="item in available_locations" :key="item.device_idx" cols="12" sm="4" md="3">
            <v-card elevation="3">
              <v-card-actions>
                <span class="title text-weight-bold">{{ item.location_name }}</span>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon @click="assignLocation(item)">
                      <v-icon color="primary" dark v-on="on">mdi-link-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Assign Device</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }"></template>
      <v-card>
        <v-card-title>
          <span class="headline">Assign Device</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <span>
                <h2>Location: {{assign_location}}</h2>
              </span>
              <v-col cols="12">
                <v-select
                  :items="available_devices"
                  item-value="device_id"
                  item-text="device_name"
                  v-model="assign_device"
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
          <v-btn color="blue darken-1" text @click="save_mapped_device">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dashboard_dialog"
      v-if="dashboard_dialog"
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
        <v-col class="d-flex" cols="12" sm="6">
          <v-select v-model="duration_select" :items="label_items" label="Duration"></v-select>
        </v-col>
        <v-divider></v-divider>

        <template v-if="duration_select=='Last 24 hours'">
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">PM2.5</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data1_pm25"
              :labels="get_labels_day"
              fill
              auto-draw
            ></v-sparkline>
          </v-card>
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">PM10</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data1_pm10"
              :labels="get_labels_day"
              fill
              auto-draw
            ></v-sparkline>
          </v-card>
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">Temperature</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data1_temperature"
              :labels="get_labels_day"
              fill
              auto-draw
            ></v-sparkline>
          </v-card>
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">Humidity</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data1_humidity"
              :labels="get_labels_day"
              fill
              auto-draw
            ></v-sparkline>
          </v-card>
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">Pressure</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data1_pressure"
              :labels="get_labels_day"
              fill
              auto-draw
            ></v-sparkline>
          </v-card>
        </template>
        <template v-if="duration_select=='Last 7 days'">
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">PM2.5</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data7_pm25"
              :labels="get_labels_week"
              fill
              auto-draw
            ></v-sparkline>
            <!--<div id="vegapm25"></div>-->
          </v-card>
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">PM10</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data7_pm10"
              :labels="get_labels_week"
              fill
              auto-draw
            ></v-sparkline>
          </v-card>
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">Temperature</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data7_temperature"
              :labels="get_labels_week"
              fill
              auto-draw
            ></v-sparkline>
          </v-card>
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">Humidity</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data7_humidity"
              :labels="get_labels_week"
              fill
              auto-draw
            ></v-sparkline>
          </v-card>
          <v-card class="elevation-2 mt-5 mb-5 mx-auto" max-width="800">
            <v-card-title class="headline">Pressure</v-card-title>
            <v-sparkline
              :gradient="gradient"
              :line-width="width"
              :padding="padding"
              :smooth="radius || false"
              :value="get_history_data7_pressure"
              :labels="get_labels_week"
              fill
              auto-draw
            ></v-sparkline>
          </v-card>
        </template>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
const axios = require("axios");
const moment = require("moment");
//const server_host = "http://192.168.100.117:5000/";
const server_host = "http://13.235.245.238:9889/";
const http = axios.create({
  baseURL: server_host
});
import embed from "vega-embed";

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
      history_data: null,
      data: {
        received_time: [
          "2020-02-08 11:00:00+00:00",
          "2020-02-08 12:00:00+00:00"
        ],
        temperature: [2.15, 2.15],
        pm10: [259.0, 259.0],
        pressure: [1.0, 1.0],
        sdt: [2.14, 2.14],
        bat_soc: [25.6, 25.6],
        bat_v: [12.36, 12.36],
        pm25: [300.0, 300.0],
        vin: [52.36, 52.36],
        bat_temp: [2.36, 2.36],
        cpu_temp: [1.23, 1.23],
        vout: [23.36, 23.36],
        humidity: [0.25, 0.25]
      },

      fill: true,
      gradient: gradients[2],
      gradients,
      padding: 2,
      radius: 8,
      assign_device: null,
      assign_location: null,
      assign_location_details: null,
      dashboard_dialog: false,
      dialog: false,
      width: 1,
      labels_1: [
        "12am",
        " ",
        " ",
        " ",
        "4am",
        " ",
        " ",
        " ",
        "8am",
        " ",
        " ",
        " ",
        "12pm",
        " ",
        " ",
        " ",
        "4pm",
        " ",
        " ",
        " ",
        "8pm",
        " ",
        " ",
        " "
      ],
      labels_1_1: [
        "00am",
        "02am",
        "04am",
        "06am",
        "08am",
        "10am",
        "12pm",
        "14pm",
        "16pm",
        "18pm",
        "20pm",
        "22pm"
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
      show: false,
      label_select: null,
      label_items: ["Last 24 hours", "Last 7 days"],
      duration_select: "Last 24 hours",
      dropdown_select: { state: "Temperature", abbr: "temperature", unit: "°C" },
      dropdown_items: [
        { state: "Temperature", abbr: "temperature", unit: "°C" },
        { state: "Pressure", abbr: "pressure", unit: "Pa" },
        { state: "Humidity", abbr: "humidity", unit: "%" },
        { state: "PM 2.5", abbr: "pm25", unit: "μg/m³" },
        { state: "PM 10", abbr: "pm10", unit: "μg/m³" }
      ],
      items: [
        {
          bat_temp: "18",
          pm25: "70",
          humidity: "25",
          sdt: "15",
          pm10: "43",
          cpu_temp: "35",
          dev_loc: "SHIMLA BIRIYANI",
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
          dev_loc: "ESPLANADE",
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
          dev_loc: "ULTADANGA",
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
          dev_loc: "EXIDE CROSSING",
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
      ],

      graph_data_7: [
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1428.0016,
          temperature: 35.72,
          humidity: 60.7664,
          pm25: 88.8,
          pm10: 90.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T00:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },

        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1548.0016,
          temperature: 32.72,
          humidity: 65.7664,
          pm25: 93.8,
          pm10: 95.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T01:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1228.0016,
          temperature: 25.72,
          humidity: 53.7664,
          pm25: 40.8,
          pm10: 43.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T02:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1328.0016,
          temperature: 28.72,
          humidity: 56.7664,
          pm25: 84.8,
          pm10: 80.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T03:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1478.0016,
          temperature: 37.72,
          humidity: 70.7664,
          pm25: 78.8,
          pm10: 70.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T04:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1558.0016,
          temperature: 35.55,
          humidity: 50.7664,
          pm25: 85.8,
          pm10: 95.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T05:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1468.0016,
          temperature: 36.72,
          humidity: 66.7664,
          pm25: 68.8,
          pm10: 60.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T06:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        }
      ],

      graph_data_1_1: [
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1428.0016,
          temperature: 35.72,
          humidity: 60.7664,
          pm25: 88.8,
          pm10: 90.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T00:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },

        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1548.0016,
          temperature: 32.72,
          humidity: 65.7664,
          pm25: 93.8,
          pm10: 95.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T01:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1228.0016,
          temperature: 25.72,
          humidity: 53.7664,
          pm25: 40.8,
          pm10: 43.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T02:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1328.0016,
          temperature: 28.72,
          humidity: 56.7664,
          pm25: 84.8,
          pm10: 80.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T03:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1478.0016,
          temperature: 37.72,
          humidity: 70.7664,
          pm25: 78.8,
          pm10: 70.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T04:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1558.0016,
          temperature: 35.55,
          humidity: 50.7664,
          pm25: 85.8,
          pm10: 95.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T05:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1468.0016,
          temperature: 36.72,
          humidity: 66.7664,
          pm25: 68.8,
          pm10: 60.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T06:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1477.0016,
          temperature: 37.72,
          humidity: 67.7664,
          pm25: 78.8,
          pm10: 70.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T07:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1488.0016,
          temperature: 38.72,
          humidity: 68.7664,
          pm25: 80.8,
          pm10: 78.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T08:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1428.0016,
          temperature: 35.72,
          humidity: 60.7664,
          pm25: 88.8,
          pm10: 90.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T09:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1328.0016,
          temperature: 30.72,
          humidity: 65.7664,
          pm25: 45.8,
          pm10: 40.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T10:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1228.0016,
          temperature: 25.72,
          humidity: 50.7664,
          pm25: 60.8,
          pm10: 65.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T11:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        }
      ],
/*
      graph_data_1: [
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1428.0016,
          temperature: 35.72,
          humidity: 60.7664,
          pm25: 88.8,
          pm10: 90.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T00:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },

        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1548.0016,
          temperature: 32.72,
          humidity: 65.7664,
          pm25: 93.8,
          pm10: 95.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T01:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1228.0016,
          temperature: 25.72,
          humidity: 53.7664,
          pm25: 40.8,
          pm10: 43.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T02:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1328.0016,
          temperature: 28.72,
          humidity: 56.7664,
          pm25: 84.8,
          pm10: 80.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T03:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1478.0016,
          temperature: 37.72,
          humidity: 70.7664,
          pm25: 78.8,
          pm10: 70.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T04:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1558.0016,
          temperature: 35.55,
          humidity: 50.7664,
          pm25: 85.8,
          pm10: 95.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T05:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1468.0016,
          temperature: 36.72,
          humidity: 66.7664,
          pm25: 68.8,
          pm10: 60.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T06:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1477.0016,
          temperature: 37.72,
          humidity: 67.7664,
          pm25: 78.8,
          pm10: 70.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T07:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1488.0016,
          temperature: 38.72,
          humidity: 68.7664,
          pm25: 80.8,
          pm10: 78.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T08:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1428.0016,
          temperature: 35.72,
          humidity: 60.7664,
          pm25: 88.8,
          pm10: 90.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T09:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1328.0016,
          temperature: 30.72,
          humidity: 65.7664,
          pm25: 45.8,
          pm10: 40.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T10:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1228.0016,
          temperature: 25.72,
          humidity: 50.7664,
          pm25: 60.8,
          pm10: 65.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T11:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1228.0016,
          temperature: 31.72,
          humidity: 40.7664,
          pm25: 70.8,
          pm10: 71.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T12:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1428.0016,
          temperature: 35.72,
          humidity: 60.7664,
          pm25: 88.8,
          pm10: 90.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T13:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },

        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1548.0016,
          temperature: 32.72,
          humidity: 65.7664,
          pm25: 93.8,
          pm10: 95.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T14:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1228.0016,
          temperature: 25.72,
          humidity: 53.7664,
          pm25: 40.8,
          pm10: 43.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T15:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1328.0016,
          temperature: 28.72,
          humidity: 56.7664,
          pm25: 84.8,
          pm10: 80.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T16:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1478.0016,
          temperature: 37.72,
          humidity: 70.7664,
          pm25: 78.8,
          pm10: 70.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T17:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1558.0016,
          temperature: 35.55,
          humidity: 50.7664,
          pm25: 85.8,
          pm10: 95.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T18:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1468.0016,
          temperature: 36.72,
          humidity: 66.7664,
          pm25: 68.8,
          pm10: 60.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T19:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1477.0016,
          temperature: 37.72,
          humidity: 67.7664,
          pm25: 78.8,
          pm10: 70.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T20:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1488.0016,
          temperature: 38.72,
          humidity: 68.7664,
          pm25: 80.8,
          pm10: 78.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T21:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1428.0016,
          temperature: 35.72,
          humidity: 60.7664,
          pm25: 88.8,
          pm10: 90.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T22:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        },
        {
          longitude: 88.373197,
          location_name: "Rabindra Bhariti University",
          bat_v: 7.8757,
          start: "2020-01-21T13:40:58+05:30",
          stop: null,
          point: "Point 2",
          pressure: 1328.0016,
          temperature: 30.72,
          humidity: 65.7664,
          pm25: 45.8,
          pm10: 40.8,
          vout: 7.86,
          latitude: 22.622906,
          current: true,
          bat_soc: 0.0,
          device_name: "KOL02",
          vin: 0.0347,
          sdt: 32.8375,
          cpu_temp: 35.91,
          location_id: "6E7362DC5CB411EA9DAE02C15CCABC9A",
          received_time: "2020-03-16T23:43:50.325878+00:00",
          device_idx: "DB8BA05656E611EA9DAE02C15CCABC9A",
          bat_temp: 0.0
        }
      ],
*/
      width: 4,
      radius: 8,
      padding: 10,
      lineCap: "round",
      gradient: ["#99d8c9", "#2ca25f"],
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8],
      gradientDirection: "top",
      gradients,
      fill: false,
      type: "trend",
      autoLineWidth: false
    };
  },

  computed: {
    spec() {
      return {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        description: "Google's stock price over time.",
        data: this.data,
        mark: "line",
        encoding: {
          x: { field: "received_time", type: "temporal" },
          y: { field: "pm25", type: "quantitative" }
        }
      };
    },

    prerequisites() {
      return this.$store.getters.prerequisites;
    },

    graph_data_1() {
      return this.$store.getters.history;
    },

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
      return this.$store.state.current.data;
    },

    get_history_day1() {
      let hist = this.graph_data_1.filter(d =>
        moment().diff(moment(d.received_time), "hours") < 24
      ).map(item => item[this.dropdown_select.abbr])
      console.log("HIST DAY1: ", hist);
      return hist;
    },

    get_labels_day() {
      let hist = !!this.history_data ? this.history_data.received_time : null
      let h = !!hist ? hist.slice(hist.length - 24, hist.length) : []

      return h.map(t => {
          let hour = moment(t).format('h')
          let m = moment(t).format('A')
          return (parseInt(hour) % 2) == 0  ? hour + m : " "
        })
    },

    get_labels_week() {
      let hist = !!this.history_data ? this.history_data.received_time : null
      let start = Math.max(0, hist.length - 7*24)
      let h = !!hist ? hist.slice(start, hist.length) : []
 
      return h.map(t => {
          let day = moment(t).format('ddd')
          let hour = moment(t).format('h')
          let HH = moment(t).format('H')
          let m = moment(t).format('A')
          let v = (parseInt(HH) % 24) == 0  ? day : " "
          console.log(day, hour, m, v)
          return v
        })
    },

    get_history_data1_pm25() {
      let hist = !!this.history_data ? this.history_data.pm25 : null
      let h = !!hist ? hist.slice(hist.length - 24, hist.length) : []
      console.log('PM 2.5', h)
      return h
    },

    get_history_data7_pm25() {
      let hist = !!this.history_data ? this.history_data.pm25 : null
      let start = Math.max(0, hist.length - 7*24)
      let h = !!hist ? hist.slice(start, hist.length) : []
      console.log('PM 2.5 (7D)', h)
      return h
    },

    get_history_data1_pm10() {
      let hist = !!this.history_data ? this.history_data.pm10 : null
      let h = !!hist ? hist.slice(hist.length - 24, hist.length) : []
      console.log('PM 10', h)
      return h
    },
    get_history_data1_temperature() {
      let hist = !!this.history_data ? this.history_data.temperature : null
      let h = !!hist ? hist.slice(hist.length - 24, hist.length) : []
      console.log('Temp', h)
      return h
    },
    get_history_data1_humidity() {
      let hist = !!this.history_data ? this.history_data.humidity : null
      let h = !!hist ? hist.slice(hist.length - 24, hist.length) : []
      console.log('Humidity', h)
      return h
    },
    get_history_data1_pressure() {
      let hist = !!this.history_data ? this.history_data.pressure : null
      let h = !!hist ? hist.slice(hist.length - 24, hist.length) : []
      console.log('Pressure', h)
      return h
    },

    get_history_data7_pm10() {
      let hist = !!this.history_data ? this.history_data.pm10 : null
      let start = Math.max(0, hist.length - 7*24)
      let h = !!hist ? hist.slice(start, hist.length) : []
      console.log('PM 10 (7D)', h)
      return h
    },
    get_history_data7_temperature() {
      let hist = !!this.history_data ? this.history_data.temperature : null
      let start = Math.max(0, hist.length - 7*24)
      let h = !!hist ? hist.slice(start, hist.length) : []
      console.log('Temperature (7D)', h)
      return h
    },
    get_history_data7_humidity() {
      let hist = !!this.history_data ? this.history_data.humidity : null
      let start = Math.max(0, hist.length - 7*24)
      let h = !!hist ? hist.slice(start, hist.length) : []
      console.log('Humidity (7D)', h)
      return h
    },
    get_history_data7_pressure() {
      let hist = !!this.history_data ? this.history_data.pressure : null
      let start = Math.max(0, hist.length - 7*24)
      let h = !!hist ? hist.slice(start, hist.length) : []
      console.log('Pressure (7D)', h)
      return h
    }
  },

  methods: {
    get_data() {
      this.$store.dispatch("get_prerequisites");
    },

    getGraphValue(n) {
      var arr = [];
      for (var i = 1; i <= n; i++) {
        arr.push(Math.floor(Math.random() * 15) + 1);
      }
      return arr;
    },

    assignLocation(new_location_assign) {
      this.dialog = true;
      console.log(new_location_assign.location_name);
      this.assign_location = new_location_assign.location_name;
      this.assign_location_details = new_location_assign;
    },

    save_mapped_device() {
      let new_mapping = {
        location_id: this.assign_location,
        device_id: this.assign_device_details.device_id,
        start: moment().format()
      };
      console.log("PAYLOAD:", new_mapping);

      this.$store.dispatch("create_mapping", new_mapping);

      this.dialog = false;
      this.assign_location = "";
      this.assign_device = "";
    },

    getColor(value) {
      if (value < 50) return "green";
      else if (value < 100) return "#E4CF41";
      else if (value < 150) return "orange";
      else if (value < 200) return "red";
      else return "black";
    },

    open_dashboard(loc_id) {
      const endpoint = "/history/";
      this.dashboard_dialog = true;
      let url = endpoint + loc_id  ;
      console.log("URL: ", url);
      //apis.history.get_history_data(loc_id)
      http.get(url).then(
        response => {
          this.history_data = response.data;
          console.log("HISTORY:", this.history_data);
          //embed("#vegapm25", this.spec, { actions: false });
        },
        error => {
          console.log(error);
        }
      );
    }
  },

  mounted() {
    this.get_data();
  },

  filters: {
    from_now(date_time) {
      return moment(date_time).fromNow();
    },

    date_filt(date) {
      return moment(date).format("MMMM Do, YYYY HH:MM:SS");
    },

    fix(number) {
      return number.toFixed(0);
    }
  }
};
</script>>

<style scoped>
</style>