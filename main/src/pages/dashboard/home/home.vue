<template>
  <div id="app" class="d-flex flex-column">
    <!-- <h4>Hello, {{ this.$currentUser.given_name }} {{ this.$currentUser.family_name }}</h4>
    <v-row class="wk-home-container">
      <v-col cols="12" lg="8" xl="9">
        <ShowStudentsTable></ShowStudentsTable>
      </v-col> -->
    <!-- <v-col cols="6" lg="4" xl="3"> -->
    <!-- <v-col cols="12" md="6" lg="4" xl="3">
        <ShowBatchesSummary></ShowBatchesSummary>
      </v-col>
    </v-row> -->
    <div class="py-5 wk-home-container">
      <span v-if="this.$currentUser.group == 'lecturer' && this.$currentUser.isAdvisor == false">
        <div class="row d-md-block">
          <div class="col-md-4 float-left">
            <div>
              <h3>
                Hello,
                <span class="primary--text">{{
                  this.$currentUser.display_name
                    ? this.$currentUser.display_name
                    : this.$currentUser.given_name
                }}</span>
              </h3>
              <h6 class="grey--text">have a nice day :)</h6>

              <v-divider class="mb-n2"></v-divider>
            </div>
          </div>
          <div class="col-md-8 float-right order-0">
            <div><ShowAnnouncement></ShowAnnouncement></div>
          </div>
          <div class="col-md-4 float-left order-1">
            <div><ShowBatchesSummary></ShowBatchesSummary></div>
          </div>
          <!-- <div class="col-md-4 float-left order-last">
            <div style="height:50px;width:100%;background-color: yellow;">D</div>
          </div> -->
        </div>
      </span>
      <span v-else>
        <div class="row d-md-block">
          <div class="col-md-4 float-left">
            <div>
              <div>
                <h3>
                  Hello,
                  <span class="primary--text">{{
                    this.$currentUser.display_name
                      ? this.$currentUser.display_name
                      : this.$currentUser.given_name
                  }}</span>
                </h3>
                <h6 class="grey--text">have a nice day :)</h6>

                <v-divider class="mb-n2"></v-divider>
              </div>
            </div>
          </div>
          <div
            v-if="
              this.$currentUser.group == 'coordinator' ||
                this.$currentUser.group == 'program director' ||
                this.$currentUser.group == 'admin'
            "
            class="col-md-8 float-right order-last"
          >
            <div><ShowStudentsTable></ShowStudentsTable></div>
          </div>
          <div
            v-if="this.$currentUser.isAdvisor == true && this.$currentUser.group == 'lecturer'"
            class="col-md-8 float-right order-last"
          >
            <div><ShowAdviseeTable></ShowAdviseeTable></div>
          </div>
          <div class="col-md-4 float-left order-0">
            <div><ShowAnnouncement></ShowAnnouncement></div>
          </div>
          <div class="col-md-4 float-left order-1">
            <div><ShowBatchesSummary></ShowBatchesSummary></div>
          </div>
        </div>
      </span>
    </div>

    <!-- <div class="col-md-8 order-4 float-right py-2"><ShowStudentsTable></ShowStudentsTable></div> -->

    <!-- <div class="row order-4 pt-2">
          <div class="col-md-6 order-1 float-left ">
            <v-card class="rounded-card pa-5"> x</v-card>
          </div>
          <div class="col-md-6 order-2 float-right ">
            <v-card class="rounded-card pa-5"> x</v-card>
          </div>
        </div> -->

    <div class="wk-footer justify-content-between flex-sm-row">
      <div class="d-flex align-items-center">
        <a class="wk-footer-icon mr-2" href="https://welkin.app">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 600 600">
            <path
              fill-rule="evenodd"
              d="M147.857,481.286c-134.22-31.525-126.2-239.169,46.714-230.143,23.222,3.693,34.047-3.736,35.572-30.857,17.366-128.233,212.338-145.2,232.286,13.285-31.054,100.765-31.3,101.728-42.858,135.858-7.579-23.026-12.821-43.421-15.428-48-11.889-22.667-40.109-11.7-43.714,4.714-5.054,15.048-12.219,34.641-17.143,46.286-2.844-9.429-9.253-31.936-15-50.572-9.772-22.832-47.909-18.133-45,13.714,8.457,29.332,21.579,77.391,35.255,100.357,11.8,19.241,34.955,17.873,45.316,2.929,4.367-4.12,12.532-21.147,18-34.714,5.2,14.294,10.265,26.705,16.714,34.286,16.18,19.961,39.581,11.993,48-9,23.226-53.592,49.582-144.59,63-189.429C503.44,33.8,225.232,11.7,185.143,204-26.61,198.168-60.739,483.168,143.571,528.429c99.593-.018,170.873,0,312.858,0,147.579-36.664,168.5-190.528,93.857-266.572C527.191,238.1,495.815,270.1,516,293.571c46.12,46.4,45.213,154.55-65.143,187.715C315.774,481.3,252.433,481.27,147.857,481.286Z"
            />
          </svg>
        </a>
        <span class="wk-footer-text">© 2021 Welkin</span>
      </div>
      <div class="d-flex align-items-center align-items-sm-end flex-column">
        <span class="wk-footer-text" style="font-size: 0.8rem;">Computer Engineering</span>
        <span class="wk-footer-text" style="font-size: 0.7rem"
          >Mahidol University International College</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import ShowStudentsTable from "./components/show_students_table";
import ShowAdviseeTable from "./components/show_advisee_table";
import ShowBatchesSummary from "./components/show_batches_summary";
import ShowStudentGraph from "./components/show_student_graph";
import ShowAnnouncement from "./components/show_announce";

export default {
  name: "home",
  components: {
    ShowStudentsTable,
    ShowBatchesSummary,
    ShowAnnouncement,
    // ShowStudentGraph,
    ShowAdviseeTable,
  },
  mounted() { },
};
</script>

<style scoped>
.wk-home-container {
  /* min-width: 700px;
  width: 100% !important; */
  margin: 0px !important;
  min-height: calc(100vh - 125px);
}

@media (max-width: 1200px) {
  .wk-welcome h3,
  .wk-welcome span {
    font-size: 1.5rem;
  }
}
</style>
