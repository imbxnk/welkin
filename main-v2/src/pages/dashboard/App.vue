<template>
  <v-app v-if="isAuth">
    <v-app-bar app flat color="white" height="50">
      <v-toolbar-title class="primary--text" @click="$router.push('/')">{{ SITE_NAME }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu bottom max-width="300px" rounded offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar color="primary" size="35" v-bind="attrs" v-on="on">
            <span class="white--text ">{{ user.given_name.charAt(0) + user.family_name.charAt(0) }}</span>
          </v-avatar>
        </template>

        <v-list>
          <v-list-item-content class="justify-center">
            <div class="text-center">
              <v-avatar color="primary">
                <span class="white--text">{{ user.given_name.charAt(0) + user.family_name.charAt(0) }}</span>
              </v-avatar>
              <br /><br />
              <h6>{{ user.given_name + ' ' + user.family_name }}</h6>
              <p class="caption mt-1">
                {{ user.email }}
              </p>
              <v-btn @click="$router.push('/profile')" depressed outlined rounded text>Manage Your Account</v-btn>
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
      :temporary="toggleMini == true ? $vuetify.breakpoint.smAndDown : false"
      :mini-variant.sync="mini"
      v-click-outside="navOnOutsideClick"
      color="white"
    >
      <!-- list menu -->
      <v-list>
        <v-list-item class="toggleMenu">
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
            @click.stop="toggleMini = true"
          >
            <template #activator>
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="(subitem, j) in item.children" :key="j" link :to="subitem.href" @click.stop="toggleMini = true">
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
        <!-- add content here -->
        <router-link :to="{ name: 'home' }"></router-link>
        <!-- <router-link :to="{ name: 'student' }"></router-link> -->
        <router-link :to="{ name: 'profile' }"></router-link>
        <router-view class="ma-4"></router-view>
      </template>
  </v-app>
</template>

<script>
import auth from "../../utils/auth"

export default {
  name: 'App',

  created: async function() {
    this.user = await auth.getUser()
    if(this.user) {
      this.user = this.user.data.data.me
      console.log(this.user)
      this.isAuth = true
    } else {
      window.location.replace("/login/");
    }
  },

  computed: {
    mini: {
      set: function() {
        return false;
      },
      get: function() {
        // return this.$vuetify.breakpoint.smAndDown || this.toggleMini;
        if (this.$vuetify.breakpoint.smAndDown === true && this.toggleMini === false) return true;
        else if (this.$vuetify.breakpoint.smAndDown === false && this.toggleMini === false) return true;
        return false;
      },
    },
  },

  data: () => ({
    SITE_NAME: process.env.VUE_APP_SITE_NAME,
    isAuth: false,
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
      {
        title: "Course",
        href: "/course",
        icon: "mdi-file-document-multiple-outline"
      },
      {
        title: "Curriculum",
        href: "/curriculum",
        icon: "mdi-book-open-outline"
      },
      {
        title: "Manage",
        href: "/manage",
        icon: "mdi-cog-outline",
        children: [
          {
            title: "Add New Students",
            href: "/manage/students/add",
            icon: "mdi-plus"
          },
        ],
      },
    ],
    // accounts: [{ title: "Edit Profile", href: "/profile" }],
    // user: {
    //   initials: "MS",
    //   fullName: "Mingmanas Sivaraksa",
    //   email: "mingmanas.siv@mahidol.edu",
    // },
    user: {},
  }),
  methods: {
    navOnOutsideClick() {
      if (this.sidebarMenu && this.$vuetify.breakpoint.smAndDown) {
        this.toggleMini = false
      }
    },
  },
};
</script>

<style lang="scss" scoped>
a:hover {
  text-decoration: none;
}
.main-content {
  padding: 10px 0;
}
.theme--light.v-application {
  background: #f7f7f7;
}
.toggleMenu {
  margin: -6px auto;
}
.v-list-item {
  min-height: 44px;
}
.v-list-item__icon {
  margin: auto 0;
}
</style>