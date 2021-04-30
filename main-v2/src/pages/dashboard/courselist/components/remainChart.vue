<template>
  <div>
    <div id="chart">
      <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
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
          height: 350,
          stacked: true,
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
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 5,
        },
      },
    };
  },
};
</script>
