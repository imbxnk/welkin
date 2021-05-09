<template>
  <div id="app">
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

    <v-btn @click="$router.push('/students/all')" class="ma-3">back to student list</v-btn>
    <div class="row d-md-block">
      <div class="col-md-4 order-1 float-left">
        <v-card elevation="0" class="text-center pa-3">
          <v-img
            src="https://semantic-ui.com/images/avatar2/large/matthew.png"
            contain
            max-width="230"
            class="center"
          />
          <div class="overline">{{ this.students.sid }}</div>
        </v-card>
      </div>
      <div class="col-md-8 order-2 float-right">
        <v-card elevation="0" class="profile-card">
          <span class="overline">About this student</span>
          <h3>{{ this.students.given_name }} {{ this.students.family_name }}</h3>
          <v-divider></v-divider>
          {{ this.students.entry_year }}T{{ this.students.entry_trimester }}<br />
          Email: {{ this.students.email == null ? " - " : this.students.email }}<br />
          Line id: {{ this.students.lineID == null ? " - " : this.students.lineID }}<br />
        </v-card>
      </div>
      <div class="col-md-4 order-3 float-left">
        <v-card elevation="0" class="pa-3"
          ><span class="overline">Taken courses</span>

          <div class="d-flex justify-content-around flex-wrap flex-row">
            <div class="order-1 text-center">
              <p class="mt-n1">Core</p>
              <h4 class="primary--text mt-n4">{{ this.students.records.core_credits }}</h4>
              <p class="small mt-n2 ">credits</p>
            </div>
            <div class="order-2 text-center">
              <p class="mt-n1">Required</p>
              <h4 class="primary--text mt-n4">{{ this.students.records.major_credits }}</h4>
              <p class="small mt-n2 ">credits</p>
            </div>
            <div class="order-3 text-center">
              <p class="mt-n1">Elective</p>
              <h4 class="primary--text mt-n4">{{ this.students.records.elective_credits }}</h4>
              <p class="small mt-n2 ">credits</p>
            </div>
          </div>
        </v-card>
      </div>
      <!-- <div class="col-md-8 order-5 float-right">
        <v-card elevation="0" class="card-height1">
          5
        </v-card>
      </div>
      <div class="col-md-4 order-4 float-left">
        <v-card elevation="0" class="card-height2">
          4
        </v-card>
      </div> -->
    </div>
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
                            records{
                              egci_cumulative_gpa
                              total_credits
                              core_credits
                              major_credits
                              elective_credits
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
.pic-card {
  height: 300px;
  padding: 1em;
}
.profile-card {
  height: 400px;
  padding: 1em;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
.card-height1 {
  height: 188px;
  padding: 1em;
}
.card-height2 {
  height: 144px;
  padding: 1em;
}
</style>
