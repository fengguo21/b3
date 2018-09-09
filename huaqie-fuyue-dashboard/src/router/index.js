import Vue from 'vue';
import Router from 'vue-router';
import lazy from '@/utils/sdk/lazy';
import * as store from '@/utils/sdk/store';

/* eslint-disable */
const getImage = name => require(`@/assets/images/icon-manage-${name}.png`);
/* eslint-enable */

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: lazy('home'),
      leaf: true,
      redirect: { path: 'menus/page1000' },
      children: [
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1000',
          name: 'page1000',
          icon: getImage('total'),
          component: lazy('menus/page1000'),
          meta: { name: '概览' },
        },
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1001',
          name: 'page1001',
          icon: getImage('user'),
          component: lazy('menus/page1001'),
          meta: { name: '用户管理' },
        },
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1002',
          name: 'page1002',
          icon: getImage('room'),
          component: lazy('menus/page1002'),
          meta: { name: '客房管理' },
        },
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1003',
          name: 'page1003',
          icon: getImage('meeting'),
          component: lazy('menus/page1003'),
          meta: { name: '会议管理' },
        },
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1004',
          name: 'page1004',
          icon: getImage('order'),
          component: lazy('menus/page1004'),
          meta: { name: '订单管理' },
        },
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1005',
          name: 'page1005',
          icon: getImage('meal'),
          component: lazy('menus/page1005'),
          meta: { name: '团餐管理' },
        },
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1006',
          name: 'page1006',
          icon: getImage('money'),
          component: lazy('menus/page1006'),
          meta: { name: '资金管理' },
        },
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1007',
          name: 'page1007',
          icon: getImage('role'),
          component: lazy('menus/page1007'),
          meta: { name: '员工管理' },
        },
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1008',
          name: 'page1008',
          icon: getImage('log'),
          component: lazy('menus/page1008'),
          meta: { name: '日志管理' },
        },
        {
          leaf: true, // 只有一个节点
          path: 'menus/page1009',
          name: 'page1009',
          icon: getImage('system'),
          component: lazy('menus/page1009'),
          meta: { name: '系统配置' },
        },
        {
          hidden: true,
          path: 'menus/*',
          name: 'menuError404',
          meta: { name: '页面丢啦~~' },
          component: lazy('error404'),
        },
      ],
    },
    {
      hidden: true,
      path: '/login',
      component: lazy('login/loginInfo'),
      children: [
        {
          path: '',
          name: 'login',
          component: lazy('login/login'),
        },
        {
          path: 'reset',
          name: 'resetPassword',
          component: lazy('login/resetPassword'),
        },
      ],
    },
    {
      hidden: true,
      path: '*',
      name: 'error404',
      component: lazy('error404'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  // NProgress.start();
  if (to.path === '/login') {
    store.remove('user');
    store.remove('app');
    store.remove('sessionId');
  }
  const user = store.get('user');
  if (!user && to.path !== '/login' && to.path !== '/login/reset') {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;
