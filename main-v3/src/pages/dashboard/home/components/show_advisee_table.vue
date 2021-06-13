<template>
  <v-card class="pa-3">
    <v-card-title
      >Advisees
      <v-spacer></v-spacer>
      <v-select :items="batchlist" v-model="batchFilterValue" label="Batch" class="mr-2"></v-select>
    </v-card-title>
    <v-data-table
      v-if="loading"
      height="528"
      loading
      loading-text="Loading... Please wait"
    ></v-data-table>
    <v-data-table
      v-else
      :headers="headers"
      :items="advisees"
      mobile-breakpoint="680"
      height="528"
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
    </v-data-table>

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
      batchFilterValue: null,
      headers: [
        { text: "Student ID", sortable: false, filter: this.batchFilter, value: "sid" },
        { text: "Name", align: "start", sortable: false, value: "name" },

        {
          text: "Earned Credits",
          sortable: false,
          value: "records.total_credits",
          align: "center",
        },
        { text: "Performance", sortable: false, value: "performance", align: "center", width: 150 },
      ],
      advisees: [],
      stdDetail: [],
      batchlist: ["All"],
    };
  },
  mounted() {
    this.getMyAdvisees();
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
    getMyAdvisees() {
      let query = `
          {
            students (searchInput: { advisor: "${this.$currentUser.linked_instructor._id}"}, sortBy: "status", performance:true) {
              advisees:students {
                sid
                prefix
                given_name
                family_name
                email
                nick_name
                performance
                trimester_count
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
            batches {
                  total
                  batches
                }
          }
      `;
      query = query.replace(/\s+/g, " ").trim();
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.loading = false;
          this.advisees = res.data.data.students.advisees;
          this.advisees.forEach((advisee) => {
            advisee["name"] = [advisee.given_name, advisee.family_name].join(" ");
          });
          res.data.data.batches.batches.forEach((batch) => {
            this.batchlist.push(batch);
          });
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    batchFilter(value) {
      if (this.batchFilterValue == null || this.batchFilterValue == "All") {
        return true;
      }
      return value.substring(0, 2) === this.batchFilterValue;
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
.v-select {
  max-width: 270px;
}
</style>
