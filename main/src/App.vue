<template>
  <div id="app">
    <v-app>
      <v-app-bar app flat color="white">
        <v-toolbar-title class="primary--text">Welkin</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-avatar color="primary" size="35"><span class="white--text ">hi</span></v-avatar>
      </v-app-bar>
      <v-navigation-drawer
        v-model="sidebarMenu"
        app
        floating  
        :permanent="sidebarMenu"
        :temporary="toggleMini == true ? $vuetify.breakpoint.smAndDown : permanent"
        :mini-variant.sync="mini"
        color="white"

      >
        <v-list>
          <v-list-item>
            <!-- <v-app-bar-nav-icon @click.stop="toggleMini = !toggleMini"></v-app-bar-nav-icon> -->
            <v-list-item-action>
              <v-icon @click.stop="toggleMini = !toggleMini" color="primary">mdi-menu</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-list style="padding: 0px">
          <v-list-item v-for="item in items" :key="item.title" link :to="item.href">
            <v-list-item-icon>
              <v-icon color="black">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <template v-if="loading">
        <div class="text-center">
          <v-progress-circular
            :size="70"
            :width="7"
            color="#FDE2A6"
            indeterminate
          >
          </v-progress-circular>
        </div>
      </template>
      <template v-else>
        <div class="bg">
          <v-main>
            <!-- add content here -->
            <v-card class="ma-4">
              <router-link :to="{ name: 'home' }"></router-link>
              <router-link :to="{ name: 'student' }"></router-link>
              <router-link :to="{ name: 'manage' }"></router-link>
              <router-view class="ma-4"></router-view>
            </v-card>
          </v-main>
        </div>
      </template>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",

  components: {},
  computed: {
    mini() {
      // return this.$vuetify.breakpoint.smAndDown || this.toggleMini;
      if (this.$vuetify.breakpoint.smAndDown === true && this.toggleMini === false) {
        return true;
      } else if (this.$vuetify.breakpoint.smAndDown === false && this.toggleMini === false) {
        return true;
      } else return false;
    },
    icondisable() {
      if (this.$vuetify.breakpoint.smAndDown) return true;
      else return false;
    },
  },
  data: () => ({
    sidebarMenu: true,
    toggleMini: false,
    items: [
      { title: "Home", href: "/", icon: "mdi-home-outline" },
      { title: "Student", href: "/student", icon: "mdi-account-multiple-outline" },
      { title: "Course", href: "/course", icon: "mdi-file-document-multiple-outline" },
      { title: "Curriculum", href: "/curriculum", icon: "mdi-book-open-outline" },
      { title: "Manage", href: "/manage", icon: "mdi-cog-outline" },
    ],
  }),
};
</script>

<style lang="scss" scoped>
  a:hover {
    text-decoration: none;
  }
  .bg {
    min-height: 100vh;
    background: #f8f8f8;
  }
</style>
