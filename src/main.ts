import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.min.css';
import router from './router';

if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app');
