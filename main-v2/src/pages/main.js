import Vue from "vue";
import App from "./App.vue";
import vuetify from "../plugins/vuetify";
import router from "../router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import VueAxios from "vue-axios";

// Import firebase
import firebase from 'firebase'
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
firebase.analytics();

// Import Bootstrap an BootstrapVue CSS files
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
//Import Apexchart
import VueApexCharts from "vue-apexcharts";

// Use BootstrapVue
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

//Use Apexchart
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
// Use Axios
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
  router,
}).$mount("#app");
