<template>
  <v-card class="mx-auto" max-width="1200">
    <v-card-title>
      All Locations
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="locations" :search="search">
    </v-data-table>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark fixed bottom right fab v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add Location</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field label="Location Point*" v-model="new_loc_point" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Location name*" v-model="new_loc_name" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Latitude*" v-model="new_loc_lat" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Longitude*" v-model="new_loc_lng" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel_new_loc">Close</v-btn>
          <v-btn color="blue darken-1" text @click="save_new_loc">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
const apis = require("@/resources/apis");
const axios = require("axios");
const moment = require("moment");
const server_host = "http://13.235.245.238:9889/";
//const server_host = "http://192.168.0.108:5000/";
const http = axios.create({
  baseURL: server_host
});

export default {
  data() {
    return {
      search: "",
      dialog: false,
      new_loc_point: "",
      new_loc_name: "",
      new_loc_lat: "",
      new_loc_lng: "",
      headers: [
        {
          text: "Point ",
          align: "left",
          value: "point"
        },
        { text: "Name", value: "name" },
        { text: "Longitude", value: "longitude" },
        { text: "Latitude", value: "latitude" },
      ],
      table_items: {
        0: {
          point: 1,
          name: "Victoria Memorial",
          longitude: 88.3455603,
          latitude: 22.5456733
        },
        1: {
          point:  3,
          name: "Ekbalput (near Netaji Nursing Home / UBI)",
          longitude: 88.32543570000001,
          latitude: 22.532055399999997
        },
        2: {
          point:5,
          name: "Taratala Road (Marine Engineering & Research Institute)",
          longitude: 88.3096562,
          latitude: 22.515289399999997
        },
        3: {
          point:  6,
          name: "Chetla (Desher Khabar)",
          longitude: 88.3376305,
          latitude: 22.5172701
        },
        4: {
          point:7,
          name: "Lords More",
          longitude: 88.3578411,
          latitude: 22.5020468
        },
        5: {
          point: 8,
          name: "Adarsha Palli (Ray Bahadur Road, Lions Club)",
          longitude: 88.32768229999999,
          latitude: 22.4998266
        },
        6: {
          point: 9,
          name: "Rabindra Nagar (Parnasree Airport)",
          longitude: 88.2981887,
          latitude: 22.5002082
        },
        7: {
          point: 10,
          name: "Karunamoyee Crossing",
          longitude: 88.3402162,
          latitude: 22.4859836
        },
        8: {
          point:  11,
          name: "Pallisree (Nabarun Club)",
          longitude: 88.3752647,
          latitude: 22.4839843
        },
        9: {
          point: 12,
          name: "Garia (Depot)",
          longitude: 88.37768940000001,
          latitude: 22.465831899999998
        },
        10: {
          point: 13,
          name: "Ajoynagar",
          longitude: 88.3945766,
          latitude: 22.4887427
        },
        11: {
          point: 14,
          name: "Ruby More",
          longitude: 88.4017918,
          latitude: 22.5134832
        },
        12: {
          point:  15,
          name: "Safui Para",
          longitude: 88.38420179999999,
          latitude: 22.5024516
        },
        13: {
          point: 16,
          name: "Ballygunge Phari",
          longitude: 88.3660607,
          latitude: 22.527527499999998
        },
        14: {
          point: 17,
          name: "Topsia more",
          longitude: 88.38666009999999,
          latitude: 22.5417578
        },
        15: {
          point: 18,
          name: "Moulali (Kolkata Youth Center)",
          longitude: 88.3676808,
          latitude: 22.5618976
        },
        16: {
          point: 19,
          name: "Beleghata (Building more)",
          longitude: 88.4077529,
          latitude: 22.5617316
        },
        17: {
          point: 20,
          name: "Esplanade (park in front of Victoria House)",
          longitude: 88.3520864,
          latitude: 22.566212399999998
        },
        18: {
          point:  21,
          name: "Phoolbagan",
          longitude: 88.38942809999999,
          latitude: 22.5722359
        },
        19: {
          point:  22,
          name: "Ultadanga (below foot bridge)",
          longitude: 88.39315570000001,
          latitude: 22.591408899999998
        },
        20: {
          point: 23,
          name: "Girish Park",
          longitude: 88.3628146,
          latitude: 22.586039899999996
        },
        21: {
          point:  24,
          name: "Shyambazar (Five Points)",
          longitude: 88.3736721,
          latitude: 22.601786999999998
        },
        22: {
          point:  4,
          name: "BNR (Engine Gate)",
          longitude: 88.3104341,
          latitude: 22.5433497
        }
      }
    };
  },

  computed: {

    locations() {
      return Object.values(this.table_items)
    }

  },
  /*
  sockets: {
    connect() {
      console.log("socket connected");
    },

    disconnect() {
      console.log("socket diconnected");
    },

    change(data) {
      const dev_id = data["dev_id"];
      console.log("Device", dev_id, "updated", data);
      let new_items = this.table_items.map(item => {
        if (item.dev_id == dev_id) {
          return data;
        } else {
          return item;
        }
      });
      this.table_items = new_items;
      //console.log(change_item)
      //console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  }, */

  methods: {
    save_new_loc() {
      this.dialog = false
      console.log("New Location Pt.: ", this.new_loc_point)
      console.log("New Location Name: ", this.new_loc_name)
      console.log("New Location Lat: ", this.new_loc_lat)
      console.log("New Location Long: ", this.new_loc_lng)

      let item = {
        "point" : this.new_loc_point,
        "name" : this.new_loc_name,
        "latitude" : this.new_loc_lat,
        "longitude" : this.new_loc_lng

      }

      apis.locations
        .create(item)
        .then(response => {
          console.log(response);
        })
        .catch(error => console.log(error))
        .finally(() => {
          this.cancel_new_loc();
          setTimeout(this.get_data, 5000);
        });

    },

    cancel_new_loc() {
      this.new_loc_point= ""
      this.new_loc_name= ""
      this.new_loc_lat= ""
      this.new_loc_lng= ""
      this.dialog = false
    },

    
    get_data() {
    /*  let url = "location/";
      http.get(url).then(
        response => {
          this.table_items = response.data;
        },
        error => {
          console.log(error);
        }
      ); */
      this.$store.dispatch('get_locations')
    }, 

    getColor(value) {
      if (value < 50) return "#004d00";
      else if (value < 100) return "#99cc00";
      else if (value < 150) return "#ffcc66";
      else if (value < 200) return "#ff9933";
      else if (value < 250) return "#ff6600";
      else if (value < 300) return "#ff5050";
      else if (value < 350) return "#990000";
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