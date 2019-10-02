import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.min.css';
import router from './router';

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app');
