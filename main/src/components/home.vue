<template>
  <v-row>
    <v-col>
      <Table></Table>
    </v-col>
    <v-col cols="12" sm="6" md="3" lg="3">
      <List></List>
    </v-col>
  </v-row>
</template>
<script>
import List from "./list1";
import Table from "./table1";
export default {
  name: "dashboard",
  components: {
    List,
    Table,
  },
};
</script>
