import Vue from "vue";
import App from "./App.vue";
import vuetify from "../plugins/vuetify";
import router from "../router";

// Import Bootstrap
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Import Axios
import axios from "axios";
import VueAxios from "vue-axios";

// Import firebase
import firebase from 'firebase/app'
import 'firebase/auth'

var firebaseConfig = {
  apiKey: "AIzaSyAu5EqqCHUxNeS_-oXsp3ISgdBk-5z8YDo",
  authDomain: "welkin-d9b90.firebaseapp.com",
  projectId: "welkin-d9b90",
  storageBucket: "welkin-d9b90.appspot.com",
  messagingSenderId: "305194504139",
  appId: "1:305194504139:web:dcfc7a5ab70b8bc3a9f04e",
  measurementId: "G-4C2RBJ6T8N"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// Import Bootstrap an BootstrapVue CSS files
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Import Apexchart
import VueApexCharts from "vue-apexcharts";

// Import Moment.js
import moment from "moment";

// Use BootstrapVue
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

//Use Apexchart
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

// Use Axios
Vue.use(VueAxios, axios);

// Use Moment
Vue.prototype.moment = moment

// GLOBAL VARIABLE
var currentUser = Vue.observable({ user: {} })
Object.defineProperty(Vue.prototype, '$currentUser', {
  get () {
    return currentUser.user
  },
  set (value) {
    currentUser.user = value
  }
})

// GLOBAL VARIABLE
var config = Vue.observable({ current: {} })
Object.defineProperty(Vue.prototype, '$config', {
  get () {
    return config.current
  },
  set (value) {
    config.current = value
  }
})

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
  router,
}).$mount("#welkin");
