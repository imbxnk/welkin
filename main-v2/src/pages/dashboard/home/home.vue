<template>
  <div>
    <!-- <h4>Hello, {{ this.$currentUser.given_name }} {{ this.$currentUser.family_name }}</h4>
    <v-row class="wk-home-container">
      <v-col cols="12" lg="8" xl="9">
        <ShowStudentsTable></ShowStudentsTable>
      </v-col> -->
    <!-- <v-col cols="6" lg="4" xl="3"> -->
    <!-- <v-col cols="12" md="6" lg="4" xl="3">
        <ShowBatchesSummary></ShowBatchesSummary>
      </v-col>
    </v-row> -->
    <div class="py-5 wk-home-container">
      <div class="row d-md-block">
        <div class="col-md-4 order-1 float-left my-n4 py-10 wk-welcome">
          <h3>
            Hello,
            <span class="primary--text">{{
              this.$currentUser.display_name == ""
                ? this.$currentUser.given_name
                : this.$currentUser.display_name
            }}</span>
          </h3>
          <h6 class="grey--text">have a nice day :)</h6>

          <v-divider class="mb-n4"></v-divider>
        </div>
        <div class="col-md-8 order-2 float-right py-3">
          <ShowAnnouncement></ShowAnnouncement>
        </div>
        <div class="col-md-4 order-3 float-left py-2">
          <ShowBatchesSummary></ShowBatchesSummary>
        </div>

        <div
          v-if="
            this.$currentUser.group == 'coordinator' ||
              this.$currentUser.group == 'program director'
          "
          class="col-md-8 order-3 float-right py-2"
        >
          <ShowStudentsTable></ShowStudentsTable>
        </div>

        <div v-else class="col-md-8 order-3 float-right py-2">
          <ShowStudentGraph></ShowStudentGraph>
        </div>
        <!-- <div class="col-md-8 order-4 float-right py-2"><ShowStudentsTable></ShowStudentsTable></div> -->

        <!-- <div class="row order-4 pt-2">
          <div class="col-md-6 order-1 float-left ">
            <v-card class="rounded-card pa-5"> x</v-card>
          </div>
          <div class="col-md-6 order-2 float-right ">
            <v-card class="rounded-card pa-5"> x</v-card>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import ShowStudentsTable from "./components/show_students_table";
import ShowBatchesSummary from "./components/show_batches_summary";
import ShowStudentGraph from "./components/show_student_graph";
import ShowAnnouncement from "./components/show_announce";

export default {
  name: "home",
  components: {
    ShowStudentsTable,
    ShowBatchesSummary,
    ShowAnnouncement,
    ShowStudentGraph,
  },
  mounted() {
    console.log(this.$currentUser);
  },
};
</script>

<style scoped>
.wk-home-container {
  /* min-width: 700px;
  width: 100% !important; */
  margin: 0px !important;
}

@media (max-width: 1200px) {
  .wk-welcome h3,
  .wk-welcome span {
    font-size: 1.5rem;
  }
}
</style>
