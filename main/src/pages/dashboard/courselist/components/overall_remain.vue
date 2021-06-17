<template>
  <v-card class=" pa-3">
    <v-card-title>Overall Student Registration</v-card-title>

    <table class="table table-hover">
      <tr>
        <th rowspan="2">Course Type</th>
        <th rowspan="2">Course Name</th>
        <th colspan="6" align="center">Remain Student</th>
      </tr>
      <tr>
        <th v-for="(batch, i) in this.$config.selectedBatches" :key="i">{{ batch }}</th>
      </tr>
      <tr v-for="(course, i) in courses" :key="i">
        <td>course type</td>
        <td>{{ course.name }}</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
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
    return {
      courses: [],
    };
  },
  mounted() {
    this.getClasses();
    console.log(this.$config.selectedBatches);
  },
  methods: {
    getClasses() {
      let query = `
              {
              courses {
                total
                courses {
                  name
                  code
                }
              }
            }
          `;
      query = query.replace(/\s+/g, " ").trim();
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.courses = [...res.data.data.courses.courses];
          console.log(this.courses);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
/* .card-height {
  height: calc(var(--app-height) - 85px);
} */
</style>
