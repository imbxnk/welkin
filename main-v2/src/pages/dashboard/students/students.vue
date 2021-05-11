<template>
  <div>
    <v-card class=" pa-3">
      <v-row>
        <v-col>
          <v-card-title>
            Students
          </v-card-title>
        </v-col>
        <v-col cols="6" md="5" lg="4" xl="3">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            type="text"
            class="mr-3"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-card :elevation="0">
        <!-- if loading -->
        <v-data-table v-if="loading" loading loading-text="Loading... Please wait"></v-data-table>
        <!-- else -->
        <v-data-table
          v-else
          :headers="headers"
          :items="students"
          :search="search"
          mobile-breakpoint="0"
          @click:row="showDialog"
          class="student"
        >
          <template v-slot:[`item.email`]="{ item }">
            {{ item.email == null ? "-" : item.email }}
          </template>
          <template v-slot:[`item.phone`]="{ item }">
            {{ item.phone == null ? "-" : item.phone }}
          </template>
        </v-data-table>
        <!-- dialog -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title class="overline lighten-2">
              {{ stdDetail.name }}
              <v-spacer></v-spacer>
              <v-icon @click="dialog = false">mdi-close</v-icon>
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" sm="5">
                  <!-- <v-progress-circular
                  :width="3"
                  class="loading-center  "
                  color="primary"
                  indeterminate
                ></v-progress-circular> -->
                  <v-img
                    src="https://semantic-ui.com/images/avatar2/large/matthew.png"
                    contain
                    max-width="180"
                    class="center"
                  />
                  <div class="overline text-center">{{ stdDetail.sid }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <b>Email:</b> <span v-if="stdDetail.email">{{ stdDetail.email }}</span
                  ><span v-else>-</span><br />
                  <template v-if="stdDetail.records">
                    <b>GPA:</b> <span>{{ stdDetail.records.egci_cumulative_gpa }}</span
                    ><br />
                    <b>Core Courses:</b> <span>{{ stdDetail.records.core_credits }}</span
                    ><br />
                    <b>Required Courses:</b> <span>{{ stdDetail.records.major_credits }}</span
                    ><br />
                    <b>Elective Courses:</b> <span>{{ stdDetail.records.elective_credits }}</span
                    ><br />
                  </template>
                  <div class="w-100 d-flex justify-content-center mt-3">
                    <v-btn
                      @click="
                        $router.push({ name: 'student_record', params: { sid: stdDetail.sid } })
                      "
                      rounded
                    >
                      See student record</v-btn
                    >
                  </div>
                </v-col>
              </v-row>
              <v-row class="pb-3">
                <v-card elevation="0" class="remark-card pa-3">
                  <b>Remark(s):</b><span v-if="stdDetail.remarks == ''"> -</span>
                  <span v-else
                    ><ul class="mb-n1">
                      <li v-for="(msg, i) in stdDetail.remarks" :key="i">
                        {{ msg.message }}, [ {{ msg.user.username }} ]
                        <v-icon
                          small
                          @click="showDialog3(msg._id, msg.message, msg.user.username, i)"
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
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- dialog2 *add remark* -->
        <v-dialog v-model="dialog2" max-width="300px">
          <v-card class=" pa-3">
            <v-card-title>
              <v-spacer></v-spacer>
              <v-icon @click="closedialog2()">mdi-close</v-icon>
            </v-card-title>
            <div class="text-center mt-n8">
              <p class="overline primary--text my-n2">Add Remark For</p>
              <p class="font-weight-bold ">{{ stdDetail.name }}</p>
            </div>

            <v-divider class=""></v-divider>
            <v-textarea
              outlined
              :rules="rules"
              counter="50"
              label="Remark"
              v-model="remark"
            ></v-textarea>

            <v-btn
              block
              class="mb-3"
              color="primary"
              :disabled="!remark"
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
      </v-card>
      <v-snackbar centered v-model="snackbar" :timeout="1000">
        {{ snackbartext }}
      </v-snackbar>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "students_table",
  components: {},
  mounted() {
    this.getStudents();
  },
  computed: {
    isDisable() {
      return this.remark.length > 0;
    },
  },
  data() {
    return {
      dialog: false,
      dialog2: false,
      dialog3: false,
      snackbar: false,
      loading: true,
      rules: [(v) => v.length <= 50 || "Max 50 characters"],
      remark: "",
      remarktext: {
        msg: "",
      },
      snackbartext: "",
      delremarkID: "",
      delremarkMsg: "",
      delremarkUser: "",
      delindex: 0,

      search: "",
      headers: [
        { text: "Student ID", sortable: false, value: "sid", width: 80 },
        //{ text: "First Name", align: "start", sortable: false, value: "given_name", width: 200 },
        //{ text: "Last Name", align: "start", sortable: false, value: "family_name", width: 200 },
        { text: "Name", align: "start", sortable: false, value: "name", width: 200 },
        { text: "Email", align: "start", sortable: false, value: "email", width: 200 },
        { text: "Phone", align: "start", sortable: false, value: "phone", width: 200 },
        // { text: "Advisor", sortable: false, value: "avs", align: "center" },
        // { text: "% Lesson Completion", sortable: false, value: "completion", align: "center" },
        { text: "Status", sortable: false, value: "status.current", width: 200 },
      ],
      students: [],
      stdDetail: [],
    };
  },
  methods: {
    getColor(status) {
      if (status == "Behind") return "red";
      else if (status == "On track") return "orange";
      else return "green";
    },
    async getStudents() {
      let query = `
              query {
                students (sortBy: "status") {
                  students {
                    sid
                    given_name
                    family_name
                    email
                    phone
                    lineID
                    status {
                      current
                    }
                    remarks {
                      message
                      user {
                        username
                      }
                      _id
                    }
                    records {
                      egci_cumulative_gpa
                      core_credits
                      major_credits
                      elective_credits
                    }
                  }
                }
              }
          `;
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res.data.data.students);
          this.students = [...res.data.data.students.students];
          this.students.forEach((student) => {
            student["name"] = [student.given_name, student.family_name].join(" ");
          });
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showDialog(row) {
      this.dialog = true;
      console.log(row);
      this.stdDetail = row;
      console.log(this.stdDetail);
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
                    studentId: "${this.stdDetail.sid}",
                    message: "${val.msg}"
                  }) {
                    _id
                    message
                  }
                }
              `;
      console.log(this.stdDetail.sid);
      console.log(val.msg);
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
            this.stdDetail.remarks.push({
              message: res.data.data.addRemark.message,
              user: { username: this.$currentUser.username },
              _id: res.data.data.addRemark._id,
            });
            this.dialog2 = false;
            this.remark = "";
          }
          console.log(res);
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
            this.stdDetail.remarks.splice(this.delindex);
          }
          this.dialog3 = false;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
.loading-center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.remark-card {
  width: 100%;
  background: #f7f7f8;
  color: #000;
}
</style>
