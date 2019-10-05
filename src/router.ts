import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const TimerSet = (): Promise<typeof import('*.vue')> =>
  import(/* webpackChunkName: "timer-set" */ './views/TimerSet.vue');
const TimerSetHome = (): Promise<typeof import('*.vue')> =>
  import(/* webpackChunkName: "timer-set-home" */ './views/timer-set/Home.vue');
const TimerSetJoin = (): Promise<typeof import('*.vue')> =>
  import(/* webpackChunkName: "timer-set-join" */ './views/timer-set/Join.vue');
const TimerSetEdit = (): Promise<typeof import('*.vue')> =>
  import(/* webpackChunkName: "timer-set-edit" */ './views/timer-set/Edit.vue');
const NotFound = (): Promise<any> =>
  import(/* webpackChunkName: "not-found" */ './views/NotFound.vue');

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:id',
      name: 'timer-set',
      component: TimerSet,
      children: [
        {
          path: '',
          name: 'timer-set-home',
          component: TimerSetHome,
        },
        {
          path: 'join',
          name: 'timer-set-join',
          component: TimerSetJoin,
          meta: {
            allowNull: true,
          },
        },
        {
          path: 'edit',
          name: 'timer-set-edit',
          component: TimerSetEdit,
        },
      ],
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound,
    },
  ],
});
