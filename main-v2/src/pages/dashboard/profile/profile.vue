<template>
  <v-row>
    <v-tabs :vertical="$vuetify.breakpoint.mdAndUp" class="wk-profile-tabs" v-model="selected">
      <router-link :to="{ name: 'MyProfile' }">
        <v-tab key="1">
          Profile
        </v-tab>
      </router-link>
      <router-link :to="{ name: 'AccountSettings' }">
        <v-tab key="2">
          Account
        </v-tab>
      </router-link>
      <router-link :to="{ name: 'ChangePassword' }">
        <v-tab key="3">
          Security
        </v-tab>
      </router-link>

      <v-tab-item transition="none">
        <router-view></router-view>
      </v-tab-item>
      <v-tab-item transition="none">
        <router-view></router-view>
      </v-tab-item>
      <v-tab-item transition="none">
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
        this.selected = 3
        break
      case 'AccountSettings':
        this.selected = 1
        break
      case 'ChangePassword':
        this.selected = 2
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