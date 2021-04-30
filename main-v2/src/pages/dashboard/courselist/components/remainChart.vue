<template>
  <div>
    <div id="chart">
      <apexchart type="bar" height="200" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>
<script>
export default {
  name: "remainChart",
  props: ["batch", "total", "passed"],
  component: [],
  created() {},
  data() {
    return {
      series: [
        {
          name: "Remain",
          data: this.total,
        },
        {
          name: "Registed",
          data: this.passed,
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 200,
          stacked: true,
          toolbar: {
            show: false,
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
        colors: ["#3c84fb", "#97b8f0"],
        title: {
          text: "Remain students",
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
};
</script>
