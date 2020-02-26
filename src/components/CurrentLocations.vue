<template>
  <v-card class="mx-auto" max-width="1200">
    <v-card-title>
      Current Locations
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table :headers="headers" :items="current" :search="search">
      <template v-slot:item.pm25="{ item }">
        <v-chip width="100px" :color="getColor(item.pm25)" dark>{{ item.pm25 }}</v-chip>
      </template>
      <template v-slot:item.pm10="{ item }">
        <v-chip :color="getColor(item.pm10)" dark>{{ item.pm10 }}</v-chip>
      </template>

      <template v-slot:item.temperature="{ item }">
        <span>{{ item.temperature }} °C</span>
      </template>

      <template v-slot:item.humidity="{ item }">
        <span>{{ item.humidity }} %</span>
      </template>

      <template v-slot:item.pressure="{ item }">
        <span>{{ item.pressure }} Pa</span>
      </template>

      <template v-slot:item.received_time="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">{{ item.received_time | from_now }}</span>
          </template>
          <span>{{ item.received_time | date_filt }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
const moment = require("moment");

export default {
  data() {
    return {
      search: "",
      headers: [
        { text: "Location", align: "left", value: "location_name" },
        { text: "PM 2.5", align: "left", value: "pm25" },
        { text: "PM 10", align: "left", value: "pm10" },
        { text: "Temperature", align: "left", value: "temperature" },
        { text: "Humidity", value: "humidity" },
        { text: "Pressure", value: "pressure" },
        { text: "Device", value: "device_name" },
        { text: "Last Update", value: "received_time" }
      ]
    };
  },

  computed: {
    current() {
      return this.$store.getters.current;
    }
  },

  methods: {
    get_data() {
      this.$store.dispatch("get_current");
    },

    getColor(value) {
      if (value < 50) return "#004d00";
      else if (value < 100) return "#99cc00";
      else if (value < 150) return "#ffcc66";
      else if (value < 200) return "#ff9933";
      else if (value < 250) return "#ff5050";
      else if (value < 300) return "#990000";
      else if (value < 350) return "#340034";
      else if (value < 400) return "#4d0000";
      else return "black";
    },
    getColor_10(value) {
      if (value < 50) return "green";
      else if (value < 100) return "#E4CF41";
      else if (value < 150) return "orange";
      else if (value < 200) return "red";
      else return "black";
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
      //console.log(moment(date).format("MMMM Do, YYYY HH:MM:ss"))
      return moment(date).format("MMMM Do, YYYY hh:mm:ss");
    },

    padded(value) {
      return String("XXX" + value)
        .slice(-3)
        .replace(/X/g, " ");
    }
  }
};
</script>

<style>
</style>