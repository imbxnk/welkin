<template>
  <div id="app">
    <a @click="$router.back()" class="overline my-n1 back primary--text"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrow-left"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
        />
      </svg>
      BACK</a
    >
    <v-card class=" pa-3">
      <v-card-title>Overall Student Registration</v-card-title>

      <table class="table table-hover">
        <tr>
          <th rowspan="2" align="center">Course Type</th>
          <th rowspan="2" align="center">Course Name</th>
          <th colspan="6" align="center">Remain Student</th>
        </tr>
        <tr>
          <th v-for="(batch, i) in this.$config.selectedBatches" :key="i">{{ batch }}</th>
        </tr>
        <tr v-for="(course, i) in courses" :key="i">
          <td align="center">{{ course.category }}</td>
          <td>{{ course.name }}</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
      </table>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "Overall_Remain",
  props: [],
  components: {},
  created() {},
  data() {
    return {
      courses: {},
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
                  category
                }
              }
            }
          `;
      query = query.replace(/\s+/g, " ").trim();

      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.courses = [...res.data.data.courses.courses];
          this.courses.forEach((course) => {
            // course.category = course.category.join(", ");
            course.category = course.category
              .join(", ")
              .replace("core_course", "C")
              .replace("required_courses", "R")
              .replace("elective_courses", "E");
          });
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
