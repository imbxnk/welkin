<template>
        <v-row class="wk-home-container">
          <v-col cols="12" lg="8" xl="9">
            <ShowStudentsTable></ShowStudentsTable>
          </v-col>
          <!-- <v-col cols="6" lg="4" xl="3"> -->
          <v-col cols="12" md="6" lg="4" xl="3">
            <ShowBatchesSummary></ShowBatchesSummary>
          </v-col>
        </v-row>
</template>
<script>
import ShowStudentsTable from "./components/show_students_table";
import ShowBatchesSummary from "./components/show_batches_summary";

export default {
  name: "home",
  components: {
    ShowStudentsTable,
    ShowBatchesSummary
  },
};
</script>

<style scoped>
.wk-home-container {
  /* min-width: 700px;
  width: 100% !important; */
  margin: 0px !important;
}
</style>