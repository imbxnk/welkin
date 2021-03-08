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
  mounted() {
    this.getUserData()
  },
  methods: {
    getUserData: async function () {
      var query = `
        query {
            me {
                username
                given_name
                family_name
                group
            }
        }
      `
      await this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials : true }).then(res => { console.log(res) }).catch( err => { console.log(err) } );
    }
  }
};
</script>
