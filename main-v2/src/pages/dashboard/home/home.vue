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
        <div class="col-md-4 order-1 float-left my-n4 py-10 ">
          <h2>
            Hello,
            <span class="primary--text"
              >{{ this.$currentUser.given_name }} {{ this.$currentUser.family_name }}</span
            >
          </h2>
          <h6 class="grey--text">have a nice day :)</h6>
          <v-divider class="mb-n4"></v-divider>
        </div>
        <div class="col-md-8 order-3 float-right py-2">
          <ShowStudentsTable></ShowStudentsTable>
        </div>
        <div class="col-md-4 order-2 float-left py-2">
          <ShowBatchesSummary></ShowBatchesSummary>
        </div>
        <!-- <div class="col-md-4 order-4 float-left">
          <v-card class="rounded-card pa-5"> </v-card>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import ShowStudentsTable from "./components/show_students_table";
import ShowBatchesSummary from "./components/show_batches_summary";

export default {
  name: "home",
  components: {
    ShowStudentsTable,
    ShowBatchesSummary,
  },
  mounted() {
    console.log(this.$currentUser.given_name);
  },
};
</script>

<style scoped>
.wk-home-container {
  /* min-width: 700px;
  width: 100% !important; */
  margin: 0px !important;
}
.rounded-card {
  border-radius: 20px;
}
</style>
