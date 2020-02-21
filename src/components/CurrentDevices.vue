<template>
  <v-card class="mx-auto" max-width="1200">
    <v-card-title>
      Current Devices
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="table_items" :search="search">

      <template v-slot:item.pm25="{ item }">
        <v-chip width="100px" :color="getColor_25(item.pm25)" dark>{{ item.pm25 }}</v-chip>
      </template>
      <template v-slot:item.pm10="{ item }">
        <v-chip :color="getColor_10(item.pm10)" dark>{{ item.pm10 }}</v-chip>
      </template>

      <template v-slot:item.temperature="{ item }">
        <span >{{ item.temperature }} °C</span>
      </template>

      <template v-slot:item.humidity="{ item }">
        <span >{{ item.humidity }} %</span>
      </template>

      <template v-slot:item.pressure="{ item }">
        <span >{{ item.pressure }} Pa</span>
      </template>

      <template v-slot:item.receive_time="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">{{ item.receive_time | from_now }}</span>
          </template>
          <span>{{ item.receive_time | date_filt }}</span>
        </v-tooltip>
      </template>

    <!--  <template slot="table_items" slot-scope="props">
            <td class="text-xs-right pr-1">{{ props.table_items.dev_id }}</td>
            <td class="text-xs-left pl-1">{{ props.table_items.pm25 }}</td>
            <td class="text-xs-left">{{ props.table_items.pm10 }}</td>
            <td class="text-xs-left">{{ props.table_items.temperature }}</td>
            <td class="text-xs-left">{{ props.table_items.humidity }}</td>
            <td class="text-xs-left">{{ props.table_items.pressure }}</td>
            <td class="text-xs-left">{{ props.table_items.receive_time | date_filt }}</td>
      </template>
-->
    </v-data-table>
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

export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Device ID ",
          align: "left",
          value: "dev_id"
        },
        { text: "Battery Temperature", value: "bat_temp" },
        { text: "CPU Temperature", value: "cpu_temp" },
        { text: "Battery Voltage", value: "bat_v" },
        { text: "Voltage Out", value: "vout" },
        { text: "Voltage In", value: "vin" },
        { text: "Last Update", value: "receive_time" }
      ],
      table_items: [
        {
          bat_temp: "18",
          pm25: "40",
          humidity: "25",
          sdt: "15",
          pm10: "73",
          cpu_temp: "35",
          device_id: "021",
          receive_time: "2020-01-17 10:48:25.389279+00:00",
          bat_soc: "5",
          bat_v: "50",
          pressure: "54",
          vout: "68",
          vin: "73",
          temperature: "41"
        },
        {
          bat_temp: "55",
          pm25: "123",
          humidity: "48",
          sdt: "15",
          pm10: "180",
          cpu_temp: "78",
          device_id: "007",
          receive_time: "2020-01-17 10:48:25.389279+00:00",
          bat_soc: "5",
          bat_v: "47",
          pressure: "85",
          vout: "37",
          vin: "33",
          temperature: "40"
        },
        {
          bat_temp: "39",
          pm25: "237",
          humidity: "54",
          sdt: "15",
          pm10: "272",
          cpu_temp: "63",
          device_id: "075",
          receive_time: "2020-01-17 10:48:25.389279+00:00",
          bat_soc: "5",
          bat_v: "54",
          pressure: "20",
          vout: "38",
          vin: "5",
          temperature: "43"
        },
        {
          bat_temp: "45",
          pm25: "316",
          humidity: "86",
          sdt: "15",
          pm10: "372",
          cpu_temp: "95",
          device_id: "005",
          receive_time: "2020-01-17 10:48:25.389279+00:00",
          bat_soc: "5",
          bat_v: "58",
          pressure: "28",
          vout: "32",
          vin: "25",
          temperature: "20"
        }
      ]
    };
  },

  sockets: {  
    connect() {
      console.log("socket connected");
    },

    disconnect() {
      console.log("socket diconnected");
    },

    store_data(data) {
      const dev_id = data["device_id"];
      console.log("Device", device_id, "updated", data);
      let new_items = this.table_items.map(item => {
        if (item.device_id == device_id) {
          return data;
        } else {
          return item;
        }
      });
      this.table_items = new_items;
      //console.log(change_item)
      //console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },

  methods: {
    get_data() {
      let url = "cleair/current/";
      http.get(url).then(
        response => {
          this.table_items = response.data;
        },
        error => {
          console.log(error);
        }
      );
    },

    getColor_25 (value) {
        if (value < 50 ) return 'green'
        else if (value < 100) return '#E4CF41'
        else if (value < 150) return 'orange'
        else if (value < 200) return 'red'
        else return 'black'
      },
    getColor_10 (value) {
        if (value < 50 ) return 'green'
        else if (value < 100) return '#E4CF41'
        else if (value < 150) return 'orange'
        else if (value < 200) return 'red'
        else return 'black'
      },
  },

  mounted() {
    this.get_data();
  },

  filters: {
    from_now(date_time) {
      return moment(date_time).fromNow();
    },

    date_filt(date) {
      //console.log(moment(date).format("MMMM Do, YYYY HH:MM:ss"))
      return moment(date).format("MMMM Do, YYYY hh:mm:ss")
    },

    padded(value) {
      return String('XXX' + value).slice(-3).replace(/X/g,' ')
    }

  }
};
</script>

<style>
</style>