<template>
  <div class="chart-bars">
    <v-card class="pa-2">
      <v-card-title>Vega-Lite Bar Chart #{{index}}</v-card-title>
      <v-card-text ref="box" class="pa-0">
        <div :id="chart_id" style="width:100%;"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="update">Update</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import embed from "vega-embed";
export default {
  props: ["index"],
  data() {
    return {
      values: [
        { a: "A", b: 28 },
        { a: "B", b: 55 },
        { a: "C", b: 43 },
        { a: "D", b: 91 },
        { a: "E", b: 81 },
        { a: "F", b: 53 },
        { a: "G", b: 19 },
        { a: "H", b: 87 },
        { a: "I", b: 52 }
      ]
    };
  },

  computed: {
    chart_id() {
      return `bars-${this.index}`
    },

    schema() {
      return {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        description: "A simple bar chart with embedded data.",
        height: 128,
        width: 'container',
        data: {
          values: this.values
        },
        mark: "bar",
        encoding: {
          x: { field: "a", type: "ordinal" },
          y: { field: "b", type: "quantitative" }
        }
      };
    }
  },

  watch: {
    values() {
      console.log("updated");
      this.draw();
    }
  },

  methods: {
    async draw() {
      console.log("drawing start: ", this.schema);
      console.log("box", this.$refs.box.clientWidth)
      await embed(`#${this.chart_id}`, this.schema, {actions:false});
      console.log("drawing done");
    },

    update() {
      this.values = this.values.map(data => {
        return {
          a: data.a,
          b: Math.floor(Math.random() * Math.floor(100))
        };
      });
    }
  },

  mounted() {
    this.update()
    //this.draw();
  }
};
</script>

<style scoped>
</style>