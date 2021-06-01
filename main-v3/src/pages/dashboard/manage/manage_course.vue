<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <v-btn color="primary" @click="dialog = true">Upload Grade<v-icon>mdi-plus</v-icon></v-btn>
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto"
          ><v-card-title>
            <div class="d-flex flex-column">
              <span>Courses</span>
              <span style="font-size:0.8rem; color:#999; margin-top: -10px;">Total: {{ total }}</span>
            </div>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              type="text"
              class="mx-3"
            ></v-text-field
          ></v-card-title>
        </v-card>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title
          >Upload Grade
          <v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon></v-card-title
        >
        <AddGrade></AddGrade>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AddGrade from "./components/add_grade";
export default {
  components: { AddGrade },
  data() {
    return {
      dialog: false,
      search: "",
      total: 0,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style></style>
