import Vue from "vue";
import VueRouter from "vue-router";
import welkin from "../utils/auth";

Vue.use(VueRouter);

// Import All Routes
import Home from "../pages/dashboard/home/home";
import Profile from "../pages/dashboard/profile/profile";
import Settings from "../pages/dashboard/profile/settings";
import ManageStudents from "../pages/dashboard/manage/manage_students";
import StudentList from "../pages/dashboard/students/students";
import ClassList from "../pages/dashboard/classlist/classlist";
import ClassHistory from "../pages/dashboard/classlist/class_history";
import ClassDetail from "../pages/dashboard/classlist/class_detail";
import Curriculum from "../pages/dashboard/curriculum/curriculum";
import Manage_grade from "../pages/dashboard/manage/manage_grade";
import AddInstructor from "../pages/dashboard/manage/add_instructor";
// Login Route
import Login from "../pages/login/login";

// Define All Routes
const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
    meta: {
      requiresAuth: true,
      title: "Dashboard",
    },
  },
  {
    name: "student_list",
    path: "/students/allstudents",
    component: StudentList,
    meta: {
      requiresAuth: true,
      title: "Student",
    },
  },
  {
    name: "course_list",
    path: "/course",
    component: ClassList,
    meta: {
      requiresAuth: true,
      title: "Course",
    },
  },
  {
    name: "profile",
    path: "/profile",
    component: Profile,
    meta: {
      requiresAuth: true,
      title: "Profile",
    },
    children: [
      {
        path: "settings",
        component: Settings,
        meta: {
          title: "Settings",
        },
      },
    ],
  },
  {
    name: "add_student",
    path: "/manage/student/addstudents",
    component: ManageStudents,
    meta: {
      requiresAuth: true,
      authorizedGroup: ["coordinator"],
      title: "Student Management",
    },
  },
  {
    name: "manage_grade",
    path: "/manage/student/addgrade",
    component: Manage_grade,
    meta: {
      requiresAuth: true,
      authorizedGroup: ["coordinator"],
      title: "Upload Grade",
    },
  },
  {
    name: "add_instructor",
    path: "/manage/addinstructor",
    component: AddInstructor,
    meta: {
      requiresAuth: true,
      authorizedGroup: ["coordinator"],
      title: "Add Instructor",
    },
  },
  {
    name: "class_history",
    path: "/class_history",
    component: ClassHistory,
    meta: {
      requiresAuth: true,
      title: "Class History",
    },
  },
  {
    name: "class_detail",
    path: "/class/:code",
    component: ClassDetail,
    meta: {
      requiresAuth: true,
      title: "Class Detail",
    },
  },
  {
    name: "Curriculum",
    path: "/curriculum",
    component: Curriculum,
    meta: {
      requiresAuth: true,
      title: "Curriculum",
    },
  },
  {
    name: "login",
    path: "/login",
    component: Login,
    meta: {
      requiresAuth: false,
      title: "Login",
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach(async (to, from, next) => {
  const currentUser = (await welkin.auth()).currentUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const authorizedGroup = to.meta.authorizedGroup;

  try {
    if (requiresAuth && currentUser.group === "admin") return next();
  } catch (err) {}

  if (requiresAuth && !currentUser) router.push("/login");

  if (!requiresAuth && currentUser) router.push("/");

  if (requiresAuth && authorizedGroup) {
    if (!authorizedGroup.includes(currentUser.group)) return next("/");
    return next();
  }
  next();
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    document.title = to.meta.title ? to.meta.title : "Welkin";
  });
});

export default router;
