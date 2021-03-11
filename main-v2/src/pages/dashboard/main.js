import Vue from 'vue';
import App from './App.vue';
import vuetify from '../../plugins/vuetify';
import VueRouter from "vue-router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import VueAxios from "vue-axios";

// Import All Routes
import Home from "./home/home";
import AddStudents from "./manage/add_students";
import Profile from "./profile/profile";
import ImportStudents from "./manage/import_students";

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
    name: "import_files",
    path: "manage/students/import",
    component: ImportStudents,
  }
]

// Create Router
const router = new VueRouter({ mode: "history", routes });


// async function isAuth() {
//   let query = `
//     query {
//       me { username }
//     }
//   `
//   console.log('check')
//   await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
//     .then(res => {
//       console.log(res)
//     })
//     .catch(err => {
//       console.log(err)
//       return false
//     })
//   console.log('check2')
//   return true
// }

// router.beforeEach((to, from, next) => {
//   if (isAuth()) {
//     console.log('Welcome')
//     next()
//   }
//   console.log('Not logged in yet')
//   window.location.href = "/login";
// });


// router.beforeEach(async (to, from, next) => {
//   // var query = `
//   //   query {
//   //       me {
//   //           username
//   //           given_name
//   //           family_name
//   //           group
//   //       }
//   //   }
//   // `
//   // let user = await axios.post(process.env.APP_VUE_GRAPHQL_URL, { query }, { withCredentials : true })
//   // if(!user.data.data.username) {
//   //   return window.location.href = "/login";
//   // }
//   // console.log(user.data.data)
//   // await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials : true }).then(res => { console.log(res) }).catch( err => { console.log(err) } )
//   console.log({...to})
//   console.log({...from})
//   next();
// })

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App),
  router,
}).$mount('#app')