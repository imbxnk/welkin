import Vue from "vue";
import VueRouter from "vue-router";
import welkin from "../utils/auth";

Vue.use(VueRouter);

// Import All Routes
import Home from "../pages/dashboard/home/home";
import Profile from "../pages/dashboard/profile/profile";
import MyProfile from "../pages/dashboard/profile/components/myProfile"
import AccountSettings from "../pages/dashboard/profile/components/accountSettings"
import ChangePassword from "../pages/dashboard/profile/components/changePassword"
import ManageStudents from "../pages/dashboard/manage/manage_students";
import StudentList from "../pages/dashboard/students/students";
import MyAdvisees from "../pages/dashboard/students/my_advisees";
import StudentRecord from "../pages/dashboard/students/std_record";
import SearchStudent from "../pages/dashboard/students/search_student";
import CourseList from "../pages/dashboard/courselist/courselist";
import CourseDetail from "../pages/dashboard/courselist/course_detail";
import Curriculum from "../pages/dashboard/curriculum/curriculum";
import Manage_grade from "../pages/dashboard/manage/manage_grade";
import AddInstructor from "../pages/dashboard/manage/add_instructor";
import AddUser from "../pages/dashboard/manage/add_user";
import AddStudent from "../pages/dashboard/manage/add_students"
// Auth Route
import Login from "../pages/auth/login";
import PasswordRecovery from "../pages/auth/passwordRecovery"
import PasswordReset from "../pages/auth/passwordReset"

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
    name: "search_student",
    path: "/students/search",
    component: SearchStudent,
    meta: {
      requiresAuth: true,
      title: "Search Student",
    }
  },
  {
    name: "student_list",
    path: "/students/all",
    component: StudentList,
    meta: {
      requiresAuth: true,
      title: "Student List",
      authorizedGroup: ["program director", "coordinator"]
    },
  },
  {
    name: "student_advisee",
    path: "/students/advisee",
    component: MyAdvisees,
    meta: {
      requiresAuth: true,
      title: "My Advisees",
      isAdvisor: true,
    },
  },
  {
    name: "student_record",
    path: "/student/:sid",
    component: StudentRecord,
    meta: {
      requiresAuth: true,
      title: "Student Record",
    },
  },
  {
    name: "Course_list",
    path: "/course",
    component: CourseList,
    meta: {
      requiresAuth: true,
      title: "Course List",
    },
  },
  {
    path: "/profile",
    component: Profile,
    meta: {
      requiresAuth: true,
      title: "My Profile",
    },
    children: [
      {
        name: "MyProfile",
        path: "",
        component: MyProfile
      },
      {
        name: "AccountSettings",
        path: "settings",
        component: AccountSettings
      },
      {
        name: "ChangePassword",
        path: "security",
        component: ChangePassword
      }
    ]
  },
  {
    name: "add_student",
    path: "/manage/student/add",
    component: AddStudent,
    meta: {
      requiresAuth: true,
      authorizedGroup: ["coordinator"],
      title: "Student Management",
    },
  },
  {
    name: "manage_grade",
    path: "/manage/student/grade/upload",
    component: Manage_grade,
    meta: {
      requiresAuth: true,
      authorizedGroup: ["coordinator"],
      title: "Upload Grade",
    },
  },
  {
    name: "add_instructor",
    path: "/manage/instructor/add",
    component: AddInstructor,
    meta: {
      requiresAuth: true,
      authorizedGroup: ["coordinator"],
      title: "Add Instructor",
    },
  },
  {
    name: "add_user",
    path: "/manage/user/add",
    component: AddUser,
    meta: {
      requiresAuth: true,
      title: "Add User",
      authorizedGroup: ["coordinator"],
    },
  },
  {
    name: "course_detail",
    path: "/course/:code",
    component: CourseDetail,
    meta: {
      requiresAuth: true,
      title: "Course Detail",
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
    name: "reset_password",
    path: "/accounts/reset/password",
    component: PasswordReset,
    meta: {
      requiresAuth: false,
      title: "Request Password Recovery"
    }
  },
  {
    name: "recovery_password",
    path: "/accounts/recovery",
    component: PasswordRecovery,
    meta: {
      requiresAuth: false,
      title: "Password Recovery"
    }
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
  const isAdvisor = to.matched.some((record) => record.meta.isAdvisor);
  const authorizedGroup = to.meta.authorizedGroup;

  if (currentUser) {
    Vue.prototype.$currentUser = currentUser;
    Vue.prototype.$currentUser.initials = currentUser.given_name.charAt(0) + currentUser.family_name.charAt(0);
    Vue.prototype.$currentUser.isAuth = true;
  } else {
    Vue.prototype.$currentUser.isAuth = false;
  }

  // ADMIN CAN ACCESS EVERY PAGE
  try {
    if (requiresAuth && currentUser.group === "admin") return next();
  } catch (err) {}

  if (requiresAuth && !currentUser) return next("/login");

  if (!requiresAuth && currentUser) return next("/");

  if (requiresAuth && isAdvisor) {
    if (!currentUser.isAdvisor) return next("/");
  }

  if (requiresAuth && authorizedGroup) {
    if (!authorizedGroup.includes(currentUser.group)) return next("/");
  }

  next();
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    document.title = to.meta.title ? to.meta.title : "Welkin";
  });
});

export default router;
