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

    <!-- <v-btn @click="$router.back()" class="ma-3">back </v-btn> -->
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
    <div class="row d-md-block">
      <div class="col-md-4 order-1 float-left">
        <v-card elevation="0" class="text-center pa-3">
          <v-img
            :src="students.avatar_url || $config.defaultAvatar"
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
          Email: {{ checkNull(this.students.email) }}<br />
          Phone: {{ checkNull(this.students.phone) }}<br />
          Curriculum: <a href="/curriculum">{{ getCurriculumName(this.students.batch) }}</a>
        </v-card>
      </div>
      <div class="col-md-4 order-3 float-left">
        <v-card elevation="0" class="pa-3"
          ><span class="overline">Taken courses</span>

          <div class="d-flex justify-content-around flex-wrap flex-row">
            <div class="order-1 text-center">
              <p class="mt-n1">Core</p>
              <h4 class="primary--text mt-n4">
                {{ this.students.records.core_credits }}
              </h4>
              <p class="small mt-n2 ">credits</p>
            </div>
            <div class="order-2 text-center">
              <p class="mt-n1">Required</p>
              <h4 class="primary--text mt-n4">{{ this.students.records.required_credits }}</h4>
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
      <div class="col-md-8 order-5 float-right">
        <v-card elevation="0" class="pa-3">
          <span class="overline">Core Courses</span>
          <v-divider></v-divider>
          <div v-if="this.students.taken_courses.core_courses.length > 0">
            <div v-for="(course, i) in this.students.taken_courses.core_courses" :key="i">
              <div class="d-flex pb-3 justify-content-between  flex-column flex-sm-row">
                <div>{{ course.class.course.name }}</div>
                <div>{{ course.grade }} / {{ course.class.year }}T{{ course.class.trimester }}</div>
              </div>
              <!-- <p>
                {{ course.class.course.name }}
                <span style="float:right;"
                  >{{ course.grade }} / {{ course.class.year }}T{{ course.class.trimester }}</span
                >
              </p> -->
            </div>
          </div>
          <div v-else>
            <span style="color: #b4b4b4"
              >This student has not enrolled any courses from Core Courses</span
            >
          </div>
        </v-card>
      </div>
      <div class="col-md-4 order-4 float-left">
        <v-card elevation="0" class="pa-3">
          <span class="overline">Remark</span><br />
          <span v-if="students.remarks == ''"> -</span>
          <span v-else
            ><ul class="mb-n1">
              <li v-for="(msg, i) in students.remarks" :key="i">
                "{{ msg.message }}", {{ msg.user.display_name }}
                <v-icon
                  v-if="msg.user.username === $currentUser.username"
                  small
                  @click="showDialog3(msg._id, msg.message, msg.user.display_name, i)"
                  >mdi-delete</v-icon
                >
              </li>
            </ul>
          </span>

          <v-card-actions class="mb-n2">
            <v-spacer></v-spacer>
            <v-btn outlined x-small @click="dialog2 = true"
              >Add <v-icon small>mdi-pencil</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
      <v-dialog v-model="dialog2" max-width="300px">
        <v-card class=" pa-3">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-icon @click="closedialog2()">mdi-close</v-icon>
          </v-card-title>
          <div class="text-center mt-n8">
            <p class="overline primary--text my-n2">Add Remark For</p>
            <p class="font-weight-bold ">{{ students.given_name }} {{ students.family_name }}</p>
          </div>

          <v-divider class=""></v-divider>
          <v-textarea
            outlined
            :rules="rules"
            counter="140"
            label="Remark"
            v-model="remark"
          ></v-textarea>

          <v-btn
            block
            class="mb-3"
            color="primary"
            :disabled="isDisable"
            rounded
            @click="saveremark(remark)"
          >
            save
          </v-btn>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog3" max-width="450px">
        <v-card>
          <v-card-title class="headline grey lighten-2"> Confirm delete </v-card-title><br />
          <v-card-text
            >Are you sure you want to delete "{{ delremarkMsg }}" from
            {{ delremarkUser }}?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="dialog3 = false">No</v-btn>
            <v-btn text color="success" @click="delRemark(delremarkID, delindex)">Yes</v-btn>
          </v-card-actions></v-card
        >
      </v-dialog>
      <!-- confirmation -->
      <v-snackbar centered v-model="snackbar" :timeout="1000">
        {{ snackbartext }}
      </v-snackbar>
      <div class="col-md-8 order-6 float-right">
        <v-card elevation="0" class="pa-3">
          <span class="overline">Required Major Courses</span>
          <v-divider></v-divider>
          <div v-if="this.students.taken_courses.required_courses.length > 0">
            <div v-for="(course, i) in this.students.taken_courses.required_courses" :key="i">
              <div class="d-flex pb-3 justify-content-between  flex-column flex-sm-row">
                <div>{{ course.class.course.name }}</div>
                <div>{{ course.grade }} / {{ course.class.year }}T{{ course.class.trimester }}</div>
              </div>
              <!-- <p>
                {{ course.class.course.name }}
                <span style="float:right;"
                  >{{ course.grade }} / {{ course.class.year }}T{{ course.class.trimester }}</span
                >
              </p> -->
            </div>
          </div>
          <div v-else>
            <span style="color: #b4b4b4"
              >This student has not enrolled any courses from Required Major Courses</span
            >
          </div>
        </v-card>
      </div>
      <div class="col-md-8 order-7 float-right">
        <v-card elevation="0" class="pa-3">
          <span class="overline">Elective Major Courses</span>
          <v-divider></v-divider>
          <div v-if="this.students.taken_courses.elective_courses.length > 0">
            <div v-for="(course, i) in this.students.taken_courses.elective_courses" :key="i">
              <div class="d-flex pb-3 justify-content-between  flex-column flex-sm-row">
                <div>{{ course.class.course.name }}</div>
                <div>{{ course.grade }} / {{ course.class.year }}T{{ course.class.trimester }}</div>
              </div>
              <!-- <p>
                {{ course.class.course.name }}
                <span style="float:right;"
                  >{{ course.grade }} / {{ course.class.year }}T{{ course.class.trimester }}</span
                >
              </p> -->
            </div>
          </div>
          <div v-else>
            <span style="color: #b4b4b4"
              >This student has not enrolled any courses from Elective Major Courses</span
            >
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "student_record",
  components: {},
  mounted() {
    // console.log(this.$currentUser);
    // this.getStudentsDetail();
  },
  created() {
    this.getStudentsDetail();
    // this.getCurriculum();
  },
  data() {
    return {
      dialog2: false,
      dialog3: false,
      snackbar: false,
      rules: [(v) => v.length <= 140 || "Max 140 characters"],
      remark: "",
      remarktext: {
        msg: "",
      },
      snackbartext: "",
      delremarkID: "",
      delremarkMsg: "",
      delremarkUser: "",
      delindex: 0,
      entry: {
        year: "",
        tri: "",
      },
      students: {
        taken_courses: {
          core_courses: [],
          required_courses: [],
          elective_courses: [],
        },
        records: {},
      },
      curriculums: [],
    };
  },
  computed: {
    isDisable() {
      if (this.remark.length > 0 && this.remark.length <= 140) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    checkNull(item) {
      if (item == " ") {
        return " - ";
      } else if (item == "null") {
        return " - ";
      } else if (!item) {
        return " - ";
      } else {
        return item;
      }
    },
    async getStudentsDetail() {
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
                            phone
                            lineID
                            lineUID
                            batch
                            advisor{
                              name
                            }
                            remarks {
                              user {
                                display_name
                                given_name
                                family_name
                                username
                              }
                              _id
                              message
                            }
                            taken_courses{
                              core_courses {
                                _id
                                class{
                                  course{ name credit }
                                  instructor{ name }
                                  trimester
                                  year
                                  section
                                }
                                grade
                                isGrading
                              }
                              required_courses {
                                _id
                                class{
                                  course{ name credit }
                                  instructor{ name }
                                  trimester
                                  year
                                  section
                                }
                                grade
                                isGrading
                              }
                              elective_courses {
                                _id
                                class{
                                  course{ name credit }
                                  instructor{ name }
                                  trimester
                                  year
                                  section
                                }
                                grade
                                isGrading
                              }
                            }
                            records{
                              egci_cumulative_gpa
                              total_credits
                              core_credits
                              required_credits
                              elective_credits
                             }
                        }
                  curriculums {
                    total
                    curriculums {
                      name
                      batches
                      passing_conditions {
                        core_courses
                        required_courses
                        elective_courses
                      }
                    }
                  }

                }
          `;
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.students = res.data.data.student;
          this.entry.year = this.students.entry_year;
          this.entry.tri = this.students.entry_trimester;
          this.curriculums = [...res.data.data.curriculums.curriculums];
          console.log(this.curriculums);
          // Loop separate courses
          // this.students.core_courses = [];
          // this.students.required_courses = [];
          // this.students.elective_courses = [];
          // this.students.taken_courses.forEach((course) => {
          //   switch (course.class.course.category) {
          //     case "core_courses":
          //       this.students.core_courses.push(course);
          //       break;
          //     case "required_courses":
          //       this.students.required_courses.push(course);
          //       break;
          //     case "elective_courses":
          //       this.students.elective_courses.push(course);
          //       break;
          //   }
          // });

          // console.log(this.students);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // async getCurriculum() {
    //   let query = `
    //          query{
    //             curriculum(searchInput:{batches:"${this.students.batch}"}){
    //               name
    //               passing_conditions{
    //                 core_courses
    //                 required_courses
    //                 elective_courses
    //               }
    //             }
    //           }
    //       `;
    //   await this.axios
    //     .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
    //     .then((res) => {
    //       console.log(res);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    getCurriculumName(batch) {
      let cur_name = "?";
      this.curriculums.forEach((curriculum) => {
        if (curriculum.batches.includes(batch)) return (cur_name = curriculum.name);
      });
      return cur_name;
    },
    closedialog2() {
      this.dialog2 = false;
      this.remark = "";
    },
    showDialog3(id, msg, usr, index) {
      this.dialog3 = true;
      this.delremarkID = id;
      this.delremarkMsg = msg;
      this.delremarkUser = usr;
      this.delindex = index;
    },
    saveremark() {
      this.remarktext.msg = this.remark;
      this.addRemark(this.remarktext);
    },
    async addRemark(val) {
      this.snackbar = false;
      this.snackbartext = "";
      let query = `
                mutation {
                  addRemark(remarkInput: {
                    studentId: "${this.students.sid}",
                    message: "${val.msg}"
                  }) {
                    _id
                    message
                  }
                }
              `;

      await this.axios
        .post(
          "https://api.welkin.app/v2/graphql",
          { query },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.data.addRemark) {
            this.snackbartext = "The remark has been saved";
            this.snackbar = true;
            this.students.remarks.push({
              message: res.data.data.addRemark.message,
              user: {
                username: this.$currentUser.username,
                display_name: this.$currentUser.display_name,
              },
              _id: res.data.data.addRemark._id,
            });
            this.dialog2 = false;
            this.remark = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delRemark(id) {
      this.snackbar = false;
      this.snackbartext = "";
      let query = `
                mutation {
                  delRemark(remarkId: "${id}") {
                    success
                    message
                  }
                }
              `;
      this.axios
        .post(
          "https://api.welkin.app/v2/graphql",
          { query },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.data.delRemark) {
            this.snackbartext = "The remark has been deleted";
            this.snackbar = true;
            this.students.remarks.splice(this.delindex, 1);
          }
          this.dialog3 = false;
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
  height: 350px;
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
