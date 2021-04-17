<template>
  <div>
    <v-row class="">
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
    <v-card>
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
              </v-col>
              <v-col cols="12" sm="6">
                <b>ID:</b> <span>{{ stdDetail.sid }}</span
                ><br />
                <b>Email:</b> <span v-if="stdDetail.email">{{ stdDetail.email }}</span
                ><span v-else>-</span><br />
                <b>GPA:</b> <span v-if="false">{{}}</span><span v-else>-</span><br />
                <b>Core Courses:</b> <span v-if="false">{{}}</span><span v-else>-</span><br />
                <b>Required Courses:</b> <span v-if="false">{{}}</span><span v-else>-</span><br />
                <b>Elective Courses:</b> <span v-if="false">{{}}</span><span v-else>-</span><br />
                <b>Remark:</b> <span v-if="false">{{}}</span><span v-else>-</span><br />
                <div class="w-100 d-flex justify-content-center mt-3">
                  <v-btn small>See student record</v-btn>
                </div>
              </v-col>
            </v-row>
            <!-- edit remark -->
            <!-- <v-row class="">
              <v-col cols="3" sm="2"> <div class="overline mt-5">edit</div> </v-col
              ><v-col cols="8">
                <v-text-field v-model="firstname" label="Remark" required></v-text-field
              ></v-col>
              <v-col><v-btn x-small color="success" class="mt-5">save</v-btn></v-col>
            </v-row> -->
          </v-card-text>

          <v-card-actions class="mt-n4">
            <v-spacer></v-spacer>
            <v-btn color="green" text @click="dialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
  data() {
    return {
      dialog: false,
      loading: true,

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
        { text: "Status", sortable: false, value: "status", width: 200 },
      ],
      students: [],
      stdDetail: [],
      // student: [
      //   {
      //     name: "Kanin Sirisuksakulchai",
      //     stdID: 6080718,
      //     avs: "Mingmanas",
      //     completion: 87,
      //     status: "On track",
      //   },
      //   {
      //     name: "Phattharaporn Roekduangchan",
      //     stdID: 6080727,
      //     avs: "Mingmanas",
      //     completion: 70,
      //     status: "On track",
      //   },
      //   {
      //     name: "Phongchai Pongchaloem",
      //     stdID: 6080728,
      //     avs: "Mingmanas",
      //     completion: 91,
      //     status: "Ahead",
      //   },
      //   {
      //     name: "Santhisa Chen",
      //     stdID: 6080779,
      //     avs: "Mingmanas",
      //     completion: 60,
      //     status: "Behind",
      //   },
      // ],
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
                students {
                  students {
                    sid
                    given_name
                    family_name
                    email
                    phone
                    lineID
                  }
                }
              }
          `;
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.students = [...res.data.data.students.students];
          this.students.forEach((student) => {
            student["name"] = [student.given_name, student.family_name].join(" ");
            this.loading = false;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showDialog(row) {
      this.dialog = true;
      // console.log(this.student.stdID);
      console.log(row);
      this.stdDetail = row;
      console.log(this.stdDetail);
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
</style>
