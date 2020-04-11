<template>
  <div class="corr-heat">
    <v-card class="pa-1">
      <v-card-title>{{measure.text}} &mdash; {{target.text}}</v-card-title>
      <v-card-subtitle>Correlation</v-card-subtitle>
      <v-card-text ref="box" class="pa-0">
        <div :id="chart_id" style="width:100%;"></div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import embed from "vega-embed";
export default {
  props: ["index", "xdata", "ydata", "measure", "target", "days", "scheme"],
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
      return `corr-${this.index}-${this.measure.value}`;
    },

    data() {
      return this.xdata.map((x, i) => {
        let z = { x: x, y: this.ydata[i] > 0 ? this.ydata[i] : null };
        return z;
      });
    },

    scales() {
      let ymax = this.ydata.map(y => (y > 0 ? y : -Infinity));
      let ymin = this.ydata.map(y => (y > 0 ? y : +Infinity));
      let max = Math.max(...ymax);
      let min = Math.min(...ymin);
      console.log("MIN-MAX: ", min, max);

      if ((max - min) / min < 0.05) {
        min = max / 1.05;
      } else {
        min = 0;
      }
      return {
        max: max,
        min: min
      };
    },

    timeunit() {
      if (this.days == 1) {
        return { unit: "hours", format: "%a %I %p" };
      } else if (this.days == 7) {
        return { unit: "monthdate", format: "%b %d %I %p" };
      } else if (this.days == 28) {
        return { unit: "monthdate", format: "%b %d" };
      } else if (this.days == 365) {
        return { unit: "yearmonth", format: "%b %d, %Y" };
      }
    },

    schema() {
      console.log("SCHEMA");
      return {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        description: "?",
        height: 192,
        width: "container",
        data: {
          values: this.data
        },
        transform: [
          {
            filter: {
              and: [
                { field: "x", valid: true },
                { field: "y", valid: true }
              ]
            }
          }
        ],
        mark: {
          type: "rect",
          tooltip: true
        },
        encoding: {
          x: {
            bin: { maxbins: 8 },
            field: "x",
            type: "quantitative",
            axis: {format: "d"},
            title: `${this.measure.text} (${this.measure.unit})`
          },
          y: {
            bin: { maxbins: 8 },
            field: "y",
            type: "quantitative",
            axis: {format: "d"},
            title: `${this.target.text} (${this.target.unit})`
          },
          color: {
            aggregate: "count",
            type: "quantitative",
            title: "Count",
            scale: {scheme: this.scheme || "greens"}
          }
        },
        config: {
          view: {
            stroke: "transparent"
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
      console.log("update");
    }
  },

  mounted() {
    console.log("HEATMAP");
    console.log(this.days);
    this.draw()
  }
};
</script>

<style scoped>
</style>