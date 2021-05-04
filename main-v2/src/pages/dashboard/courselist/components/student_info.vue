<template>
  <!-- *not responsive* -->
  <div>
    <v-card-title>
      <!-- {{ class_detail.year }}T{{ class_detail.trimester }} Section{{ class_detail.section }} -->
      {{ class_detail.year }}T{{ class_detail.trimester }} SEC{{ class_detail.section }}
    </v-card-title>
    <v-card>
      <v-data-table v-if="loading" loading loading-text="Loading... Please wait"></v-data-table>
      <v-data-table
        v-else
        :headers="headers"
        :items="class_detail.enrollments"
        mobile-breakpoint="680"
        class="home"
        hide-default-footer
        disable-pagination
      ></v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "students_table",
  components: {},
  props: ["classID"],
  created() {
    this.loadStudent(this.$props.classID);
  },
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
      this.loadStudent(current);
    },
  },
  methods: {
    loadStudent(class_id) {
      let query = `
                    query {
                      class(classId: "${class_id}") {
                         _id
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
          console.log(this.class_detail._id);
          console.log(this.class_detail.enrollments[0].student.name);
          this.loading = false;
        })
        .catch((err) => {});
    },
  },
};
</script>
