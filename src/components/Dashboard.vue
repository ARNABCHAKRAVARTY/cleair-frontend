<template>
  <v-card class="mx-auto" max-width="1200" style="background-color:rgba(128,128,200,0.0625);">
    <v-card-title class="pb-0">
      <v-row no-gutters align="center" justify="space-around">
        <v-col cols="12" sm="8">
          <span class="headline">Locations</span>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select solo hide-details v-model="selection" :items="measures" label="Measure" single-line></v-select>
        </v-col>
      </v-row>
    </v-card-title>

    <template>
      <v-container class="py-0">
        <v-row no-gutters wrap>
          <v-col cols="12">
            <h2 class="font-weight-thin">Located Devices</h2>
          </v-col>

          <v-row v-if="!!history">
            <v-col cols="12" sm="6" md="4" v-for="item in mapped_devices" :key="item.device_idx">
              <location-measure :item="item" :measure="measure" :scales="scales"></location-measure>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </template>
  </v-card>
</template>

<script>
export default {};
</script>

<style>
</style></template>

<script>
export default {
  components: {
    LocationMeasure: () => import("@/components/cards/LocationMeasure")
  },

  data() {
    return {
      selection: "pm25",
      measures: [
        { text: "Temperature", value: "temperature", unit: "°C" },
        { text: "Pressure", value: "pressure", unit: "Pa" },
        { text: "Humidity", value: "humidity", unit: "%" },
        { text: "PM 2.5", value: "pm25", unit: "μg/m³" },
        { text: "PM 10", value: "pm10", unit: "μg/m³" }
      ]
    };
  },

  computed: {
    measure() {
      return this.measures.filter(m => m.value == this.selection)[0];
    },

    current() {
      return this.$store.state.current.data;
    },

    history() {
      return this.$store.getters.history;
    },

    mapped_devices() {
      return this.$store.getters.mapped_devices;
    },
    available_locations() {
      return this.$store.getters.available_locations;
    },

    scales() {
      let h = this.$store.getters.history;
      if (!!h && h.length > 0) {
        let H = h.map(h => h[this.measure.value]);
        return {
          max: Math.max(...H),
          min: Math.min(...H)
        };
      }
    }
  },

  methods: {
    get_data() {
      this.$store.dispatch("get_prerequisites");
    },

    get_current() {
      this.$store.dispatch("get_current");
    },

    graph_data(location, measure) {
      this.history.filter(d => d.location_id == location).map(d => d[measure]);
    }
  },

  filters: {},

  mounted() {
    this.get_data();
    this.get_current();
  }
};
</script>

<style scoped>
</style>