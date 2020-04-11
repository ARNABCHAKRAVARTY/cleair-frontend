<template>
  <div class="chart-lines">
    <v-card class="pa-1">
      <v-row no-gutters>
        <v-col cols="6">
          <v-card-title class="pt-1">{{measure.text}}</v-card-title>
          <v-card-subtitle>Time-Series</v-card-subtitle>
        </v-col>
        <v-col cols="6">
          <div class="text-right px-2 py-1">
            <span class="display-1 green--text">{{current | fix}}</span> 
            <span class="title">&nbsp;{{measure.unit}}</span>
          </div>
          <div class="text-right pr-2" style="margin-top:-0.8rem;">
            <span class="overline" style="">Current</span>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
        <v-card-text ref="box" class="pa-0">
          <div :id="chart_id" style="width:100%;"></div>
        </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import embed from "vega-embed";
export default {
  props: ["index", "xdata", "ydata", "measure", "current", "days"],
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
      return `lines-${this.index}-${this.measure.value}`;
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
            field: "x",
            type: "temporal",
            title: "Time",
            axis: {
              format: this.timeunit.format
            },

            timeunit: this.timeunit.unit
          },
          y: {
            field: "y",
            type: "quantitative",
            scale: {
              domain: [this.scales.min, this.scales.max]
            },
            title: `${this.measure.text} (${this.measure.unit})`
          }
        }
      };
    }
  },

  watch: {
    data() {
      console.log("data updated");
      this.draw();
    },
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

  filters: {
    fix(number) {
      return number.toFixed(0);
    }
  },

  mounted() {
    console.log('LINES MOUNTED:', this.days);
    this.draw()
  }
};
</script>

<style scoped>
</style>