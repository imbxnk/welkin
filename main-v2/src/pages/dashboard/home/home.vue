<template>
  <v-main>
    <v-row>
      <v-col>
        <ShowStudentsTable></ShowStudentsTable>
      </v-col>
      <v-col cols="12" sm="6" md="3" lg="3">
        <ShowBatchesSummary></ShowBatchesSummary>
      </v-col>
    </v-row>
  </v-main>
</template>
<script>
import ShowStudentsTable from "./components/show_students_table";
import ShowBatchesSummary from "./components/show_batches_summary";

export default {
  name: "dashboard",
  components: {
    ShowStudentsTable,
    ShowBatchesSummary,
  },
};
</script>
