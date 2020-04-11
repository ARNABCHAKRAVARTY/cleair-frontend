<template>
  <v-card class="mx-auto" max-width="1200" style="background-color:rgba(128,128,200,0.0625);">
    <template>
      <v-container class="py-0" fill-height>
        <v-row no-gutters align="center" justify="space-around">
          <v-col cols="12" sm="8" class="pa-4">
            <span class="headline">Locations</span>
          </v-col>
          <v-col cols="12" sm="4" class="pa-4">
            <v-select
              solo
              hide-details
              v-model="selection"
              :items="measures"
              label="Measure"
              single-line
            ></v-select>
          </v-col>
        </v-row>

        <v-row no-gutters wrap>
          <v-row v-if="!!history">
            <v-col cols="12" sm="6" v-for="item in mapped_devices" :key="item.device_idx">
              <location-measure :item="item" :measure="measure"></location-measure>
            </v-col>
          </v-row>
        </v-row>

              <!--
        <template v-if="!!history">
          <v-row no-gutters wrap v-for="(item1, id1) in mapped_devices" :key="item1.device_idx">
            <v-col cols="12" sm="6" v-for="(item2, id2) in mapped_devices" :key="item2.device_idx">
              <location-location
                :from="item1"
                :to="item2"
                :measure="measure"
                v-if="id1 < id2"
              ></location-location>
            </v-col>
          </v-row>
        </template>
              -->
      </v-container>
    </template>
  </v-card>
</template>

<script>
export default {
  components: {
    LocationMeasure: () => import("@/components/cards/LocationMeasure"),
    LocationLocation: () => import("@/components/cards/LocationLocation")
  },

  data() {
    return {
      selection: "pm25"
    };
  },

  computed: {
    measure() {
      return this.measures.filter(m => m.value == this.selection)[0];
    },

    measures() {
      return this.$store.state.master.measures;
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