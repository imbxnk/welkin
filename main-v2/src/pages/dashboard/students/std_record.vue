<template>
  <div>
    <v-btn @click="$router.push('/students/all')">back to course list</v-btn>
    hello this is std rec {{ this.$route.params.sid }}<br />
    {{ this.students.given_name }} {{ this.students.family_name }}
  </div>
</template>
<script>
export default {
  name: "student_record",
  components: {},
  mounted() {},
  created() {
    this.getStudentsDetail();
  },
  data() {
    return {
      students: [],
    };
  },

  methods: {
    getStudentsDetail() {
      let query = `
              query {
                      student (searchInput: { sid: "${this.$route.params.sid}" }) {
                            sid
                            program
                            prefix
                            given_name
                            family_name
                            entry_trimester
                            entry_year
                            nick_name
                            avatar_url
                            email
                            lineID
                            lineUID
                            advisor
                            remarks
                            status{
                                current
                            }
                            taken_courses{ 
                                _id
                                class{
                                    course{
                                    name
                                    credit
                                    category
                                }
                                instructor{
                                    name
                                }
                                trimester
                                year
                                section
                            }
                            student{
                                given_name
                            }
                            grade
                            isGrading
                            }
                        }
                    }
          `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.students = res.data.data.student;

          console.log(this.students);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
