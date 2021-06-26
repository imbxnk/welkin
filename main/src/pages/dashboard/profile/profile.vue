<template>
  <v-row>
    <v-tabs
      :hide-slider=true
      :vertical="$vuetify.breakpoint.mdAndUp"
      class="wk-profile-tabs"
      v-model="selected"
    >
      <router-link :to="{ name: 'MyProfile' }">
        <v-tab key="1">
          <v-icon class="wk-tab-icon">mdi-account</v-icon><span class="wk-tab-label flex-grow-1 ms-3 align-items-start">Profile</span>
        </v-tab>
      </router-link>
      <router-link :to="{ name: 'AccountSettings' }">
        <v-tab key="2">
          <v-icon class="wk-tab-icon">mdi-pen</v-icon><span class="wk-tab-label flex-grow-1 ms-3 align-items-start">Account</span>
        </v-tab>
      </router-link>
      <router-link :to="{ name: 'ChangePassword' }">
        <v-tab key="3">
          <v-icon class="wk-tab-icon">mdi-key</v-icon><span class="wk-tab-label flex-grow-1 ms-3 align-items-start">Security</span>
        </v-tab>
      </router-link>
      <router-link :to="{ name: 'Connections' }">
        <v-tab key="4">
          <v-icon class="wk-tab-icon">mdi-link-variant</v-icon><span class="wk-tab-label flex-grow-1 ms-3 align-items-start">Connections</span>
        </v-tab>
      </router-link>
      <v-tab-item v-for="i in 4" :key="i" transition="none">
        <router-view></router-view>
      </v-tab-item>
    </v-tabs>
  </v-row>
</template>
<script>
export default {
  name: "profile",
  components: { },
  computed: {},
  data: () => ({
    selected: 0
  }),
  mounted() {
    switch (this.$route.name) {
      case 'MyProfile':
        this.selected = 4
        break
      case 'AccountSettings':
        this.selected = 1
        break
      case 'ChangePassword':
        this.selected = 2
        break
      case 'Connections':
        this.selected = 3
        break
    }
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