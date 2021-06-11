<template>
  <v-card-text>
    <v-row>
      <v-col cols="12" sm="5">
        <!-- <v-progress-circular
                  :width="3"
                  class="loading-center  "
                  color="primary"
                  indeterminate
                ></v-progress-circular> -->
        <v-img
          :src="stdDetail.avatar_url || $config.defaultAvatar"
          contain
          max-width="230"
          class="center"
        />
        <div class="overline text-center">{{ stdDetail.sid }}</div>
      </v-col>

      <v-col cols="12" sm="6">
        <b>Email:</b> <span v-if="stdDetail.email">{{ checkNull(stdDetail.email) }}</span
        ><span v-else>-</span><br />
        <template v-if="stdDetail.records">
          <b>GPA:</b> <span>{{ stdDetail.records.egci_cumulative_gpa }}</span
          ><br />
          <b>Core Courses:</b>
          <span>
            {{ stdDetail.records.core_credits }}/{{ getPassingCore(stdDetail.batch) }} Credits</span
          ><br />
          <b>Required Courses:</b>
          <span>
            {{ stdDetail.records.required_credits }}/{{
              getPassingRequire(stdDetail.batch)
            }}
            Credits</span
          ><br />
          <b>Elective Courses:</b>
          <span>
            {{ stdDetail.records.elective_credits }}/{{
              getPassingElective(stdDetail.batch)
            }}
            Credits</span
          ><br />
          <b>Credits Earned:</b>
          <span>
            {{ stdDetail.records.total_credits }}/{{
              getTotalCredit(stdDetail.batch)
            }}
            Credits</span
          ><br />
        </template>
        <div class="w-100 d-flex justify-content-end align-self-end mt-sm-16 mt-md-16 ml-md-6 ">
          <a
            @click="$router.push({ name: 'student_record', params: { sid: stdDetail.sid } })"
            class="primary--text"
            ><b>... See More >></b></a
          >
        </div>
      </v-col>
    </v-row>
    <v-row class="pb-3">
      <StudentRemark :sid="stdDetail.sid" :name="stdDetail.name"></StudentRemark>
    </v-row>
  </v-card-text>
</template>
<script>
import StudentRemark from "./std_remark";
export default {
  name: "Student_Info",
  props: ["stdDetail"],
  components: { StudentRemark },
  mounted() {
    this.getCurriculum();
  },
  data() {
    return {
      curriculums: [],
      passing_core: "",
      passing_required: "",
      passing_elective: "",
      current_batch: "",
    };
  },

  methods: {
    checkNull(item) {
      if (item == " ") {
        return " - ";
      } else if (item == "null") {
        return " - ";
      } else if (!item) {
        return " - ";
      } else {
        return item;
      }
    },
    getCurriculum() {
      let query = `
            {
               curriculums {
                    total
                    curriculums {
                      batches
                      passing_conditions {
                        core_courses
                        required_courses
                        elective_courses
                      }
                    }
                }
            }
      `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          // console.log(res.data.data.students);
          this.curriculums = [...res.data.data.curriculums.curriculums];
          console.log(this.curriculums);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPassingCore(batch) {
      let core_credits = "?";
      this.curriculums.forEach((curriculum) => {
        if (curriculum.batches.includes(batch))
          return (core_credits = curriculum.passing_conditions.core_courses);
      });
      return core_credits;
    },
    getPassingRequire(batch) {
      let required_credits = "?";
      this.curriculums.forEach((curriculum) => {
        if (curriculum.batches.includes(batch))
          return (required_credits = curriculum.passing_conditions.required_courses);
      });
      return required_credits;
    },
    getPassingElective(batch) {
      let elective_credits = "?";
      this.curriculums.forEach((curriculum) => {
        if (curriculum.batches.includes(batch))
          return (elective_credits = curriculum.passing_conditions.elective_courses);
      });
      return elective_credits;
    },
    getTotalCredit(batch) {
      let total_credits = "?";
      this.curriculums.forEach((curriculum) => {
        if (curriculum.batches.includes(batch))
          return (total_credits =
            curriculum.passing_conditions.core_courses +
            curriculum.passing_conditions.required_courses +
            curriculum.passing_conditions.elective_courses);
      });
      return total_credits;
    },
  },
};
</script>
<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
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
