<template>
  <v-data-table :headers="headers" :items="students" mobile-breakpoint="0">
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
  mounted() {
    this.getStudents()
  },
  data() {
    return {
      headers: [
        { text: "Student ID", sortable: false, value: "sid", width: 80},
        { text: "First Name", align: "start", sortable: false, value: "given_name", width: 200},
        { text: "Last Name", align: "start", sortable: false, value: "family_name", width: 200},
        { text: "Email", align: "start", sortable: false, value: "email", width: 200},
        { text: "Phone", align: "start", sortable: false, value: "phone", width: 200},
        // { text: "Advisor", sortable: false, value: "avs", align: "center" },
        // { text: "% Lesson Completion", sortable: false, value: "completion", align: "center" },
        // { text: "Status", sortable: false, value: "status", align: "center" },
      ],
      students: [],
      // student: [
      //   {
      //     name: "Kanin Sirisuksakulchai",
      //     stdID: 6080718,
      //     avs: "Mingmanas",
      //     completion: 87,
      //     status: "On track",
      //   },
      //   {
      //     name: "Phattharaporn Roekduangchan",
      //     stdID: 6080727,
      //     avs: "Mingmanas",
      //     completion: 70,
      //     status: "On track",
      //   },
      //   {
      //     name: "Phongchai Pongchaloem",
      //     stdID: 6080728,
      //     avs: "Mingmanas",
      //     completion: 91,
      //     status: "Ahead",
      //   },
      //   {
      //     name: "Santhisa Chen",
      //     stdID: 6080779,
      //     avs: "Mingmanas",
      //     completion: 60,
      //     status: "Behind",
      //   },
      // ],
    };
  },
  methods: {
    getColor(status) {
      if (status == "Behind") return "red";
      else if (status == "On track") return "orange";
      else return "green";
    },
    async getStudents() {
      let query = `
              query {
                students {
                  students {
                    sid
                    given_name
                    family_name
                    email
                    phone
                    lineID
                  }
                }
              }
          `
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true } )
        .then((res) => {
          this.students = [...res.data.data.students.students];
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>
<style lang=""></style>
