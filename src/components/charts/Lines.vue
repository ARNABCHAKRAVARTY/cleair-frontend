<template>
  <div class="chart-lines">
    <v-card class="pa-2">
      <v-card-title>{{name}}</v-card-title>
      <v-card-text ref="box" class="pa-0">
        <div :id="chart_id" style="width:100%;"></div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import embed from "vega-embed";
export default {
  props: ["index", "name", "chart", "xdata", "ydata"],
  data() {
    return {
      values: {
        date: [],
        price: []
      }
    };
  },

  computed: {
    chart_id() {
      return `lines-${this.index}-${this.chart}`;
    },

    data() {
      return this.xdata.map( (x,i) => {return {x: x, y: this.ydata[i]}})
    },

    schema() {
      return {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        description: "A simple line chart with embedded data.",
        height: 128,
        width: "container",
        data: {
          values: this.data
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
            field: 'x',
            type: "temporal"
          },
          y: {
            field: "y",
            type: "quantitative"
          }
        }
      };
    }
  },

  watch: {
    data() {
      console.log("data updated");
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
      console.log("update")
    }
  },

  mounted() {
  }
};
</script>

<style scoped>
</style>