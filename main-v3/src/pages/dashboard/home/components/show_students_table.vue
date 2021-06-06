<template>
  <v-card class="pa-3">
    <v-card-title>All students</v-card-title>
    <v-data-table v-if="loading" loading loading-text="Loading... Please wait"></v-data-table>
    <v-data-table
      v-else
      :headers="headers"
      :items="students"
      mobile-breakpoint="680"
      height="528"
      class="home"
      @click:row="showDialog"
    >
      <!-- <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getColor(item.status)" dark class="d-flex justify-center">
          {{ item.status }}
        </v-chip>
      </template> -->
      <template v-slot:[`item.advisor.name`]="{ item }">
        {{ item.advisor ? item.advisor.name : "-" }}
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
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
</template>
<script>
import StudentInfo from "../../students/components/std_info";
export default {
  name: "students_table",
  components: { StudentInfo },
  data() {
    return {
      loading: true,
      dialog: false,
      click: 0,
      deley: 700,
      timer: null,
      headers: [
        { text: "Student ID", sortable: false, value: "sid" },
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Advisor", sortable: false, value: "advisor.name", align: "center" },
        {
          text: "Earned Credits",
          sortable: false,
          value: "records.total_credits",
          align: "center",
        },
        { text: "Performance", sortable: false, value: "", align: "center" },
      ],
      students: [],
      stdDetail: [],
    };
  },
  mounted() {
    this.getStudents();
  },
  methods: {
    getColor(status) {
      if (status == "Behind") return "red";
      else if (status == "On track") return "orange";
      else return "green";
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
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          // console.log(res.data.data.students);
          this.students = [...res.data.data.students.students];
          this.curriculums = [...res.data.data.curriculums.curriculums];
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
  },
};
</script>
<style lang="scss" scoped>
.totaltxt {
  color: #3c84fb;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>
