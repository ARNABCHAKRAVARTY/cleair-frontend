<template>
  <v-container class="pa-0">
    <v-tabs v-model="tab" grow>
      <v-tab v-for="item in items" :key="item.key">{{ item.name }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item.key">
        <dashboard v-if="item.key == 'locations'"></dashboard>        
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
export default {
  props: {
    source: String
  },
  components: {
    Dashboard: () => import("@/components/Dashboard")
  },

  data: () => ({
    tab: 0,
    items: [
      {key: 'locations', name: 'Locations'}, 
      {key: 'devices', name: 'Devices'}
    ]
  })
};
</script>