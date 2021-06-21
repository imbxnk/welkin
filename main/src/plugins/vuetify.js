import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#3c84fb',
        accent: '#3c84fb',
      },
    },
  },
})

export default vuetify;
