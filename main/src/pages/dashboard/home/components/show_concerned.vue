<template>
  <v-card v-if="loading" elevation="0" color="#f7f7f8" class="pa-3" style="height:70px;">
    <v-progress-circular
      :size="25"
      color="primary"
      class="loading"
      indeterminate
    ></v-progress-circular>
  </v-card>
  <v-card v-else elevation="0" color="#f7f7f8" class="pa-3">
    <div class="overline my-n1">concerned student(s)</div>
    <span class="" v-if="students.length">
      <ul>
        <template v-for="(student, i) in students">
          <li :key="i">{{ student.name }} [Student ID: {{ student.sid }}]</li>
          <ul :key="'sublist' + i">
            <template v-for="(concernedCourse, j) in students[i].concernedCourses">
              <li :key="'concernlist' + j">
                {{ concernedCourse.class.course.code }}: {{ concernedCourse.class.course.name }} (
                Got {{ concernedCourse.grade }} on {{ Check(concernedCourse.taken_count) }} try )
              </li>
            </template>
          </ul>
        </template>
      </ul>
    </span>
    <span v-else>-</span></v-card
  >
</template>
<script>
export default {
  name: "Concerned",
  components: {},
  mounted() {
    this.getStudents();
  },
  data() {
    return {
      loading: true,
      students: [],
    };
  },
  methods: {
    Check(i) {
      if (i == "2") {
        return "second";
      }
      if (i == "3") {
        return "third";
      }
    },
    getStudents() {
      let query = `
              query{
  getConcernedStudent(searchInput:{}){
    total
    students{
      given_name
      family_name
      sid
      concernedCourses{
        class{
          course{
            code
            name
          }
          trimester
          year
        }
        grade
        taken_count
      }
    }
  }
}
          `;
      query = query.replace(/\s+/g, " ").trim();
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res.data.data.getConcernedStudent.students);
          this.students = [...res.data.data.getConcernedStudent.students];
          this.students.forEach((student) => {
            student["name"] = [student.given_name, student.family_name].join(" ");
          });

          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
