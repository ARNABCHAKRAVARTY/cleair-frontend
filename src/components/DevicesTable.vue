<template>
  <v-card class="mx-auto" max-width="1200">
    <v-card-title>
      All Devices
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="devices" :search="search"></v-data-table>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark fixed bottom right fab v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add Device</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Device ID*" v-model="new_dev_id" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Device name*" v-model="new_dev_name" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="save_new_device">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
const apis = require("@/resources/apis");
const moment = require("moment");

export default {
  data() {
    return {
      search: "",
      new_dev_name: "",
      new_dev_id: "",
      new_mcu_id: "",
      dialog: false,
      headers: [
        {
          text: "Device ID ",
          align: "left",
          value: "device_id"
        },
        { text: "Name", value: "name" }
      ],
      table_items: {
        0: {
          device_id: "e0000544d430520313230",
          name: "KOL04"
        },
        1: {
          device_id: "100000544d430520313230",
          name: "KOL05"
        },
        2: {
          device_id: "130008544d430720313230",
          name: "KOL01"
        },
        3: {
          device_id: "2e000f544d430720313230",
          name: "KOL02"
        },
        4: {
          device_id: "110000544d430520313230",
          name: "KOL03"
        }
      }
    };
  },

  computed: {
    devices() {
      //return Object.values(this.table_items);
      return this.$store.getters.devices
    }

    /*
    new_device() {
      return {
        dev_id : this.new_dev_id || null,
        dev_name : this.new_dev_name || null
      }
    }
  */
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
    save_new_device() {
      this.dialog = false;
      console.log("Adding New Device ID: ", this.new_dev_id);
      console.log("Adding New Device Name: ", this.new_dev_name);

      let item = {
        device_id: this.new_dev_id,
        name: this.new_dev_name
      };

      apis.devices
        .create(item)
        .then(response => {
          console.log(response);
        })
        .catch(error => console.log(error))
        .finally(() => {
          this.cancel_new_device();
          setTimeout(this.get_data, 5000);
        });
    },

    cancel_new_device() {
      this.dialog = false;
      this.new_dev_id = "";
      this.new_dev_name = "";
    },

    get_data() {
      /*
      apis.devices
        .get_devices()
        .then(response => {
          this.table_items = response;
        })
        .catch(error => {
          console.log(error);
        });
        */
      this.$store.dispatch('get_devices')
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