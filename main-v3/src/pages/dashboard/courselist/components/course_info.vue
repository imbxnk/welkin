<template>
  <div class="wk-detail">
    <div v-if="loading" class="loading-center  ">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      <br />

      <p class="ml-n4 primary--text">Please wait..</p>
    </div>
    <!-- <a  @click="$router.push('/class_history')">class history</a> -->
    <div v-else>
      <div class="float-right overline primary--text">
        <a @click="$router.push(`/course/${code.toLowerCase()}`)">Course History</a>
      </div>
      <div class="overline my-n1">{{ code }} : {{ course.name }}</div>

      <div v-if="course.description !== 'No description'">
        <v-card elevation="0" class="pa-3 mt-2 description">
          <span class="caption"
            ><span class="primary--text">Course Description:</span> <br />{{
              course.description
            }}</span
          ></v-card
        >
      </div>
      <v-divider></v-divider>
      <remainChart :batch="b" :total="tt" :passed="p"></remainChart>
      <!-- <table style="width:100%;">
        <tr>
          <th class="text-left">Year:</th>
          <th v-for="batch in Object.keys(batches)" :key="batch">{{ batch }}</th>
        </tr>
        <tr>
          <th class="text-left">Remain students:</th>
          <td v-for="batch in Object.keys(batches)" :key="batch">
            {{ batches[batch].total - batches[batch].passed }}/{{ batches[batch].total }}
          </td>
        </tr>
      </table> -->

      <v-divider></v-divider>
      <h6 class="primary--text ">Instructor list:</h6>
      <ul>
        <li v-for="(instuctor, i) in instuctors" :key="i">
          {{ instuctor.title }} {{ instuctor.name }}
        </li>
      </ul>
      <!-- <div v-for="batch in Object.keys(batches)" :key="batch">
        Remain [{{ batch }}]: {{ batches[batch].total - batches[batch].passed }}/{{
          batches[batch].total
        }}
        students
      </div> -->
      <v-divider></v-divider>
    </div>
  </div>
</template>
<script>
import remainChart from "./remainChart";
export default {
  name: "Class_info",
  props: ["code"],
  components: { remainChart },
  created() {
    this.loadCourse(this.$props.code);
  },
  data() {
    return {
      loading: true,
      course: {},
      batches: {},
      queryBatches: this.$config.selectedBatches,
      b: [],
      tt: [],
      p: [],
      instuctors: [],
    };
  },
  watch: {
    code: function(current) {
      this.loadCourse(current);
    },
  },
  methods: {
    loadCourse(code) {
      // ALGORITHM TO CREATE QUERY
      this.loading = true;
      this.b = [];
      this.tt = [];
      this.p = [];

      var queryStr = `
                courseInstructors(course_code:"${code}"){
                            total
                            instructors{
                              title
                              name
                              }
                            }
                course (searchInput: { code: "${code}" }) {
                        _id
                        name
                        category
                        description
                        credit_description {
                        lab
                        lecture
                        self_study
                        }
                        credit
                    }
            `;
      this.queryBatches.forEach((batch) => {
        queryStr += `batch${batch}:countStudent(course_code: "${code}", batch: "${batch}") { total }
                            total${batch}:students (searchInput: { batch : "${batch}"}) { total }
                            `;
      });
      let query = `
                query {
                    ${queryStr}
                }
            `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.instuctors = res.data.data.courseInstructors.instructors;
          this.course = res.data.data.course;
          delete res.data.data.course;
          var result = { ...res.data.data };
          for (const i in result) {
            if (i.startsWith("batch"))
              this.batches[i.replace(/\D/g, "")] = {
                ...this.batches[i.replace(/\D/g, "")],
                passed: result[i].total,
              };
            else if (i.startsWith("total"))
              this.batches[i.replace(/\D/g, "")] = {
                ...this.batches[i.replace(/\D/g, "")],
                total: result[i].total,
              };
          }
          var rm = 0;
          for (var i in this.batches) {
            this.b.push(i);
            rm = this.batches[i].total - this.batches[i].passed;
            this.tt.push(rm);
            // this.tt.push(rm);
            this.p.push(this.batches[i].passed);
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
table,
th,
tr,
td {
  border: 1px solid rgba(139, 139, 139, 0.2);
  padding: 5px;
}
.loading-center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.description {
  background: #f7f7f8;
}
</style>
