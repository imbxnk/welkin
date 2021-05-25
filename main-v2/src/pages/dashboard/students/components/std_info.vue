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
        <b>Email:</b> <span v-if="stdDetail.email">{{ stdDetail.email }}</span
        ><span v-else>-</span><br />
        <template v-if="stdDetail.records">
          <b>GPA:</b> <span>{{ stdDetail.records.egci_cumulative_gpa }}</span
          ><br />
          <b>Core Courses:</b> <span>{{ stdDetail.records.core_credits }}</span
          ><br />
          <b>Required Courses:</b> <span>{{ stdDetail.records.major_credits }}</span
          ><br />
          <b>Elective Courses:</b> <span>{{ stdDetail.records.elective_credits }}</span
          ><br />
          <b>Credits Earned :</b> <span>{{ stdDetail.records.total_credits }}</span
          ><br />
        </template>
        <div class="w-100 d-flex justify-content-end align-self-end mt-sm-16 mt-md-16 ml-md-6">
          <a @click="$router.push({ name: 'student_record', params: { sid: stdDetail.sid } })"
            ><b>... See More >></b></a
          >
        </div>
      </v-col>
    </v-row>
    <v-row class="pb-3">
      <StudentRemark :sid="stdDetail.sid"></StudentRemark>
    </v-row>
  </v-card-text>
</template>
<script>
import StudentRemark from "./std_remark";
export default {
  name: "Student_Info",
  props: ["stdDetail"],
  components: { StudentRemark },
  mounted() {},
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
