<template>
  <v-card class="card-height pa-3">
    <v-card-title>Overall Student Registration</v-card-title>

    <table class="table table-hover">
      <tr>
        <th rowspan="2">Course Type</th>
        <th rowspan="2">Course Name</th>
        <th colspan="6" align="center">Remain Student</th>
      </tr>
      <tr>
        <th>57</th>
        <th>58</th>
        <th>59</th>
        <th>60</th>
        <th>61</th>
        <th>63</th>
      </tr>
      <tr>
        <td>C</td>
        <td>EGCI100</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
        <td>7</td>
        <td>8</td>
      </tr>
    </table>
  </v-card>
</template>
<script>
export default {
  name: "Overall_Remain",
  props: [],
  components: {},
  created() {},
  data() {
    return {};
  },
};
</script>
<style scoped>
.card-height {
  height: calc(var(--app-height) - 85px);
}
</style>
