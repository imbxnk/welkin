<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <div class="d-flex flex-row justify-content-end bd-highlight">
          <div class="p-2 bd-highlight">
            <v-btn color="primary" >Upload Course<v-icon>mdi-plus</v-icon></v-btn>
          </div>
          <div class="p-2 bd-highlight">
            <v-btn color="primary" @click="classDialog = true">Upload Grade<v-icon>mdi-plus</v-icon></v-btn>
          </div>
        </div>
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto"
          ><v-card-title>
            <div class="d-flex flex-column">
              <span>Courses</span>
              <span style="font-size:0.8rem; color:#999; margin-top: -10px;">Total: {{}}</span>
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
    <v-dialog class="upload-Dialog" v-model="classDialog" max-width="1000px" width="600px" min-height="500px">
      <v-card>
        <v-card-title class="card-title"
          >Upload Grade
          <v-spacer></v-spacer>
          <v-icon @click="classDialog = false">mdi-close</v-icon></v-card-title
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
      classDialog: false,
      search: "",
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style>
  .card-title{
    background: #97b8f0;
    color: white;
  }
</style>
