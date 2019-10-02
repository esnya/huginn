import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:timerSetId',
      name: 'timer-set',
      component: () =>
        import(/* webpackChunkName: "timer-set" */ './views/TimerSet.vue'),
    },
    {
      path: '/:timerSetId/auth',
      name: 'timer-set-auth',
      component: () =>
        import(
          /* webpackChunkName: "timer-set-auth" */ './views/TimerSetAuth.vue'
        ),
    },
    {
      path: '*',
      name: 'not-found',
      component: () =>
        import(/* webpackChunkName: "not-found" */ './views/NotFound.vue'),
    },
  ],
});
