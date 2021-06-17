<template>
  <div class="wk-detail">
    <div v-if="loading" class="loading-center  ">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      <br />

      <p class="ml-n4 primary--text">Please wait..</p>
    </div>
    <div v-else>
      <div class="overline my-n1">{{ curriculum.name }}</div>
      <div class="caption">
        This curriculum is for students with ID {{ curriculum.batches.toString() }} only.
      </div>
      <v-divider style="margin-top: 0.5rem !important"></v-divider>
      <!-- <h6 style="text-align: right;">Total : XX credits</h6> -->
      <!-- core -->
      <h6 class="primary--text mt-2">
        Core Courses
        <span style="float:right;">{{ this.detail.passing_conditions.core_courses }} credits</span>
      </h6>

      <v-list-item v-for="course in detail.core_courses" :key="course.code">
        <v-list-item-content class="mx-n4">
          <v-list-item-title class="d-flex justify-content-between">
            <span style="overflow:hidden; text-overflow: ellipsis">{{ course.code }} : {{ course.name }}</span>
            <span style="float:right; padding-right: 25px;">{{ course.credit }}</span>
          </v-list-item-title>
          <!-- <v-list-item-subtitle>
            {{ course.description == "No description" ? "" : unescapeHtml(course.description) }}
          </v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>

      <!-- required -->
      <h6 class="primary--text mt-4">
        Required Major Courses
        <span style="float:right;"
          >{{ this.detail.passing_conditions.required_courses }} credits</span
        >
      </h6>
      <v-list-item v-for="course in detail.required_courses" :key="course.code">
        <v-list-item-content class="mx-n4">
          <v-list-item-title class="d-flex justify-content-between">
            <span style="overflow:hidden; text-overflow: ellipsis">{{ course.code }} : {{ course.name }}</span>
            <span style="float:right; padding-right: 25px;">
              {{ course.credit }}
            </span>
          </v-list-item-title>
          <!-- <v-list-item-subtitle>{{
            course.description == "No description" ? "" : course.description
          }}</v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>

      <!-- elective -->
      <h6 class="primary--text mt-4">
        Elective Major Courses
        <span style="float:right;"
          >{{ this.detail.passing_conditions.elective_courses }} credits
        </span>
      </h6>
      <v-list-item v-for="course in detail.elective_courses" :key="course.code">
        <v-list-item-content class="mx-n4">
          <v-list-item-title class="d-flex justify-content-between">
            <span style="overflow:hidden; text-overflow: ellipsis">{{ course.code }} : {{ course.name }}</span>
            <span style="float:right; padding-right: 25px;">
              {{ course.credit }}
            </span></v-list-item-title>
          <!-- <v-list-item-subtitle>{{
            course.description == "No description" ? "" : course.description
          }}</v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>
    </div>
  </div>
</template>
<script>
export default {
  name: "Curriculum_Detail",
  props: ["curriculum"],
  component: [],
  created() {
    this.loadCurriculum(this.$props.curriculum._id);
  },
  data() {
    return {
      loading: true,
      detail: {
        core_courses: [],
        required_courses: [],
        elective_courses: [],
        passing_conditions: {
          core_courses: 0,
          required_courses: 0,
          elective_courses: 0,
        },
      },
    };
  },
  watch: {
    curriculum: function(current) {
      this.loadCurriculum(current._id);
    },
  },
  methods: {
    loadCurriculum(id) {
      this.loading = true;
      let query = `
                {
                  curriculum(searchInput: { curriculumId : "${id}"})
                  {
                    courses {
                      core_courses {
                        code
                        name
                        description
                        credit
                      }
                      required_courses {
                        code
                        name
                        description
                        credit
                      }
                      elective_courses {
                        code
                        name
                        description
                        credit
                      }
                    }
                    passing_conditions {
                      core_courses
                      required_courses
                      elective_courses
                    }
                  }
                }
            `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.detail.passing_conditions = res.data.data.curriculum.passing_conditions;
          this.detail.core_courses = res.data.data.curriculum.courses.core_courses
          this.detail.required_courses = res.data.data.curriculum.courses.required_courses
          this.detail.elective_courses = res.data.data.curriculum.courses.elective_courses

          this.loading = false;
        })
        .catch((err) => {});
    },
    unescapeHtml(safe) {
      return safe.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
    }
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

.caption {
  color: #666;
}

.loading-center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
