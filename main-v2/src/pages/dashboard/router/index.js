import Vue from "vue"
import VueRouter from 'vue-router'
import welkin from "../../../utils/auth"

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
    meta: {
      requiresAuth: true,
    }
  },
  {
    name: "student_list",
    path: "/student",
    component: StudentList,
    meta: {
      requiresAuth: true,
    }
  },
  {
    name: "class_list",
    path: "/class",
    component: ClassList,
    meta: {
      requiresAuth: true,
    }
  },
  {
    name: "profile",
    path: "/profile",
    component: Profile,
    meta: {
      requiresAuth: true,
    }
  },
  {
    name: "manage",
    path: "/manage/student",
    component: Manage,
    meta: {
      requiresAuth: true,
      authorizedGroup: [
        'coordinator'
      ]
    }
  },
  {
    name: "class_history",
    path: "/class_history",
    component: ClassHistory
  },
  {
    name: "class_detail",
    path: "/class/:code",
    component: ClassDetail,
    meta: {
      requiresAuth: true,
    }
  },
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach(async (to, from, next) => {
  const currentUser = (await welkin.auth()).currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const authorizedGroup = to.meta.authorizedGroup
  console.log(authorizedGroup)
  console.log(requiresAuth)
  console.log(currentUser.group)
  if(currentUser.group === 'admin') next()

  if(requiresAuth && !currentUser) window.location.replace("/login")

  if(requiresAuth && authorizedGroup) {
    console.log('true')
    if(!authorizedGroup.includes(currentUser.group)) next('/')
    next()
  }

  next()
  console.log(to, from ,next)
  
})

export default router