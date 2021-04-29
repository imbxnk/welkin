import Vue from "vue";
import App from "./App.vue";
import vuetify from "../plugins/vuetify";
import router from "../router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import VueAxios from "vue-axios";

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
