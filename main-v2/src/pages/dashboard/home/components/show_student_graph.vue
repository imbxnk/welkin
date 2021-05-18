<template>
  <div>
    <v-row>
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title>student</v-card-title>
          <v-card-subtitle>hi</v-card-subtitle>
          <div id="chart" class="mt-n8">
            <apexchart
              type="radialBar"
              height="350"
              :options="chartOptions"
              :series="series"
            ></apexchart></div></v-card
      ></v-col>
      <v-col cols="12" md="4" lg="6"> </v-col
    ></v-row>
  </div>
</template>

<script>
export default {
  name: "students_graph",
  components: {},
  data() {
    return {
      loading: true,
      series: [44, 55, 67, 83],
      chartOptions: {
        chart: {
          height: 350,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: "22px",
              },
              value: {
                fontSize: "16px",
              },
              total: {
                show: true,
                label: "Total",
                formatter: function(w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  return 249;
                },
              },
            },
          },
        },
        labels: ["Apples", "Oranges", "Bananas", "Berries"],
      },
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>
