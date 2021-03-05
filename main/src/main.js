import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JsonExcel from "vue-json-excel";
import vSelect from "vue-select"

//Routes
import Home from "./components/home";
import Import from "./components/import.vue";
import Student from "./components/student";
import Profile from "./components/proflie";
import Addnewstudent from "./components/manage_page/add_new_student";
import Import_file from "./components/manage_page/import_file";
import Course from "./components/course";
import Pasted_course from "./components/course_page/pasted_course";
import Remain_course from "./components/course_page/remain_course";
import Login from "./components/login"

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.component("downloadExcel", JsonExcel);

Vue.component('v-select', vSelect)

Vue.use(VueRouter);
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
// Axios
Vue.use(VueAxios, axios);

const routes = [
  {
    name: "login",
    path: "/login",
    component: Login,
  },
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
    children: [
      {
        name: "add_new_student",
        path: '/manage/addnewstudent',
        component: Addnewstudent
      },
      {
        name: "import_file",
        path: '/manage/importfile',
        component: Import_file
      },
    ]
  },
  
  {
    name: "profile",
    path: "/profile",
    component: Profile,
  },
  {
    name: "course",
    path: "/course",
    component: Course,
    children: [
      {
        name: "pasted_course",
        path: "/course/pastedcourse",
        component: Pasted_course
      },
      {
        name: "remain_course",
        path: "/course/remaincourse",
        component: Remain_course
      },
    ]
  },
];

const router = new VueRouter({ mode: "history", routes: routes });

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
  router,
}).$mount("#app");
