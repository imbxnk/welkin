<template>
  <div id="app">
    <v-btn @click="$router.push('/students/all')" class="ma-3">back to student list</v-btn>
    <!-- hello this is std rec {{ this.$route.params.sid }}<br />
    {{ this.students.given_name }} {{ this.students.family_name }}<br />
    {{ this.students.entry_year }}T{{ this.students.entry_trimester }}<br />
    Email: {{ this.students.email }}<br />
    Line id: {{ this.students.lineID }}<br />
    status: {{ this.students.status.current }}<br />
    taken_courses:<br />
    core
    <div v-for="(course, i) in this.students.taken_courses" :key="i">
      <div v-if="course.class.course.category == 'core_courses'">
        {{ course.class.course.name }} {{ course.grade }} {{ course.class.year }}T{{
          course.class.trimester
        }}
      </div>
    </div>
    required
    <div v-for="(course, i) in this.students.taken_courses" :key="i">
      <div v-if="course.class.course.category == 'required_courses'">
        {{ course.class.course.name }} {{ course.grade }} {{ course.class.year }}T{{
          course.class.trimester
        }}
      </div>
    </div>
    elective
    <div v-for="(course, i) in this.students.taken_courses" :key="i">
      <div v-if="course.class.course.category == 'elective_courses'">
        {{ course.class.course.name }} {{ course.grade }} {{ course.class.year }}T{{
          course.class.trimester
        }}
      </div>
    </div>
    <br /> -->
    <v-row>
      <v-col cols="4">
        <v-card outlined>pic</v-card>
      </v-col>
      <v-col>
        <v-card outlined class="pa-5">
          <h6>{{ this.students.given_name }} {{ this.students.family_name }}</h6>

          {{ this.students.entry_year }}T{{ this.students.entry_trimester }}<br />
          Email: {{ this.students.email == null ? " - " : this.students.email }}<br />
          Line id: {{ this.students.lineID == null ? " - " : this.students.lineID }}<br />
          Status: {{ this.students.status.current }}<br />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "student_record",
  components: {},
  mounted() {},
  created() {
    this.getStudentsDetail();
  },
  data() {
    return {
      entry: {
        year: "",
        tri: "",
      },
      students: [],
    };
  },

  methods: {
    getStudentsDetail() {
      let query = `
              query {
                      student (searchInput: { sid: "${this.$route.params.sid}" }) {
                            sid
                            program
                            prefix
                            given_name
                            family_name
                            entry_trimester
                            entry_year
                            nick_name
                            avatar_url
                            email
                            lineID
                            lineUID
                            advisor
                            remarks {
                              user {
                                display_name
                                given_name
                                family_name
                              }
                              message
                            }
                            status{
                                current
                            }
                            taken_courses{
                                _id
                                class{
                                  course{
                                      name
                                      credit
                                      category
                                    }
                                  instructor{
                                      name
                                    }
                                  trimester
                                  year
                                  section
                                }
                              grade
                              isGrading
                            }
                        }
                    }
          `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.students = res.data.data.student;
          this.entry.year = this.students.entry_year;
          this.entry.tri = this.students.entry_trimester;
          console.log(this.students);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.cardbg {
  background: #f8f9fa;
}
</style>
