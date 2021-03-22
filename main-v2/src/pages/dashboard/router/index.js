import Vue from "vue"
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Import All Routes
import Home from "../home/home"
import Profile from "../profile/profile"
import Manage from "../manage/manage"
import StudentList from "../students/students"
import ClassList from "../classlist/classlist"
import ClassHistory from "../classlist/class_history"
import ClassDetail from "../classlist/class_detail"

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
    name: "profile",
    path: "/profile",
    component: Profile,
  },
  {
    name: "manage",
    path: "/manage/student",
    component: Manage
  },
  {
    name: "class_history",
    path: "/class_history",
    component: ClassHistory,
  },
  {
    name: "class_detail",
    path: "/class/:code",
    component: ClassDetail,
  },
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router