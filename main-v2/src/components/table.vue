<template>
  <v-data-table :headers="headers" :items="student" mobile-breakpoint="0">
    <template v-slot:[`item.status`]="{ item }">
      <v-chip :color="getColor(item.status)" dark class="d-flex justify-center">
        {{ item.status }}
      </v-chip>
    </template>
    <template v-slot:[`item.completion`]="{ item }"> {{ item.completion }} % </template>
  </v-data-table>
</template>
<script>
export default {
  name: "students_table",
  components: {},
  data() {
    return {
      headers: [
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Student ID", sortable: false, value: "stdID" },
        { text: "Advisor", sortable: false, value: "avs", align: "center" },
        { text: "% Lesson Completion", sortable: false, value: "completion", align: "center" },
        { text: "Status", sortable: false, value: "status", align: "center" },
      ],
      student: [
        {
          name: "Kanin Sirisuksakulchai",
          stdID: 6080718,
          avs: "Mingmanas",
          completion: 87,
          status: "On track",
        },
        {
          name: "Phattharaporn Roekduangchan",
          stdID: 6080727,
          avs: "Mingmanas",
          completion: 70,
          status: "On track",
        },
        {
          name: "Phongchai Pongchaloem",
          stdID: 6080728,
          avs: "Mingmanas",
          completion: 91,
          status: "Ahead",
        },
        {
          name: "Santhisa Chen",
          stdID: 6080779,
          avs: "Mingmanas",
          completion: 60,
          status: "Behind",
        },
      ],
    };
  },
  methods: {
    getColor(status) {
      if (status == "Behind") return "red";
      else if (status == "On track") return "orange";
      else return "green";
    },
  },
};
</script>
<style lang=""></style>
