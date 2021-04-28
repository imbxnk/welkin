<template>
  <!-- *not responsive* -->
  <div>
    <!-- <v-row class="">
      <v-col> -->
    <!-- </v-col> -->
    <!-- <v-col cols="6" md="5" lg="4" xl="3">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          type="text"
          class="mr-3"
        ></v-text-field>
      </v-col> -->
    <v-card-title>
      {{ class_detail.year }}T{{ class_detail.trimester }} Section{{ class_detail.section }}
    </v-card-title>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="class_detail.enrollments"
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
  props: [],
  mounted() {
    this.loadClass();
  },
  data() {
    return {
      dialog: false,
      headers: [
        { text: "Student ID", sortable: false, value: "student.sid", width: 90 },
        { text: "Name", align: "start", sortable: false, value: "student.name", width: 200 },
        { text: "Email", sortable: false, value: "student.email", width: 200 },
        { text: "Grade", sortable: false, value: "grade", align: "center", width: 40 },
      ],
      // headers: [
      //   { text: "Student ID", sortable: false, value: "stdID", width: 90 },
      //   { text: "Name", align: "start", sortable: false, value: "name", width: 200 },
      //   { text: "Email", sortable: false, value: "email", width: 200 },
      //   { text: "Grade", sortable: false, value: "grade", align: "center", width: 40 },
      // ],
      // student: [
      //   {
      //     name: "Kanin Sirisuksakulchai",
      //     stdID: 6080718,
      //     email: "kanin@gmail.com",
      //     grade: "A",
      //   },
      //   {
      //     name: "Phattharaporn Roekduangchan",
      //     stdID: 6080727,
      //     email: "Phattharaporn@gmail.com",
      //     grade: "A",
      //   },
      //   {
      //     name: "Phongchai Pongchaloem",
      //     stdID: 6080728,
      //     email: "Phongchai@gmail.com",
      //     grade: "A",
      //   },
      //   {
      //     name: "Santhisa Chen",
      //     stdID: 6080779,
      //     email: "Santhisa@gmail.com",
      //     grade: "A",
      //   },
      // ],
      class_detail: {},
    };
  },
  methods: {
    loadClass() {
      let query = `
                    query {
                      class(classId: "6088429b6c8ef139be53ca89") {
                        course {
                          code
                          name
                          description
                        }
                        instructor {
                          title
                          name
                        }
                        section
                        trimester
                        year
                        enrollments {
                          student {
                            sid
                            given_name
                            family_name
                            email
                          }
                          grade
                        }
                      }
                    }
                `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.class_detail = res.data.data.class;
          this.class_detail.enrollments.forEach((enrollment) => {
            enrollment.student.name =
              enrollment.student.given_name + " " + enrollment.student.family_name;
          });
        })
        .catch((err) => {});
    },
  },
};
</script>
