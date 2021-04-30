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
          <ChangePassword></ChangePassword>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-row>
  <router-view v-else></router-view>
</template>
<script>
import welkin from "../../../utils/auth"
import ChangePassword from "./components/changePassword.vue"
export default {
  name: "profile",
  components: {
    ChangePassword
  },
  computed: {},
  data: () => ({
    // user: {
    //   initials: "MS",
    //   fullName: "Mingmanas Sivaraksa",
    //   email: "Mingmanas.siv@mahidol.com",
    //   role: "Advisor",
    // },
    user: {},
  }),
  mounted() {
    this.getCurrentUser()
  },
  methods: {
    getCurrentUser: async function() {
      this.user = (await welkin.auth()).currentUser
    },
  },
};
</script>