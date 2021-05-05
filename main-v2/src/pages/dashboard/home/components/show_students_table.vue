<template>
  <v-card class="rounded-card pa-3">
    <!-- <v-data-table v-if="loading" loading loading-text="Loading... Please wait"></v-data-table> -->
    <v-data-table
      :headers="headers"
      :items="student"
      mobile-breakpoint="680"
      height="528"
      class="home"
      @click:row="showDialog"
    >
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getColor(item.status)" dark class="d-flex justify-center">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:[`item.completion`]="{ item }">
        {{ item.completion }} / {{ item.averageCredit }}
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="overline lighten-2">
          {{ stdDetail.name }}
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-img
                src="https://semantic-ui.com/images/avatar2/large/matthew.png"
                contain
                max-width="250"
                class="center"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <b>ID:</b> <span>{{ stdDetail.stdID }}</span
              ><br />
              <b>Email:</b> <span v-if="stdDetail.email">{{}}</span><span v-else>-</span><br />
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
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
export default {
  name: "students_table",
  components: {},
  data() {
    return {
      loading: true,
      dialog: false,
      headers: [
        { text: "Student ID", sortable: false, value: "stdID" },
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Advisor", sortable: false, value: "avs", align: "center" },
        { text: "Taken Credits", sortable: false, value: "completion", align: "center" },
        { text: "Performance", sortable: false, value: "status", align: "center" },
      ],
      student: [
        {
          name: "Kanin Sirisuksakulchai",
          stdID: 6080718,
          avs: "Mingmanas",
          completion: 150,
          averageCredit: 150,
          status: "On track",
        },
        {
          name: "Phattharaporn Roekduangchan",
          stdID: 6080727,
          avs: "Mingmanas",
          completion: 146,
          averageCredit: 150,
          status: "On track",
        },
        {
          name: "Phongchai Pongchaloem",
          stdID: 6080728,
          avs: "Mingmanas",
          completion: 153,
          averageCredit: 150,
          status: "Ahead",
        },
        {
          name: "Santhisa Chen",
          stdID: 6080779,
          avs: "Mingmanas",
          completion: 102,
          averageCredit: 150,
          status: "Behind",
        },
        {
          name: "Kanin Sirisuksakulchai",
          stdID: 6080718,
          avs: "Mingmanas",
          completion: 150,
          averageCredit: 150,
          status: "On track",
        },
        {
          name: "Phattharaporn Roekduangchan",
          stdID: 6080727,
          avs: "Mingmanas",
          completion: 146,
          averageCredit: 150,
          status: "On track",
        },
        {
          name: "Phongchai Pongchaloem",
          stdID: 6080728,
          avs: "Mingmanas",
          completion: 153,
          averageCredit: 150,
          status: "Ahead",
        },
        {
          name: "Santhisa Chen",
          stdID: 6080779,
          avs: "Mingmanas",
          completion: 102,
          averageCredit: 150,
          status: "Behind",
        },
        {
          name: "Kanin Sirisuksakulchai",
          stdID: 6080718,
          avs: "Mingmanas",
          completion: 150,
          averageCredit: 150,
          status: "On track",
        },
        {
          name: "Phattharaporn Roekduangchan",
          stdID: 6080727,
          avs: "Mingmanas",
          completion: 146,
          averageCredit: 150,
          status: "On track",
        },
        {
          name: "Phongchai Pongchaloem",
          stdID: 6080728,
          avs: "Mingmanas",
          completion: 153,
          averageCredit: 150,
          status: "Ahead",
        },
        {
          name: "Santhisa Chen",
          stdID: 6080779,
          avs: "Mingmanas",
          completion: 102,
          averageCredit: 150,
          status: "Behind",
        },
      ],
      stdDetail: [],
    };
  },
  methods: {
    getColor(status) {
      if (status == "Behind") return "red";
      else if (status == "On track") return "orange";
      else return "green";
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
.rounded-card {
  border-radius: 20px;
}
</style>
