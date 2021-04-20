<template>
<div>
  <v-app v-if="$route.name === 'login'">
    <router-view></router-view>
  </v-app>
  <v-app v-else-if="$route.name !== 'login' && isAuth">
    <v-app-bar app flat color="white" height="50">
      <div class="wk-header">
        <router-link to="/">
          <v-toolbar-title class="primary--text">
            <img :src="require(`../assets/logo.svg`)" class="logo">
          </v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>

        <v-menu bottom max-width="300px" rounded offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar v-if="user.avatar_url" size="35" v-bind="attrs" v-on="on">
              <img
                :src="user.avatar_url"
              >
            </v-avatar>
            <v-avatar color="primary" size="35" v-bind="attrs" v-on="on" v-else>
              <span class="white--text">
                {{ user.given_name.charAt(0) + user.family_name.charAt(0) }}
              </span>
            </v-avatar>
          </template>

          <v-list>
            <v-list-item-content class="justify-center">
              <div class="text-center">
                <v-avatar v-if="user.avatar_url">
                  <img
                    :src="user.avatar_url"
                  >
                </v-avatar>
                <v-avatar color="primary" v-else>
                  <span class="white--text">
                    {{ user.given_name.charAt(0) + user.family_name.charAt(0) }}
                  </span>
                </v-avatar>
                <br /><br />
                <h6>{{ user.given_name + " " + user.family_name }}</h6>
                <p class="caption">
                  {{ user.email }}
                </p>
                <v-btn @click="$router.push({ path: '/profile' })" depressed outlined rounded text>Manage Your Account</v-btn>
                <v-divider class=""></v-divider>
              </div>
              <!-- <v-list-item v-for="(account, i) in accounts" :key="i" :to="account.href">
                <v-list-item-title>{{ account.title }}</v-list-item-title>
              </v-list-item> -->
              <v-list-item class="my-n4 px-16">
                <v-btn class="my-3" @click="logout()" block outlined depressed text>Logout</v-btn>
              </v-list-item>
              <v-divider class="mb-n5 py-2"></v-divider>
            </v-list-item-content>
          </v-list>
        </v-menu>
      </div>
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

      <v-list expand nav>
        <template v-for="(item, i) in items">
          <!-- lists that have no children -->
          <v-list-item v-if="!item.children && checkAuthGroup(i)" :key="item.title" link :to="item.href" color="primary">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- lists with children -->
          <v-list-group
            v-else-if="item.children && checkAuthGroup(i)"
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

            <v-list-item
              v-for="(subitem, j) in item.children"
              :key="j"
              link
              :to="subitem.href"
              @click.stop="toggleMini = true"
            >
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
    <v-main style="margin:0 !important;">
      <simplebar data-simplebar-auto-hide="true" class="wk-container" :class="{ home: $route.name === 'home'}">
        <router-view class="ma-4"></router-view>
      </simplebar>
    </v-main>

  </v-app>
</div>
</template>

<script>
import welkin from "../utils/auth"
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';

export default {
  name: "App",
  created: async function() {
    this.user = (await welkin.auth()).currentUser
    if(this.user) {
      this.isAuth = true
    }
  },
  components: {
    simplebar
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
        title: "Class",
        href: "/class",
        icon: "mdi-file-document-multiple-outline",
      },
      {
        title: "Curriculum",
        href: "/curriculum",
        icon: "mdi-book-open-outline",
      },
      {
        title: "Manage",
        href: "/manage",
        icon: "mdi-cog-outline",
        authorizedGroup: ['coordinator', 'admin'],
        children: [
          {
            title: "Add New Students",
            href: "/manage/student",
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
    // user: {
    //   given_name: "Demo",
    //   family_name: "User",
    //   username: "demo",
    //   email: "demo@welkin.app",
    // },
    user: {},
  }),
  methods: {
    navOnOutsideClick() {
      if (this.sidebarMenu && this.$vuetify.breakpoint.smAndDown) {
        this.toggleMini = false;
      }
    },
    checkAuthGroup(i) {
      try{
        if(!this.items[i].authorizedGroup.includes(this.user.group)) return false
      } catch (err) {
        console.log(err)
      }
      return true
    },
    async logout() {
      //axios post to check token, userId compare with the username and password
      let query = `
          query {
              logout {
                  token
                  userId
                  message
              }
          }
      `;
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res);
          window.location.replace("/login");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
a:hover {
  text-decoration: none;
}
.theme--light.v-application {
  background: #f7f7f8;
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
.logo {
  height: 30px;
}
.v-menu__content {
  top: 50px !important;
}

h6 {
  font-size: 0.95rem;
  margin-bottom: 0;
}
</style>
