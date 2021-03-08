<template>
  <v-app>
    <router-link :to="{ name: 'login' }"></router-link>
    <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
