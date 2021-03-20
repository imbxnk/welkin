import Vue from "vue";
import App from "./App.vue";
import vuetify from "../../plugins/vuetify";
import VueRouter from "vue-router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import VueAxios from "vue-axios";

// Import All Routes
import Home from "./home/home";
import AddStudents from "./manage/add_students";
import Profile from "./profile/profile";
import ImportStudents from "./manage/import_students";
import StudentList from "./students/students";
import ClassList from "./classlist/classlist";
import ClassHistory from "./classlist/class_history";

// Import Bootstrap an BootstrapVue CSS files
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Use VueRouter
Vue.use(VueRouter);
// Use BootstrapVue
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
// Use Axios
Vue.use(VueAxios, axios);

// Define All Routes
const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "student_list",
    path: "/student",
    component: StudentList,
  },
  {
    name: "class_list",
    path: "/class",
    component: ClassList,
  },
  {
    name: "add_students",
    path: "/manage/students/add",
    component: AddStudents,
  },
  {
    name: "profile",
    path: "/profile",
    component: Profile,
  },
  {
    name: "import_students",
    path: "/manage/students/import",
    component: ImportStudents,
  },
    {
    name: "class_history",
    path: "/class_history",
    component: ClassHistory,
  },
];

// Create Router
const router = new VueRouter({ mode: "history", routes });

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
  router,
}).$mount("#app");
