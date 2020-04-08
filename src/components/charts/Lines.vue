<template>
  <div class="chart-lines">
    <v-card class="pa-2">
      <v-card-title>Vega-Lite Line Chart #{{index}}</v-card-title>
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
        { date: "2019-01-01", price: 28 },
        { date: "2019-01-02", price: 28 },
        { date: "2019-01-03", price: 28 },
        { date: "2019-01-04", price: 28 },
        { date: "2019-01-05", price: 28 },
        { date: "2019-01-06", price: 28 },
        { date: "2019-01-07", price: 28 },
        { date: "2019-01-08", price: 28 },
        { date: "2019-01-09", price: 28 },
        { date: "2019-01-10", price: 28 },
        { date: "2019-01-11", price: 28 },
        { date: "2019-01-12", price: 28 },
        { date: "2019-01-13", price: 28 },
      ]
    };
  },

  computed: {
    chart_id() {
      return `lines-${this.index}`;
    },

    schema() {
      return {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        description: "A simple line chart with embedded data.",
        height: 128,
        width: "container",
        data: {
          values: this.values
        },
        mark: {
          type: "area",
          interpolate: "basis",
          line: {
            color: "darkgreen"
          },
          color: {
            x1: 1,
            y1: 1,
            x2: 1,
            y2: 0,
            gradient: "linear",
            stops: [
              {
                offset: 0,
                color: "white"
              },
              {
                offset: 1,
                color: "darkgreen"
              }
            ]
          }
        },
        encoding: {
          x: {
            field: "date",
            type: "temporal"
          },
          y: {
            field: "price",
            type: "quantitative"
          }
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
      console.log("box", this.$refs.box.clientWidth);
      await embed(`#${this.chart_id}`, this.schema, { actions: false });
      console.log("drawing done");
    },

    update() {
      this.values = this.values.map(data => {
        return {
          date: data.date,
          price: Math.floor(Math.random() * Math.floor(100))
        };
      });
    }
  },

  mounted() {
    this.update();
    //this.draw();
  }
};
</script>

<style scoped>
</style>