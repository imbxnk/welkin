import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Home from "./components/home";
import Import from "./components/import.vue";
import Student from "./components/student";
import Profile from "./components/proflie";
import axios from "axios";
import VueAxios from "vue-axios";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(VueRouter);
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
// Axios
Vue.use(VueAxios, axios);

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "student",
    path: "/student",
    component: Student,
  },
  {
    name: "manage",
    path: "/manage",
    component: Import,
  },
  {
    name: "profile",
    path: "/profile",
    component: Profile,
  },
];

const router = new VueRouter({ mode: "history", routes: routes });

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
  router,
}).$mount("#app");
