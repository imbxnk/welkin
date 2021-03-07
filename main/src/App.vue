<template>
  <div id="app">
    <v-app>
      <v-app-bar app flat color="white">
        <v-toolbar-title class="primary--text" @click="$router.push('/')">Welkin</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-menu bottom max-width="300px" rounded offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar color="primary" size="35" v-bind="attrs" v-on="on"
              ><span class="white--text ">{{ user.initials }}</span></v-avatar
            >
          </template>

          <v-list>
            <v-list-item-content class="justify-center">
              <div class="text-center">
                <v-avatar color="primary">
                  <span class="white--text">{{ user.initials }}</span>
                </v-avatar>
                <br /><br />
                <h6>{{ user.fullName }}</h6>
                <p class="caption mt-1">
                  {{ user.email }}
                </p>
                <v-btn @click="$router.push('/profile')" depressed outlined rounded text
                  >Manage Your Account</v-btn
                >
                <v-divider class=""></v-divider>
              </div>
              <!-- <v-list-item v-for="(account, i) in accounts" :key="i" :to="account.href">
                <v-list-item-title>{{ account.title }}</v-list-item-title>
              </v-list-item> -->
              <v-list-item class="my-n4 px-16">
                <v-btn @click="$router.push('/')" block outlined depressed text>Logout</v-btn>
              </v-list-item>
              <v-divider class="mb-n5 py-2"></v-divider>
            </v-list-item-content>
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- nav menu: -->
      <v-navigation-drawer
        v-model="sidebarMenu"
        app
        floating
        :permanent="sidebarMenu"
        :temporary="toggleMini == true ? $vuetify.breakpoint.smAndDown : permanent"
        :mini-variant.sync="mini"
        color="white"
      >
        <!-- list menu -->
        <v-list>
          <v-list-item>
            <!-- <v-app-bar-nav-icon @click.stop="toggleMini = !toggleMini"></v-app-bar-nav-icon> -->
            <v-list-item-action>
              <v-icon @click.stop="toggleMini = !toggleMini" color="primary">mdi-menu</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <!-- lists that have no children -->
        <v-list expand nav>
          <template v-for="item in items">
            <v-list-item
              v-if="!item.children"
              :key="item.title"
              link
              :to="item.href"
              color="primary"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- lists with children -->
            <v-list-group
              v-else
              :group="item.href"
              :key="item.title"
              link
              :to="item.href"
              color="primary"
            >
              <template #activator>
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item v-for="(subitem, j) in item.children" :key="j" link :to="subitem.href">
                <v-list-item-icon>
                  <v-icon>{{ subitem.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ subitem.title }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list>
      </v-navigation-drawer>

      <!-- content -->
      <!-- <template v-if="loading">
        <div class="text-center">
          <v-progress-circular :size="70" :width="7" color="#FDE2A6" indeterminate>
          </v-progress-circular>
        </div>
      </template> -->
      <!-- <template v-else> -->
      <template>
        <div class="bg">
          <v-main>
            <!-- add content here -->
            <router-link :to="{ name: 'profile' }"></router-link>
            <router-link :to="{ name: 'home' }"></router-link>
            <router-link :to="{ name: 'student' }"></router-link>
            <router-link :to="{ name: 'manage' }"></router-link>
            <router-view class="ma-4"></router-view>
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
    // icondisable() {
    //   if (this.$vuetify.breakpoint.smAndDown) return true;
    //   else return false;
    // },
  },
  data: () => ({
    sidebarMenu: true,
    toggleMini: false,
    items: [
      {
        title: "Home",
        href: "/",
        icon: "mdi-home-outline",
      },
      {
        title: "Student",
        href: "/student",
        icon: "mdi-account-multiple-outline",
      },
      { title: "Course", href: "/course", icon: "mdi-file-document-multiple-outline" },
      { title: "Curriculum", href: "/curriculum", icon: "mdi-book-open-outline" },
      {
        title: "Manage",
        href: "/manage",
        icon: "mdi-cog-outline",
        children: [{ title: "Add new student", href: "/manage/addnewstudent", icon: "mdi-plus" }],
      },
    ],
    // accounts: [{ title: "Edit Profile", href: "/profile" }],
    user: {
      initials: "MS",
      fullName: "Mingmanas Sivaraksa",
      email: "Mingmanas.siv@mahidol.com",
    },
  }),

  methods: {},
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
.main-content {
  padding: 10px 0;
}
</style>
