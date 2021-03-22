import Vue from 'vue';
import App from './App.vue';
import vuetify from '../../plugins/vuetify';
import VueRouter from "vue-router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import VueAxios from "vue-axios";

// Import All Routes
import Login from "./login/login";

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
    name: "login",
    path: "/login",
    component: Login,
  },
]

// Create Router
const router = new VueRouter({ mode: "history", routes });

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App),
  router
}).$mount('#app')