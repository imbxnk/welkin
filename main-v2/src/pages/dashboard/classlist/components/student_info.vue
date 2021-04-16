<template>
  <!-- *not responsive* -->
  <div>
    <v-row class="">
      <v-col>
        <v-card-title>
          2019-2020T1
        </v-card-title>
      </v-col>
      <!-- <v-col cols="6" md="5" lg="4" xl="3">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          type="text"
          class="mr-3"
        ></v-text-field>
      </v-col> -->
    </v-row>
    <v-card>
      <v-data-table :headers="headers" :items="student" mobile-breakpoint="680" class="home">
      </v-data-table
    ></v-card>
  </div>
</template>

<script>
export default {
  name: "students_table",
  components: {},
  data() {
    return {
      dialog: false,
      headers: [
        { text: "Student ID", sortable: false, value: "stdID", width: 90 },
        { text: "Name", align: "start", sortable: false, value: "name", width: 200 },
        { text: "Email", sortable: false, value: "email", width: 200 },
        { text: "Grade", sortable: false, value: "grade", align: "center", width: 40 },
      ],
      student: [
        {
          name: "Kanin Sirisuksakulchai",
          stdID: 6080718,
          email: "kanin@gmail.com",
          grade: "A",
        },
        {
          name: "Phattharaporn Roekduangchan",
          stdID: 6080727,
          email: "Phattharaporn@gmail.com",
          grade: "A",
        },
        {
          name: "Phongchai Pongchaloem",
          stdID: 6080728,
          email: "Phongchai@gmail.com",
          grade: "A",
        },
        {
          name: "Santhisa Chen",
          stdID: 6080779,
          email: "Santhisa@gmail.com",
          grade: "A",
        },
      ],
    };
  },
  methods: {},
};
</script>
