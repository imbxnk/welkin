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
    <v-card class="pa-5" style="height:485px;">
      <div v-if="!check" class="d-flex justify-content-center mt-5" style="color:red;">
        <v-icon x-large class="mr-5 mt-n5" color="red">mdi-alert</v-icon>
        <div class="d-flex justify-content-center">
          <div>
            <h6>Something went wrong..</h6>
            <p class="caption mt-n2">Please try again</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="loading" class="loading">
          <v-progress-circular
            :size="50"
            class="ml-16"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <p class="mt-3 primary--text">Searching for {{ search_ID }} ...</p>
        </div>
        <div v-else>
          <div v-if="std_details == null">Sorry, there is no {{ search_ID }} in our database.</div>
          <div v-else>{{ std_details.given_name }} {{ std_details.family_name }}</div>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      check: true,
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
        this.getStudent(this.search_ID);
      } else {
        this.check = false;
      }
    },
    async getStudent(id) {
      let query = ` query {
                students (searchInput:{sid:"${id}"}) {
                  students {
                    sid
                    given_name
                    family_name
                    email
                    phone
                    lineID
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
          this.std_details = res.data.data.students.students[0];
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 35%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
