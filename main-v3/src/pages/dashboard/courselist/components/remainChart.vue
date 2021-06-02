<template>
  <div>
    <div id="chart">
      <apexchart type="bar" :height=height :options="chartOptions" :series="series"></apexchart>
    </div>
    <v-dialog v-model="dialog" width="300">
      <v-card>
        <v-card-title class="mb-n2">
          Student with ID {{ this.batch[this.index] }}<v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon>
        </v-card-title>

        <v-divider class="mx-5"></v-divider>
        <v-card-text>
          Registered : {{ this.passed[this.index] }}<br />
          Remain : {{ this.total[this.index] }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "remainChart",
  props: ["batch", "total", "passed"],
  component: [],
  created() {},
  mounted() {
    this.height = 160 + (this.$config.selectedBatches.length * 20)
    console.log(this.height)
  },
  data() {
    return {
      index: 0,
      height: 200,
      dialog: false,
      series: [
        {
          name: "Registered",
          data: this.passed,
        },
        {
          name: "Remain",
          data: this.total,
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: this.height,
          stacked: true,
          fontFamily: "Quicksand, sans-serif",
          toolbar: {
            show: false,
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.getBatch(config.dataPointIndex);
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        dataLabels: {
          style: {
            colors: ["#fff", "#000000de"],
          },
        },
        // colors: ["#3c84fb", "#97b8f0"],
        // colors: ["#3c84fb", "#000000de"],
        colors: ["#3c84fb", "#0000000e"],
        title: {
          text: "Registered Students",
          style: {
            fontSize: "16px",
            fontWeight: "600",
          },
        },
        xaxis: {
          categories: this.batch,
          labels: {
            formatter: function(val) {
              return val;
            },
          },
        },

        yaxis: {
          title: {
            text: undefined,
          },
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val;
            },
          },
          x: {
            formatter: function(val) {
              return "Students with ID: " + val;
            },
          },
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 10,
        },
      },
    };
  },
  methods: {
    getBatch(i) {
      this.index = i;
      this.dialog = true;
      console.log(this.batch[this.index]);
    },
  },
};
</script>
<style scoped></style>
