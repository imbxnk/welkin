import Vue from "vue";
import VueRouter from "vue-router";
import welkin from "../utils/auth";

Vue.use(VueRouter);

// Import All Routes
import Home from "../pages/dashboard/home/home";
import Profile from "../pages/dashboard/profile/profile";
import Settings from "../pages/dashboard/profile/settings";
import Manage from "../pages/dashboard/manage/manage";
import StudentList from "../pages/dashboard/students/students";
import ClassList from "../pages/dashboard/classlist/classlist";
import ClassHistory from "../pages/dashboard/classlist/class_history";
import ClassDetail from "../pages/dashboard/classlist/class_detail";
import Curriculum from "../pages/dashboard/curriculum/curriculum";
// Login Route
import Login from "../pages/login/login"

// Define All Routes
const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "student_list",
    path: "/student",
    component: StudentList,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "class_list",
    path: "/class",
    component: ClassList,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "profile",
    path: "/profile",
    component: Profile,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "settings",
        component: Settings,
      }
    ]
  },
  {
    name: "manage",
    path: "/manage/student",
    component: Manage,
    meta: {
      requiresAuth: true,
      authorizedGroup: ["coordinator"],
    },
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
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "Curriculum",
    path: "/curriculum",
    component: Curriculum,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "login",
    path: "/login",
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach(async (to, from, next) => {
  const currentUser = (await welkin.auth()).currentUser
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const authorizedGroup = to.meta.authorizedGroup

  try {
    if (requiresAuth && currentUser.group === "admin") return next();
  } catch (err) {
    console.log(err);
  }

  if (requiresAuth && !currentUser) router.push("/login")

  if (!requiresAuth && currentUser) router.push("/")

  if (requiresAuth && authorizedGroup) {
    if (!authorizedGroup.includes(currentUser.group)) return next("/")
    return next()
  }
  next()
  console.log(to, from, next)
});

export default router;
