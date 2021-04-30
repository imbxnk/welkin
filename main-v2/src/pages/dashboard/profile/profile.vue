<template>
  <v-row v-if="$route.name === 'profile'">
    <v-tabs :vertical="$vuetify.breakpoint.mdAndUp" class="wk-profile-tabs">
      <v-tab>
        Profile
      </v-tab>
      <v-tab>
        Account
      </v-tab>
      <v-tab>
        Security
      </v-tab>

      <v-tab-item transition="none">
        <v-card flat elevation="2">
          <v-card-title>
            Profile
          </v-card-title>
          <v-card-text>
            <v-img v-if="user.avatar_url" max-width="200" :src="user.avatar_url"></v-img>
            <v-img v-else max-width="200" src="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"></v-img>
            {{ user.given_name + " " + user.family_name }}<br>
            {{ user.display_name }}<br>
            {{ user.email }}<br>
            {{ user.group }}<br>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item transition="none">
        <v-card flat elevation="2">
          <v-card-title>
            Account
          </v-card-title>
          <v-card-text>

          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item transition="none">
        <v-card flat elevation="2">
          <v-card-title>
            Security
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-column">
              <div>
                <h6 class="mt-2">Change Password</h6>
              </div>
              <div class="flex-grow-1">
                <v-text-field
                  label="Current Password"
                  type="password"
                  outlined
                  v-model="userInput.currentPassword"
                ></v-text-field>

                <v-text-field
                  label="New Password"
                  type="password"
                  outlined
                  v-model="userInput.newPassword"
                ></v-text-field>

                <v-text-field
                  label="Confirm Password"
                  type="password"
                  outlined
                  v-model="userInput.confirmPassword"
                ></v-text-field>

                <v-btn
                  depressed
                  color="primary"
                  @click="updatePassword"
                  :disabled="userInput.currentPassword === '' || userInput.newPassword === '' || userInput.confirmPassword === ''"
                >
                  Submit
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-row>
  <router-view v-else></router-view>
</template>
<script>
import welkin from "../../../utils/auth"
export default {
  name: "profile",
  components: {},
  computed: {},
  data: () => ({
    // user: {
    //   initials: "MS",
    //   fullName: "Mingmanas Sivaraksa",
    //   email: "Mingmanas.siv@mahidol.com",
    //   role: "Advisor",
    // },
    user: {},
    userInput: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  }),
  mounted() {
    this.getCurrentUser()
  },
  methods: {
    getCurrentUser: async function() {
      this.user = (await welkin.auth()).currentUser
    },
    updatePassword() {
      if(this.userInput.newPassword === this.userInput.newPassword){
        let query = `
                      mutation {
                        updatePassword (userInput: { currentPassword: "${this.userInput.currentPassword}", newPassword: "${this.userInput.newPassword}" }) {
                          token,
                          userId,
                          message
                        }
                      }
                  `;
        this.axios
          .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => { });
      }
    },
  },
};
</script>