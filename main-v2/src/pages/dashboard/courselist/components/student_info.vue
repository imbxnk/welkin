<template>
  <!-- *not responsive* -->
  <div>
    <v-card-title>
      <!-- {{ class_detail.year }}T{{ class_detail.trimester }} Section{{ class_detail.section }} -->
      {{ stdList.year }}{{ stdList.trimester }}<br />
      {{ stdList._id }}<br />
      {{ text }}
    </v-card-title>
    <v-card>
      <v-data-table v-if="loading" loading loading-text="Loading... Please wait"></v-data-table>
      <v-data-table
        v-else
        :headers="headers"
        :items="students"
        mobile-breakpoint="680"
        class="home"
      ></v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "students_table",
  components: {},
  props: ["classID", "stdList"],

  data() {
    return {
      dialog: false,
      loading: true,
      text: "",
      headers: [
        {
          text: "Student ID",
          sortable: false,
          value: "student.sid",
          width: 90,
        },
        { text: "Name", align: "start", sortable: false, value: "student.name", width: 200 },
        { text: "Grade", sortable: false, value: "grade", align: "center", width: 40 },
      ],
      class_detail: [],
      students: [],
    };
  },
  watch: {
    classID: function(current) {
      this.loadClass(current);
    },
  },
  methods: {
    loadClass(i) {
      if (i.toString() == this.stdList._id) {
        this.text = "class code matches!";
        console.log(this.stdList);
        this.students = this.stdList.enrollments;
        console.log(this.stdList.year + "T" + this.stdList.trimester);
        console.log("1st student must be : " + this.stdList.enrollments[0].student.name);
        this.loading = false;
      } else {
        this.text = "class code is not match!";
        console.log("current id : " + i.toString());
        console.log("this data is for id:" + this.stdList._id);
      }
    },
  },
};
</script>
