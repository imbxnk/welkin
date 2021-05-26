<template>
  <div id="app">
    Search Student
    <div class="input-group mb-3">
      <input
        type="number"
        class="form-control"
        v-model="student_ID"
        placeholder="You can only search using Student ID. Example: 6080001"
      />
      <div class="input-group-append">
        <button class="btn btn-outline-primary" type="button" @click="getID()">Search</button>
      </div>
    </div>
    <!-- <v-card class="pa-5" style="height:485px;"> </v-card> -->

    <v-card class="" style=""
      ><simplebar data-simplebar-auto-hide="true" class="wk-content-full-height ma-3">
        <div v-if="!check" class="d-flex justify-content-center mt-5" style="color:red;">
          <v-icon x-large class="mr-5 mt-n5" color="red">mdi-alert</v-icon>
          <div class="d-flex justify-content-center pa-3">
            <div>
              <h6>Something went wrong..</h6>
              <p class="caption mt-n2">
                Please try again, make sure that you follow the format (Ex. 60800001)
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="loading" class="loading pa-3">
            <v-progress-circular
              :size="50"
              class="ml-16"
              color="primary"
              indeterminate
            ></v-progress-circular>
            <p class="mt-3 primary--text">Searching for {{ search_ID }} ...</p>
          </div>
          <div v-else>
            <div v-if="showing == 0" class="grey--text pa-3">
              Please enter the student ID to search fot the student
            </div>
            <div v-if="showing == 1" class="pa-3">
              Sorry, there is no {{ search_ID }} in our database.
            </div>
            <div v-if="showing == 2" class="pa-3">
              <div class="row d-md-block">
                <div class="col-md-4 order-1 float-left">
                  <v-card outlined elevation="0" class="text-center pa-3">
                    <v-img
                      :src="std_details.avatar_url || $config.defaultAvatar"
                      contain
                      max-width="230"
                      class="center"
                    />
                    <div class="overline">{{ std_details.sid }}</div>
                  </v-card>
                </div>
                <div class="col-md-8 order-2 float-right">
                  <v-card outlined elevation="0" class="profile-card">
                    <span class="overline">About this student</span>
                    <h3>{{ std_details.given_name }} {{ std_details.family_name }}</h3>
                    <v-divider></v-divider>
                    {{ std_details.entry_year }}T{{ std_details.entry_trimester }}<br />
                    Email: {{ std_details.email == null ? " - " : std_details.email }}<br />
                    Phone: {{ std_details.phone == "" ? " - " : std_details.phone }}<br />
                    Line id: {{ std_details.lineID == null ? " - " : std_details.lineID }}<br />
                    <div
                      class="w-100 d-flex justify-content-end align-self-end  mt-sm-16 mt-md-16 "
                    >
                      <a
                        @click="
                          $router.push({ name: 'student_record', params: { sid: std_details.sid } })
                        "
                        ><b>... See More >></b></a
                      >
                    </div>
                  </v-card>
                </div>
                <div class="col-md-4 order-3 float-left">
                  <v-card outlined elevation="0" class="pa-3"
                    ><span class="overline">Taken courses</span>

                    <div class="d-flex justify-content-around flex-wrap flex-row">
                      <div class="order-1 text-center">
                        <p class="mt-n1">Core</p>
                        <h4 class="primary--text mt-n4">
                          {{ std_details.records.core_credits }}
                        </h4>
                        <p class="small mt-n2 ">credits</p>
                      </div>
                      <div class="order-2 text-center">
                        <p class="mt-n1">Required</p>
                        <h4 class="primary--text mt-n4">
                          {{ std_details.records.major_credits }}
                        </h4>
                        <p class="small mt-n2 ">credits</p>
                      </div>
                      <div class="order-3 text-center">
                        <p class="mt-n1">Elective</p>
                        <h4 class="primary--text mt-n4">
                          {{ std_details.records.elective_credits }}
                        </h4>
                        <p class="small mt-n2 ">credits</p>
                      </div>
                    </div>
                  </v-card>
                </div>
              </div>
            </div>
          </div>
        </div></simplebar
      >
    </v-card>
  </div>
</template>
<script>
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";
export default {
  components: {
    simplebar,
  },
  data() {
    return {
      loading: false,
      check: true,
      showing: 0,
      student_ID: "",
      search_ID: "",
      deley: 2000,
      std_details: [],
    };
  },
  methods: {
    getID() {
      if (this.student_ID.length == 7) {
        this.search_ID = this.student_ID;
        this.loading = true;
        this.check = true;
        (this.showing = true), this.getStudent(this.search_ID);
      } else {
        this.check = false;
      }
    },
    async getStudent(id) {
      let query = ` query {
                students (searchInput:{sid:"${id}"}) {
                  students {
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
                    phone
                    lineID
                    lineUID
                    advisor{
                      name
                    }
                    status {
                      current
                    }
                    remarks{
                      message
                      user {
                        username
                      }
                      _id
                    }
                    records{
                      egci_cumulative_gpa
                      total_credits
                      core_credits
                      major_credits
                      elective_credits

                    }
                  }
                }
              }
      `;
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          if (!res.data.data.students.students[0]) {
            this.showing = 1;
            this.loading = false;
          } else {
            this.std_details = res.data.data.students.students[0];
            this.showing = 2;
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
.profile-card {
  // height: 200px;
  padding: 1em;
}
.loading {
  position: absolute;
  top: 35%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.wk-content-full-height {
  height: calc(var(--app-height) - 156px);
  /* height: var(--app-height); */
  /* height: auto; */
  overflow: auto;
}

// @media (max-width: 576px) {
//   .wk-content-full-height-list {
//     height: calc(var(--app-height) - 237px);
//   }
// }
</style>
