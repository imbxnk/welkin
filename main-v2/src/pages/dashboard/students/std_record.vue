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
      <div class="col-md-8 order-5 float-right">
        <v-card elevation="0" class="pa-3">
          <span class="overline">Core Courses</span>
          <v-divider></v-divider>
          <div v-for="(course, i) in this.students.taken_courses" :key="i">
            <div v-if="course.class.course.category == 'core_courses'">
              <p>
                {{ course.class.course.name }}
                <span style="float:right;"
                  >{{ course.grade }} / {{ course.class.year }}T{{ course.class.trimester }}</span
                >
              </p>
            </div>
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
                <v-icon small @click="showDialog3(msg._id, msg.message, msg.user.display_name, i)"
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
            <p class="font-weight-bold ">{{ students.given_name }}</p>
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
          <div v-for="(course, i) in this.students.taken_courses" :key="i">
            <div v-if="course.class.course.category == 'required_courses'">
              <p>
                {{ course.class.course.name }}
                <span style="float:right;"
                  >{{ course.grade }} / {{ course.class.year }}T{{ course.class.trimester }}</span
                >
              </p>
            </div>
          </div>
        </v-card>
      </div>
      <div class="col-md-8 order-7 float-right">
        <v-card elevation="0" class="pa-3">
          <span class="overline">Elective Major Courses</span>
          <v-divider></v-divider>

          <div v-for="(course, i) in this.students.taken_courses" :key="i">
            <div v-if="course.class.course.category == 'elective_courses'">
              <p>
                {{ course.class.course.name }}
                <span style="float:right;"
                  >{{ course.grade }} / {{ course.class.year }}T{{ course.class.trimester }}</span
                >
              </p>
            </div>
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
  mounted() {},
  created() {
    this.getStudentsDetail();
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
      students: [],
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
                              _id
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
            headers: {
              Cookies:
                "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDkyMTE1NjVjNzgxMzQ3MGJlOTgxZCIsImlhdCI6MTYxODg0OTA1NSwiZXhwIjoxNjIxNDQxMDU1fQ.OFdqzLZgp6X2OEfhuLt8IBBS9af495aXo1cB9MCsj_M",
            },
          }
        )
        .then((res) => {
          if (res.data.data.addRemark) {
            this.snackbartext = "The remark has been saved";
            this.snackbar = true;
            this.students.remarks.push({
              message: res.data.data.addRemark.message,
              user: { username: this.$currentUser.username },
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
            headers: {
              Cookies:
                "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDkyMTE1NjVjNzgxMzQ3MGJlOTgxZCIsImlhdCI6MTYxODg0OTA1NSwiZXhwIjoxNjIxNDQxMDU1fQ.OFdqzLZgp6X2OEfhuLt8IBBS9af495aXo1cB9MCsj_M",
            },
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
  height: 300px;
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
