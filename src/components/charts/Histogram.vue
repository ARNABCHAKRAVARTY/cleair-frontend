<template>
  <div class="chart-dist">
    <v-card class="pa-1">
      <v-row no-gutters>
        <v-col cols="6">
          <v-card-title class="pt-1">{{measure.text}}</v-card-title>
          <v-card-subtitle>Distribution</v-card-subtitle>
        </v-col>
        <v-col cols="6">
          <div class="text-right px-2 py-1">
            <span class="display-1 green--text">{{mean | fix}}</span>
            <span class="title">&nbsp;{{measure.unit}}</span>
          </div>
          <div class="text-right pr-2" style="margin-top:-0.8rem;">
            <span class="overline" style>Average</span>
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
  props: ["index", "xdata", "measure", "days"],
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
      return `hist-${this.index}-${this.measure.value}`;
    },

    data() {
      return this.xdata.map((x, i) => {
        let z = { x: x > 0 ? x : null };
        return z;
      });
    },

    mean() {
      let d = this.data.map(d => d.x).filter(isFinite);
      return d.reduce((prev, curr) => prev + curr, 0) / d.length;
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
            bin: true,
            field: "x",
            as: "bin_x"
          },
          {
            aggregate: [{ op: "count", as: "Count" }],
            groupby: ["bin_x", "bin_x_end"]
          },
          {
            joinaggregate: [{ op: "sum", field: "Count", as: "TotalCount" }]
          },
          {
            calculate: "datum.Count/datum.TotalCount",
            as: "PercentOfTotal"
          }
        ],
        mark: {
          type: "bar",
          tooltip: true,
          color: "rgba(0,100,0,0.5)"
        },
        encoding: {
          x: {
            title: `${this.measure.text} (${this.measure.unit})`,
            field: "bin_x",
            type: "quantitative",
            axis: {format: "d"},
            bin: { binned: true }
          },
          x2: { field: "bin_x_end" },
          y: {
            title: "Relative Frequency",
            field: "PercentOfTotal",
            type: "quantitative",
            axis: {
              format: ".1~%"
            }
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

  filters: {
    fix(number) {
      return number.toFixed(0);
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