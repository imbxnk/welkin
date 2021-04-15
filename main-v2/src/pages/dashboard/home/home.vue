<template>
        <v-row>
          <v-col cols="12" lg="8" xl="9">
            <ShowStudentsTable></ShowStudentsTable>
          </v-col>
          <v-col cols="12" lg="4" xl="3">
            <ShowBatchesSummary></ShowBatchesSummary>
          </v-col>
        </v-row>
</template>
<script>
import ShowStudentsTable from "./components/show_students_table";
import ShowBatchesSummary from "./components/show_batches_summary";

export default {
  name: "dashboard",
  components: {
    ShowStudentsTable,
    ShowBatchesSummary
  },
};
</script>
