<template>
  <div id="app">
    <!-- <div v-if="advisees.length == 0 && !isLoading">You have no advisees</div>
    <div v-else-if="!isLoading">{{ advisees }}</div> -->
    <v-card class=" pa-3">
      <v-row>
        <v-col cols="12" md="4">
          <v-card-title> My Advisees </v-card-title>
        </v-col>
        <v-col cols="12" md="8" class="mt-md-3">
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
            ></v-select> </v-row
        ></v-col>
      </v-row>
      <v-card :elevation="0">
        <!-- if loading -->
        <v-data-table v-if="loading" loading loading-text="Loading... Please wait"></v-data-table>
        <!-- else -->
        <v-data-table
          v-else
          :headers="headers"
          :items="advisees"
          :search="search"
          mobile-breakpoint="0"
          :footer-props="{
            'items-per-page-options': [20, 50, 100, { text: 'All', value: -1 }],
          }"
          @click:row="ShowDetail"
          class="advisee"
        >
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
          <template v-slot:[`item.records.total_credits`]="{ item }">
            {{ item.records.total_credits }}/{{ getTotalCredit(item.batch) }}
          </template>
          <template v-slot:[`item.nick_name`]="{ item }">
            <!-- {{ !!item.nick_name || item.nick_name == " " ? item.nick_name : " - " }} -->
            {{ checkNull(item.nick_name) }}
          </template>
          <template v-slot:[`item.email`]="{ item }">
            <!-- {{ item.email == null ? " - " : item.email }} -->
            {{ checkNull(item.email) }}
          </template>
        </v-data-table>
        <!-- dialog1 show info -->
        <v-dialog v-model="dialog" max-width="700px">
          <v-card>
            <v-card-title class="overline lighten-2">
              {{ avsDetail.name }}
              <v-spacer></v-spacer>
              <v-icon @click="dialog = false">mdi-close</v-icon>
            </v-card-title>
            <StudentInfo :stdDetail="avsDetail"></StudentInfo>
          </v-card>
        </v-dialog>
      </v-card>
    </v-card>
  </div>
</template>
<script>
import StudentInfo from "./components/std_info";
export default {
  name: "advisees_table",
  components: { StudentInfo },
  data() {
    return {
      search: "",
      click: 0,
      deley: 700,
      timer: null,
      loading: true,
      dialog: false,
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
      headers: [
        { text: "Student ID", sortable: false, value: "sid", filter: this.batchFilter, width: 100 },
        { text: "Name", sortable: false, value: "name", width: 350 },
        { text: "Nickname", sortable: false, align: "center", value: "nick_name", width: 100 },
        {
          text: "Earned Credits",
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
        { text: "Email", sortable: false, align: "center", value: "email", width: 250 },
        {
          text: "Status",
          sortable: false,
          filter: this.statusFilter,
          align: "center",
          value: "status.current",
          width: 180,
        },
      ],
      advisees: [],
      avsDetail: [],
    };
  },
  mounted() {
    this.getMyAdvisees();
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
      // 'Studying',
      // 'Leave of absence',
      // 'On Exchange',
      // 'Retired',
      // 'Resigned',
      // 'Alumni'
      // 'Unknown'
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
    getMyAdvisees() {
      let query = `
          query {
            students (searchInput: { advisor: "${this.$currentUser.linked_instructor._id}"}, sortBy: "status") {
              advisees:students {
                sid
                prefix
                given_name
                family_name
                email
                nick_name
                entry_trimester
                entry_year
                avatar_url
                batch
                records{
                  egci_cumulative_gpa
                  core_credits
                  required_credits
                  elective_credits
                  total_credits
                }
                status{
                  current
                }
              }
              total
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
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.advisees = [...res.data.data.students.advisees];
          this.curriculums = [...res.data.data.curriculums.curriculums];
          res.data.data.batches.batches.forEach((batch) => {
            this.batchmenu.push(batch);
          });
          this.advisees.forEach((advisee) => {
            advisee["name"] = [advisee.given_name, advisee.family_name].join(" ");
          });
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    ShowDetail(row) {
      this.click++;
      if (this.click == 1) {
        setTimeout(() => (this.click = 0), this.deley);
      } else {
        clearTimeout(this.timer);
        this.dialog = true;
        this.avsDetail = row;
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
