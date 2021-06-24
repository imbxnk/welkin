<template>
  <div id="app">
    <a @click="$router.back()" class="overline my-n1 back primary--text"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrow-left"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
        />
      </svg>
      BACK</a
    >
    <v-card class=" pa-3" style="overflow: auto;">
      <v-card-title>Overall Student Registration</v-card-title>
      <div class="px-4" v-if="loading">
        Loading... ฝากแก้ด้วย เป็นแท่งยาว ๆ ก็ได้
      </div>
      <table class="table table-hover wk-overall-table" v-else>
        <tr>
          <th rowspan="2" align="center" style="text-align: center !important; vertical-align: bottom">Type</th>
          <th rowspan="2" align="center" style="text-align: center !important; vertical-align: bottom">Code</th>
          <th rowspan="2" align="center" style="vertical-align: bottom">Course Name</th>
          <th :colspan="this.$config.selectedBatches.length" align="center">Remain Student</th>
        </tr>
        <tr>
          <th style="text-align: center !important;" v-for="(batch, i) in $config.selectedBatches" :key="i">{{ batch }}</th>
        </tr>
        <template v-for="(course, i) in courses">
          <tr :key="i" :class="{darken: i%2 == 0}">
            <td align="center">{{ course.category }}</td>
            <td align="center"><router-link style="text-decoration: none; color:inherit" target="_blank" :to="{ name: 'course_detail', params: { code: course.code.toLowerCase() }}">{{ course.code }}</router-link></td>
            <td><router-link style="text-decoration: none; color:inherit" target="_blank" :to="{ name: 'course_detail', params: { code: course.code.toLowerCase() }}">{{ course.name }}</router-link></td>
            <template v-for="j in $config.selectedBatches">
              <td align="center" :key="j">{{ getRemainOfBatch(j, course) }}</td>
            </template>
          </tr>
        </template>
      </table>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "course_overall",
  props: [],
  components: {},
  created() {},
  data() {
    return {
      courses: [],
      loading: true,
      curriculums: []
    };
  },
  mounted() {
    this.getClasses();
  },
  methods: {
    getClasses() {
      let query = `
                {
                  courseOverall(batches: ${JSON.stringify(this.$config.selectedBatches)}) {
                    total
                    courses {
                      name
                      code
                      category
                      students {
                        batch
                      }
                      unregistered {
                        batch
                      }
                    }
                  }
                  curriculums {
                    total
                    curriculums {
                      batches
                      courses {
                        core_courses {
                          code
                        }
                        required_courses {
                          code
                        }
                        elective_courses {
                          code
                        }
                      }
                    }
                  }
                }
          `;
      query = query.replace(/\s+/g, " ").trim();

      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.courses = [...res.data.data.courseOverall.courses];
          this.courses.forEach((course) => {
            // course.category = course.category.join(", ");
            course.category = course.category
              .join(", ")
              .replace("core_course", "C")
              .replace("required_courses", "R")
              .replace("elective_courses", "E");
          });
          this.curriculums = [...res.data.data.curriculums.curriculums]
          this.loading = false
        })
        .catch((err) => {
          console.log(err);
          this.loading = false
        });
    },
    getRemainOfBatch(batch, course) {
      let check = false
      this.curriculums.forEach((curriculum) => {
        console.log(curriculum)
        let courses = [...curriculum.courses.core_courses, ...curriculum.courses.required_courses, ...curriculum.courses.elective_courses]
        if(curriculum.batches.includes(batch) && courses.filter(c => c.code === course.code).length > 0) return check = true
      })
      if(check) return course.unregistered.filter((e) => e.batch === batch).length
      return "-"
    }
  },
};
</script>
<style scoped>
/* .card-height {
  height: calc(var(--app-height) - 85px);
} */

.wk-overall-table tr:not(:nth-child(2)) th:first-child {
  width: 100px;
}

.wk-overall-table tr:not(:nth-child(2)) th:nth-child(2) {
  width: 100px;
}

.wk-overall-table tr:not(:first-child):not(:nth-child(2)):hover {
  background: rgba(100,100,100,0.1);
}

.darken {
  background: rgba(100,100,100,0.03);
}
</style>
