<template>
  <div>
    <v-card class=" pa-3">
      <v-row>
        <v-col cols="12" md="4">
          <v-card-title>
            Students
          </v-card-title>
        </v-col>
        <v-col cols="12" md="8" class=" mt-md-3">
          <v-row class="mx-1">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              type="text"
              class="mr-2"
            ></v-text-field>
            <v-select
              :items="batchmenu"
              v-model="batchFilterValue"
              label="Batch"
              width="50px"
              class="mr-2"
            ></v-select>
            <v-select
              :items="statusmenu"
              v-model="statusFilterValue"
              label="Status"
              class="mr-2"
            ></v-select>
          </v-row>
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
          :footer-props="{
            'items-per-page-options': [20, 50, 100, { text: 'All', value: -1 }],
          }"
          @click:row="showDialog"
          class="student"
        >
          <template v-slot:[`item.records.total_credits`]="{ item }">
            {{ item.records.total_credits }}/{{ getTotalCredit(item.batch) }}
          </template>
          <template v-slot:[`item.status.current`]="{ item }">
            <v-chip
              small
              :color="getColor(item.status.current)"
              :dark="isDark(item.status.current)"
              class="d-flex justify-center"
            >
              {{ item.status.current }}
            </v-chip>
          </template>
          <template v-slot:[`item.advisor.name`]="{ item }">
            {{ item.advisor == null ? " - " : item.advisor.name }}
          </template>
        </v-data-table>
        <!-- dialog1 show info -->
        <v-dialog v-model="dialog" max-width="700px">
          <div v-if="status">
            <v-card>
              <v-card-title class="overline lighten-2">
                {{ stdDetail.name }}
                <v-spacer></v-spacer>
                <v-icon @click="dialog = false">mdi-close</v-icon>
              </v-card-title>
              <StudentInfo :stdDetail="stdDetail"></StudentInfo>
            </v-card>
          </div>
        </v-dialog>
      </v-card>
    </v-card>
  </div>
</template>
<script>
import StudentInfo from "./components/std_info";
export default {
  name: "students_table",
  components: { StudentInfo },
  mounted() {
    this.getStudents();
  },
  data() {
    return {
      dialog: false,
      status: false,
      click: 0,
      deley: 700,
      timer: null,
      loading: true,
      curriculums: [],
      statusFilterValue: null,
      batchFilterValue: null,
      batchmenu: ["All"],
      statusmenu: [
        "All",
        "Studying",
        "Leave of absence",
        "On Exchange",
        "Retired",
        "Resigned",
        "Alumni",
        "Unknown",
      ],
      search: "",
      headers: [
        { text: "Student ID", sortable: false, value: "sid", filter: this.batchFilter, width: 80 },
        { text: "Name", align: "start", sortable: false, value: "name", width: 380 },
        // { text: "Email", align: "start", sortable: false, value: "email", width: 200 },
        // { text: "Phone", align: "start", sortable: false, value: "phone", width: 200 },
        {
          text: "Earned Credits ",
          align: "center",
          sortable: true,
          value: "records.total_credits",
          width: 150,
        },
        {
          text: "EGCI CUM-GPA",
          align: "center",
          sortable: true,
          value: "records.egci_cumulative_gpa",
          width: 150,
        },
        {
          text: "Advisor",
          align: "center",
          sortable: true,
          value: "advisor.name",
          width: 350,
        },
        // { text: "Advisor", sortable: false, value: "avs", align: "center" },
        {
          text: "Status",
          sortable: false,
          filter: this.statusFilter,
          align: "center",
          value: "status.current",
          width: 180,
        },
      ],
      students: [],
      stdDetail: [],
    };
  },
  methods: {
    statusFilter(value) {
      if (this.statusFilterValue == null || this.statusFilterValue == "All") {
        return true;
      }
      return value === this.statusFilterValue;
    },
    batchFilter(value) {
      if (this.batchFilterValue == null || this.batchFilterValue == "All") {
        return true;
      }
      return value.substring(0, 2) === this.batchFilterValue;
    },
    getColor(status) {
      if (status == "Studying") return "green";
      else if (status == "Leave of absence") return "amber";
      else if (status == "On Exchange") return "blue";
      // else if (status == "Retired") return "grey";
      else if (status == "Resigned") return "grey";
      else if (status == "Alumni") return "grey lighten-2";
      else if (status == "Unknown") return "grey";
      else return "red";
    },
    isDark(status) {
      if (status == "Alumni") {
        return false;
      } else {
        return true;
      }
    },
    async getStudents() {
      let query = `
              query {
                students (sortBy: "status") {
                  students {
                    sid
                    batch
                    given_name
                    family_name
                    email
                    phone
                    lineID
                    avatar_url
                    advisor {
                              name
                            }
                    status {
                      current
                    }
                    records {
                      egci_cumulative_gpa
                      total_credits
                      core_credits
                      required_credits
                      elective_credits
                    }
                  }
                }
                curriculums {
                    total
                    curriculums {
                      batches
                      passing_conditions {
                        core_courses
                        required_courses
                        elective_courses
                      }
                    }
                  }
                batches {
                  total
                  batches
                }
              }
          `;
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          // console.log(res.data.data.students);
          this.students = [...res.data.data.students.students];
          this.curriculums = [...res.data.data.curriculums.curriculums];

          console.log(this.batchmenu);
          res.data.data.batches.batches.forEach((batch) => {
            this.batchmenu.push(batch);
          });
          this.students.forEach((student) => {
            student["name"] = [student.given_name, student.family_name].join(" ");
          });

          console.log(this.students);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // @click:row="showDialog"
    showDialog(row) {
      this.click++;
      if (this.click == 1) {
        setTimeout(() => (this.click = 0), this.deley);
      } else {
        clearTimeout(this.timer);
        this.dialog = true;
        this.status = true;
        this.stdDetail = row;
        this.click = 0;
      }
    },
    getTotalCredit(batch) {
      let total_credits = "?";
      this.curriculums.forEach((curriculum) => {
        if (curriculum.batches.includes(batch))
          return (total_credits =
            curriculum.passing_conditions.core_courses +
            curriculum.passing_conditions.required_courses +
            curriculum.passing_conditions.elective_courses);
      });
      return total_credits;
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
