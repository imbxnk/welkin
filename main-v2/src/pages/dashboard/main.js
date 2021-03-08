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
  }
]

// Create Router
const router = new VueRouter({ mode: "history", routes });

router.beforeEach(async (to, from, next) => {
  // var query = `
  //   query {
  //       me {
  //           username
  //           given_name
  //           family_name
  //           group
  //       }
  //   }
  // `
  // let user = await axios.post(process.env.APP_VUE_GRAPHQL_URL, { query }, { withCredentials : true })
  // if(!user.data.data.username) {
  //   return window.location.href = "/login";
  // }
  // console.log(user.data.data)
  // await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials : true }).then(res => { console.log(res) }).catch( err => { console.log(err) } )
  console.log({...to})
  console.log({...from})
  next();
})

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App),
  router,
}).$mount('#app')
