<template>
  <v-row>
    <v-tabs :vertical="$vuetify.breakpoint.mdAndUp" class="wk-profile-tabs" v-model="selected">
      <router-link :to="{path: '/profile'}">
        <v-tab key="1">
          Profile
        </v-tab>
      </router-link>
      <router-link :to="{path: '/profile/settings'}">
        <v-tab key="2">
          Account
        </v-tab>
      </router-link>
      <router-link :to="{path: '/profile/security'}">
        <v-tab key="3">
          Security
        </v-tab>
      </router-link>

      <v-tab-item transition="none">
        <v-card flat elevation="2">
          <router-view></router-view>
        </v-card>
      </v-tab-item>
      <v-tab-item transition="none">
        <v-card flat elevation="2">
          <router-view></router-view>
        </v-card>
      </v-tab-item>
      <v-tab-item transition="none">
        <v-card flat elevation="2">
          <router-view></router-view>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-row>
</template>
<script>
// import AccountSettings from "./components/accountSettings.vue";
// import ChangePassword from "./components/changePassword.vue";
export default {
  name: "profile",
  components: {
    // ChangePassword,
    // AccountSettings
  },
  computed: {},
  data: () => ({
    selected: 0
  }),
  mounted() {
    switch (this.$route.name) {
      case 'MyProfile':
        this.selected = 3
        break
      case 'AccountSettings':
        this.selected = 1
        break
      case 'ChangePassword':
        this.selected = 2
        break
    }
    console.log(this.selected)
  },
  methods: {
  },
};
</script>

<style scoped>
.v-slide-group__content a {
  text-decoration: none;
  margin-bottom: 5px;
  border-radius: 30px;
}
</style>