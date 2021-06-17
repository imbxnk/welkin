<template>
  <div id="app">
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
      <div v-if="loading">
        <v-progress-circular
          :size="50"
          class="loading-center  "
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>

      <div v-else class="row wk-std-record-container pt-3">
        <div class="d-md-block row">
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
              <b>Entry Trimester: </b>
              <span v-if="this.students.entry_year && this.students.entry_year"
                >{{ this.students.entry_year }}T{{ this.students.entry_trimester }}<br
              /></span>
              <span v-else> -<br /></span>
              <b>Email:</b> {{ checkNull(this.students.email) }}<br />
              <b>Phone:</b> {{ checkNull(this.students.phone) }}<br />
              <b>Performance:</b>
              <span>
                <v-chip small :color="getColor(this.students.performance)" dark class="mx-3 mt-n1">
                  {{ this.students.performance }}
                </v-chip></span
              ><br />
              <b>Curriculum:</b>
              <a href="/curriculum"> {{ getCurriculumName(this.students.batch) }}</a>
            </v-card>
          </div>
          <div class="col-md-4 order-3 float-left">
            <v-card elevation="0" class="pa-3">
              <!-- <span class="overline">Taken courses</span> -->
              <div class="d-flex justify-content-around flex-wrap flex-row mt-4">
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
        <div class="col-12 pa-0 pt-4 order-last wk-footer align-self-end justify-content-between flex-sm-row">
          <div class="d-flex align-items-center">
            <a class="wk-footer-icon mr-2" href="https://welkin.app">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 600 600">
                <path
                  fill-rule="evenodd"
                  d="M147.857,481.286c-134.22-31.525-126.2-239.169,46.714-230.143,23.222,3.693,34.047-3.736,35.572-30.857,17.366-128.233,212.338-145.2,232.286,13.285-31.054,100.765-31.3,101.728-42.858,135.858-7.579-23.026-12.821-43.421-15.428-48-11.889-22.667-40.109-11.7-43.714,4.714-5.054,15.048-12.219,34.641-17.143,46.286-2.844-9.429-9.253-31.936-15-50.572-9.772-22.832-47.909-18.133-45,13.714,8.457,29.332,21.579,77.391,35.255,100.357,11.8,19.241,34.955,17.873,45.316,2.929,4.367-4.12,12.532-21.147,18-34.714,5.2,14.294,10.265,26.705,16.714,34.286,16.18,19.961,39.581,11.993,48-9,23.226-53.592,49.582-144.59,63-189.429C503.44,33.8,225.232,11.7,185.143,204-26.61,198.168-60.739,483.168,143.571,528.429c99.593-.018,170.873,0,312.858,0,147.579-36.664,168.5-190.528,93.857-266.572C527.191,238.1,495.815,270.1,516,293.571c46.12,46.4,45.213,154.55-65.143,187.715C315.774,481.3,252.433,481.27,147.857,481.286Z"
                />
              </svg>
            </a>
            <span class="wk-footer-text">© 2021 Welkin</span>
          </div>
          <div class="d-flex align-items-center align-items-sm-end flex-column">
            <span class="wk-footer-text" style="font-size: 0.8rem;">Computer Engineering</span>
            <span class="wk-footer-text" style="font-size: 0.7rem"
              >Mahidol University International College</span
            >
          </div>
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
      loading: true,
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
    getColor(status) {
      if (status == "Behind") return "red";
      else if (status == "Ahead") return "primary";
      else if (status == "On Track") return "green";
      else return "grey";
    },
    async getStudentsDetail() {
      let query = `
              {
                      student (searchInput: { sid: "${this.$route.params.sid}" } , performance:true) {
                            sid
                            program
                            prefix
                            given_name
                            family_name
                            entry_trimester
                            entry_year
                            nick_name
                            avatar_url
                            performance
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
      query = query.replace(/\s+/g, " ").trim();
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.students = res.data.data.student;
          this.entry.year = this.students.entry_year;
          this.entry.tri = this.students.entry_trimester;
          this.curriculums = [...res.data.data.curriculums.curriculums];
          this.loading = false;
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
          process.env.VUE_APP_GRAPHQL_URL,
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
          process.env.VUE_APP_GRAPHQL_URL,
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
<style scoped>
  .wk-std-record-container {
    margin: 0px !important;
    min-height: calc(100vh - 115px);
  }
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
  .v-image.v-responsive {
    border-radius: none;
  }
  .loading-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>
