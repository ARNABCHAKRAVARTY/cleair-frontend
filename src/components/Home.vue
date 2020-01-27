<template>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col class="text-center">
           <span> <h1>CleAir : Pollution Control  </h1></span>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
  }
</script>