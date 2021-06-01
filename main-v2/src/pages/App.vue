<template>
  <v-app v-if="!$currentUser.isAuth">
    <router-view></router-view>
  </v-app>
  <v-app v-else>
    <v-app-bar app flat color="white" height="50">
      <div class="wk-header">
        <router-link to="/">
          <v-toolbar-title class="primary--text">
            <img :src="require(`../assets/logo.svg`)" class="logo" />
          </v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <!-- Notification -->
        <v-menu
          transition="slide-y-transition"
          bottom
          :allow-overflow="true"
          max-width="400px"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="me-3"
              style="border-radius: 50% !important;"
              v-bind="attrs"
              v-on="on"
              icon
            >
              <v-icon>mdi-bullhorn</v-icon>
              <v-badge
                color="pink"
                dot
                offset-x="9"
                offset-y="-2"
                v-if="notifications.length != $config.announcements.length"
              >
              </v-badge>
            </v-btn>
          </template>
          <div class="wk-notifications">
            <div class="wk-notifications-header d-flex">
              <div class="flex-grow-1" style="font-weight: 700">Announcements</div>
              <v-btn
                v-if="notifications.length != $config.announcements.length"
                plain
                rounded
                x-small
                style="font-size: 0.8rem; cursor: pointer; color: #007bff; letter-spacing: 0; text-index: 0; text-transform: unset"
                @click="clearNoti"
                >Mark all as Read</v-btn
              >
            </div>
            <v-divider :inset="false" class="my-0"></v-divider>
            <div class="wk-noti-wrap">
              <div class="wk-noti-box">
                <v-list class="py-0">
                  <template v-for="(item, index) in $config.announcements">
                    <v-divider
                      v-if="index !== 0"
                      :key="index"
                      :inset="false"
                      class="my-0"
                    ></v-divider>

                    <v-list-item
                      :key="item.title"
                      :class="{ unread: !notifications.includes(item._id) }"
                    >
                      <div :class="{ notification_active: true }" class=""></div>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                        <v-list-item-subtitle style="opacity: 0.4; font-size: 0.7rem">{{
                          readableDate(item.createdAt) + " - " + readableDate(item.endDate)
                        }}</v-list-item-subtitle>
                        <!-- <v-list-item-subtitle>{{ item.user.display_name || item.user.username }}</v-list-item-subtitle> -->
                        <v-list-item-subtitle class="wrap-text mt-2"
                          ><span style="font-size: 0.8rem" v-html="item.content"></span
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-btn icon class="align-self-start toggle-read" @click="toggleRead(item._id)"
                        ><v-icon>mdi-check</v-icon></v-btn
                      >
                    </v-list-item>
                  </template>
                </v-list>
              </div>
              <div class="cover-bar"></div>
            </div>
          </div>
        </v-menu>

        <v-menu transition="slide-y-transition" bottom max-width="300px" rounded offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar
              v-if="$currentUser.avatar.small"
              size="35"
              :style="`background: url(${$currentUser.avatar.small}) center center / cover;`"
              v-bind="attrs"
              v-on="on"
            >
            </v-avatar>
            <v-avatar color="primary" size="35" v-bind="attrs" v-on="on" v-else>
              <span class="white--text">
                {{ $currentUser.initials }}
              </span>
            </v-avatar>
          </template>

          <v-list>
            <v-list-item-content class="justify-center">
              <div class="text-center">
                <v-avatar
                  v-if="$currentUser.avatar.small"
                  :style="`background: url(${$currentUser.avatar.small}) center center / cover;`"
                >
                </v-avatar>
                <v-avatar color="primary" v-else>
                  <span class="white--text">
                    {{ $currentUser.initials }}
                  </span>
                </v-avatar>
                <br /><br />
                <h6 v-if="$currentUser.display_name">{{ $currentUser.display_name }}</h6>
                <h6 v-else>{{ $currentUser.given_name + " " + $currentUser.family_name }}</h6>
                <p class="caption" style="font-weight: 300">
                  {{ $currentUser.email }}
                </p>
                <v-btn
                  class="btn-manage-account"
                  @click="$router.push({ name: 'MyProfile' }).catch((err) => {})"
                  depressed
                  outlined
                  rounded
                  text
                  >Manage Your Account</v-btn
                >
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
      :touchless="true"
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
          <v-list-item
            v-if="!item.children && checkAuthGroup(i)"
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
            v-else-if="item.children && checkAuthGroup(i)"
            :group="item.href"
            :key="i"
            color="primary"
            link
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

            <template v-for="(subitem, j) in item.children">
              <v-list-item
                v-if="
                  !subitem.children &&
                    checkAuthGroup(i) &&
                    isAdvisor(i, j) &&
                    checkChildAuthGroup(i, j)
                "
                :key="j"
                :to="item.href + subitem.href"
                class="mb-2"
              >
                <v-list-item-icon>
                  <v-icon>{{ subitem.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="ml-0">{{ subitem.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- if there are children in subchildren -->
              <v-list-group
                v-else-if="subitem.children && checkAuthGroup(i)"
                :key="j"
                :group="subitem.href"
                sub-group
                class="mb-2"
              >
                <template #activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ subitem.title }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <!-- show children in subchildren -->
                <template v-for="(subSubItem, k) in subitem.children">
                  <v-list-item
                    :key="k"
                    link
                    :value="true"
                    :to="item.href + subitem.href + subSubItem.href"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ subSubItem.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ subSubItem.title }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list-group>
            </template>
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
      <simplebar
        data-simplebar-auto-hide="true"
        class="wk-container"
        :class="{ home: $route.name === 'home' }"
      >
        <router-view class="ma-4"></router-view>
      </simplebar>
    </v-main>
  </v-app>
</template>

<script>
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

export default {
  name: "App",
  components: {
    simplebar,
  },
  watch: {
    watch: {
      $currentUser(user) {
        this.$currentUser = user;
      },
      $config(config) {
        this.$config = config;
      },
    },
    notifications: {
      handler: function(newValue) {
        localStorage.user = JSON.stringify({
          notifications: newValue,
          nav: this.toggleMini,
        });
      },
      deep: true,
    },
    toggleMini(newValue) {
      localStorage.user = JSON.stringify({
        notifications: this.notifications,
        nav: newValue,
      });
    },
  },
  mounted() {
    if (localStorage.user) {
      let localUser = JSON.parse(localStorage.user);
      this.notifications = localUser.notifications || [];
      this.toggleMini = localUser.nav;
      console.log(this.toggleMini);
    }

    console.log("%cWelkin", "color: #3c84fb; font-family: monospace");
    console.log(
      "%c6080728 Kanin S. (Mix)\n6080727 Phattharaporn R. (Phat)\n6080728 Phongchai P. (Bank)\n6080779 Santhisa CH. (Nhan)",
      "font-size: 0.7rem; color: #666"
    );
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    };
    window.addEventListener("resize", appHeight);
    appHeight();
  },
  computed: {
    mini: {
      set: function() {
        return false;
      },
      get: function() {
        // return this.$vuetify.breakpoint.smAndDown || this.toggleMini;
        if (this.$vuetify.breakpoint.smAndDown === true && this.toggleMini === false) return true;
        else if (this.$vuetify.breakpoint.smAndDown === false && this.toggleMini === false)
          return true;
        return false;
      },
    },
  },
  data: () => ({
    SITE_NAME: process.env.VUE_APP_SITE_NAME,
    isAuth: false,
    sidebarMenu: true,
    toggleMini: true,
    notifications: [],
    items: [
      {
        title: "Home",
        href: "/",
        icon: "mdi-home-outline",
      },
      {
        title: "Students",
        href: "/students",
        icon: "mdi-account-group-outline",
        children: [
          {
            title: "Search Student",
            href: "/search",
            icon: "mdi-account-search",
          },
          {
            title: "All Students",
            href: "/all",
            icon: "mdi-account-multiple-outline",
            isAdvisor: false,
            authorizedGroup: ["program director", "coordinator", "admin"],
          },
          {
            title: "My Advisees",
            href: "/advisee",
            icon: "mdi-account-multiple-outline",
            isAdvisor: true,
          },
        ],
      },
      {
        title: "Course",
        href: "/course",
        icon: "mdi-file-document-multiple-outline",
      },
      {
        title: "Curriculum",
        href: "/curriculum",
        icon: "mdi-notebook-outline",
      },
      // {
      //   title: "Manage",
      //   href: "/manage",
      //   icon: "mdi-cog-outline",
      //   authorizedGroup: ["coordinator", "admin"],
      //   children: [
      //     {
      //       title: "Add New Students",
      //       href: "/manage/student",
      //       icon: "mdi-plus",
      //     },
      //     {
      //       title: "Add New Grade",
      //       href: "/manage/grade",
      //       icon: "mdi-plus",
      //     },
      //   ],
      // },
      {
        title: "Manage",
        href: "/manage",
        icon: "mdi-cog-outline",
        authorizedGroup: ["coordinator", "admin"],
        children: [
          {
            title: "Students",
            href: "/student",
            icon: "mdi-account-edit-outline",
          },
          {
            title: "Courses",
            href: "/course",
            icon: "mdi-file-document-edit-outline",
          },
          {
            title: "Curriculums",
            href: "/curriculum",
            icon: "mdi-notebook-edit-outline",
          },
          {
            title: "Instructors",
            href: "/instructor",
            icon: "mdi-account-edit-outline",
          },
          {
            title: "Users",
            href: "/user",
            icon: "mdi-clipboard-edit-outline",
          },
          {
            title: "Website",
            href: "/website",
            icon: "mdi-plus",
          },

          // {
          //   title: "Course",
          //   href: "/course",
          //   children: [
          //     {
          //       title: "Add Course",
          //       href: "/add",
          //       icon: "mdi-plus",
          //     },
          //   ],
          // },
          // {
          //   title: "Curriculum",
          //   href: "/curriculum",
          //   children: [
          //     {
          //       title: "Add Curriculum",
          //       href: "/add",
          //       icon: "mdi-plus",
          //     },
          //   ],
          // },
        ],
      },
      // {
      //   title: "try 2 levels",
      //   href: "/4",
      //   icon: "mdi-plus",
      //   children: [
      //     {
      //       title: "6",
      //       href: "/6",
      //       icon: "mdi-plus",
      //     },
      //   ],
      // },
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
  }),
  methods: {
    navOnOutsideClick() {
      if (this.sidebarMenu && this.$vuetify.breakpoint.smAndDown) {
        this.toggleMini = false;
      }
    },
    checkAuthGroup(i) {
      try {
        return this.items[i].authorizedGroup
          ? this.items[i].authorizedGroup.includes(this.$currentUser.group)
          : true;
      } catch (err) {}
    },
    isAdvisor(i, j) {
      return this.items[i].children[j].isAdvisor ? this.$currentUser.isAdvisor : true;
    },
    checkChildAuthGroup(i, j) {
      try {
        return this.items[i].children[j].authorizedGroup
          ? this.items[i].children[j].authorizedGroup.includes(this.$currentUser.group)
          : true;
      } catch (err) {}
    },
    logout() {
      //Logout and clear token
      let query = `
          query {
              logout {
                  token
                  userId
                  message
              }
          }
      `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          window.location.replace("/login");
        })
        .catch((err) => {});
    },
    clearNoti() {
      this.notifications = [];
      this.$config.announcements.forEach((announcement) => {
        this.notifications.push(announcement._id);
      });
    },
    toggleRead(id) {
      if (this.notifications.includes(id))
        this.notifications.splice(this.notifications.indexOf(id), 1);
      else this.notifications.push(id);
    },
    readableDate(date) {
      return this.moment(parseInt(date)).format("DD MMMM YYYY (HH:MM)");
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

.btn-manage-account {
  text-transform: capitalize;
}
</style>
