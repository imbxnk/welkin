<template>
  <div>
    <v-row class="mb-3">
      <v-col cols="6" md="3"
        ><v-card class="performance-card"
          ><div class="overline my-n1 red--text">Behind</div>
          <div class="h3 text-right red--text ">
            <span v-if="loading"
              ><v-progress-circular :size="25" color="red" indeterminate></v-progress-circular
            ></span>
            <span v-else> {{ totalBehind }}</span>
          </div></v-card
        ></v-col
      >
      <v-col cols="6" md="3"
        ><v-card class="performance-card"
          ><div class="overline my-n1 green--text">On Track</div>
          <div class="h3 text-right green--text ">
            <span v-if="loading"
              ><v-progress-circular :size="25" color="green" indeterminate></v-progress-circular
            ></span>
            <span v-else>{{ totalOntrack }}</span>
          </div></v-card
        ></v-col
      >
      <v-col cols="6" md="3"
        ><v-card class="performance-card"
          ><div class="overline my-n1 primary--text">Ahead</div>
          <div class="h3 text-right primary--text ">
            <span v-if="loading"
              ><v-progress-circular :size="25" color="primary" indeterminate></v-progress-circular
            ></span>
            <span v-else> {{ totalAhead }}</span>
          </div></v-card
        ></v-col
      >
      <v-col cols="6" md="3"
        ><v-card class="performance-card"
          ><div class="overline my-n1 grey--text">Others</div>
          <div class="h3 text-right grey--text ">
            <span v-if="loading"
              ><v-progress-circular :size="25" color="green" indeterminate></v-progress-circular
            ></span>
            <span v-else> {{ totalUncal }}</span>
          </div></v-card
        ></v-col
      >
    </v-row>
    <v-card class="pa-3">
      <v-card-title
        >All students
        <v-spacer></v-spacer>
        <v-select
          :items="batchmenu"
          v-model="batchFilterValue"
          label="Batch"
          width="50px"
          class="mr-2 batch-select"
        ></v-select>
        <v-select
          :items="advisorlist"
          v-model="advisorFilterValue"
          label="Advisor"
          class="mr-2"
        ></v-select>
      </v-card-title>
      <v-data-table
        height="528"
        v-if="loading"
        loading
        loading-text="Loading... Please wait"
      ></v-data-table>
      <v-data-table
        v-else
        :headers="headers"
        :items="students"
        mobile-breakpoint="680"
        class="home"
        @click:row="showDialog"
      >
        <template v-slot:[`item.performance`]="{ item }">
          <v-chip small :color="getColor(item.performance)" dark class="d-flex justify-center">
            {{ item.performance }}
          </v-chip>
        </template>
        <template v-slot:[`item.advisor.name`]="{ item }">
          {{ item.advisor ? item.advisor.name : "-" }}
        </template>
        <template v-slot:[`item.records.total_credits`]="{ item }">
          {{ item.records.total_credits }}/{{ getTotalCredit(item.batch) }}
        </template>
      </v-data-table>

      <v-divider></v-divider>
      <ConcernedStd class="ma-3"></ConcernedStd>

      <v-dialog v-model="dialog" max-width="700px">
        <v-card>
          <v-card-title class="overline lighten-2">
            {{ stdDetail.name }}
            <v-spacer></v-spacer>
            <v-icon @click="dialog = false">mdi-close</v-icon>
          </v-card-title>
          <StudentInfo :stdDetail="stdDetail"></StudentInfo>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>
<script>
import StudentInfo from "../../students/components/std_info";
import ConcernedStd from "./show_concerned.vue";
export default {
  name: "students_table",
  components: { StudentInfo, ConcernedStd },
  data() {
    return {
      loading: true,
      dialog: false,
      click: 0,
      deley: 700,
      timer: null,
      advisorFilterValue: null,
      batchFilterValue: null,
      batchmenu: ["All"],
      totalBehind: 0,
      totalOntrack: 0,
      totalAhead: 0,
      totalUncal: 0,
      headers: [
        { text: "Student ID", sortable: false, filter: this.batchFilter, value: "sid" },
        { text: "Name", align: "start", sortable: false, value: "name" },
        {
          text: "Advisor",
          sortable: false,
          filter: this.advisorFilter,
          value: "advisor.name",
          align: "center",
        },
        {
          text: "Earned Credits",
          sortable: false,
          value: "records.total_credits",
          align: "center",
        },
        { text: "Performance", sortable: false, value: "performance", align: "center", width: 150 },
      ],
      students: [],
      stdDetail: [],
      advisorlist: ["All"],
    };
  },
  mounted() {
    this.getStudents();
    this.loadAdvisors();
  },
  methods: {
    getColor(status) {
      if (status == "Behind") return "red";
      else if (status == "Ahead") return "primary";
      else if (status == "On Track") return "green";
      else return "grey";
    },
    showDialog(row) {
      this.click++;
      if (this.click == 1) {
        setTimeout(() => (this.click = 0), this.deley);
      } else {
        clearTimeout(this.timer);
        this.dialog = true;
        this.stdDetail = row;
        this.click = 0;
      }
    },
    async loadAdvisors() {
      let query = `
            {
              instructors {
                total
                instructors {
                  name
                  title
                  given_name
                  family_name
                }
              }
            }
          `;
      query = query.replace(/\s+/g, " ").trim();
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          res.data.data.instructors.instructors.forEach((instructor) => {
            this.advisorlist.push(instructor.name);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    advisorFilter(value) {
      if (this.advisorFilterValue == null || this.advisorFilterValue == "All") {
        return true;
      }
      return value === this.advisorFilterValue;
    },
    batchFilter(value) {
      if (this.batchFilterValue == null || this.batchFilterValue == "All") {
        return true;
      }
      return value.substring(0, 2) === this.batchFilterValue;
    },
    async getStudents() {
      let query = `
              {
                students ( searchInput: { batch: ${JSON.stringify(
                  this.$config.selectedBatches
                )} }, sortBy: "performance", performance:true) {
                  students {
                    sid
                    batch
                    given_name
                    family_name
                    email
                    phone
                    lineID
                    performance
                    trimester_count
                    avatar_url
                    advisor { name }
                    status { current }
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
              }
          `;
      query = query.replace(/\s+/g, " ").trim();
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          // console.log(res.data.data.students);
          this.students = [...res.data.data.students.students];
          this.curriculums = [...res.data.data.curriculums.curriculums];
          this.students.forEach((student) => {
            student["name"] = [student.given_name, student.family_name].join(" ");
          });
          this.$config.selectedBatches.forEach((batch) => {
            this.batchmenu.push(batch);
          });
          for (const i in this.students) {
            if (this.students[i].performance == "Behind") {
              this.totalBehind += 1;
            }
            if (this.students[i].performance == "Ahead") {
              this.totalAhead += 1;
            }
            if (this.students[i].performance == "On Track") {
              this.totalOntrack += 1;
            }
            if (
              this.students[i].performance == "Uncalculated" ||
              this.students[i].performance == "Unknown"
            ) {
              this.totalUncal += 1;
            }
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
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
<style lang="scss" scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
.v-select {
  max-width: 280px;
}
.batch-select {
  max-width: 80px;
}
.performance-card {
  padding: 10px;
}
</style>
