import Vue from 'vue'
import Router from 'vue-router'
import * as store from '@/common/localStore'
import { wxLogin } from '@/common/initConfig'
import { getSessionId } from '@/api/api'

Vue.use(Router)

const loading = resolve => require(['@/pages/load'], resolve);
const loadDb = resolve => require(['@/pages/loadDb'], resolve);
const share = resolve => require(['@/pages/share'], resolve);
const introduce = resolve => require(['@/pages/introduce'], resolve);

const mineIndex = resolve => require(['@/pages/mine/index'], resolve);
const mineAward = resolve => require(['@/pages/mine/award/index'], resolve);
const mineMsg = resolve => require(['@/pages/mine/message/index'], resolve);
const minePlan = resolve => require(['@/pages/mine/plan/index'], resolve);
const mineStar = resolve => require(['@/pages/mine/star/index'], resolve);

const projectIndex = resolve => require(['@/pages/project/index'], resolve);
const projectBuy = resolve => require(['@/pages/project/buy-course/index'], resolve);
const projectIntro = resolve => require(['@/pages/project/introduction/index'], resolve);
const projectList = resolve => require(['@/pages/project/read-list/index'], resolve);
const projectDetail = resolve => require(['@/pages/project/read-detail/index'], resolve);
const projectShared = resolve => require(['@/pages/project/share-detail/index'], resolve);

const materialIndex = resolve => require(['@/pages/material/index'], resolve);
const materialRead = resolve => require(['@/pages/material/read-detail/index'], resolve);
const materialCourse = resolve => require(['@/pages/material/course-list/index'], resolve);
const materialArlist = resolve => require(['@/pages/material/article-list/index'], resolve);
const materialArdetail = resolve => require(['@/pages/material/article-detail/index'], resolve);

const noCheckList = [
    '/',
    '/load',
    '/project',
    '/material',
    '/material-read',
    '/material-course',
    '/material-arlist',
    '/material-ardetail',
];

const router = new Router({
    routes: [{
            path: '/',
            name: 'index',
            component: loading
        }, {
            path: '/load',
            name: 'loading',
            component: loadDb
        }, {
            path: '/share',
            name: 'share',
            component: share
        }, {
            path: '/introduce',
            name: 'introduce',
            component: introduce
        },
        // 我的
        {
            path: '/mine',
            name: 'mineIndex',
            component: mineIndex
        }, {
            path: '/mine-award',
            name: 'mineAward',
            component: mineAward
        }, {
            path: '/mine-message',
            name: 'mineMsg',
            component: mineMsg
        }, {
            path: '/mine-plan',
            name: 'minePlan',
            component: minePlan
        }, {
            path: '/mine-star',
            name: 'mineStar',
            component: mineStar
        },
        // 精读计划
        {
            path: '/project',
            name: 'projectIndex',
            component: projectIndex
        }, {
            path: '/project-intro',
            name: 'projectIntro',
            component: projectIntro
        }, {
            path: '/project-list',
            name: 'projectList',
            component: projectList
        }, {
            path: '/project-detail',
            name: 'projectDetail',
            component: projectDetail
        }, {
            path: '/project-buy',
            name: 'projectBuy',
            component: projectBuy
        }, {
            path: '/project-share',
            name: 'projectShared',
            component: projectShared
        },
        // 免费资料
        {
            path: '/material',
            name: 'materialIndex',
            component: materialIndex
        }, {
            path: '/material-read',
            name: 'materialRead',
            component: materialRead
        }, {
            path: '/material-course',
            name: 'materialCourse',
            component: materialCourse
        }, {
            path: '/material-arlist',
            name: 'materialArlist',
            component: materialArlist
        }, {
            path: '/material-ardetail',
            name: 'materialArdetail',
            component: materialArdetail
        },
    ]
})

const fn = async(next) => {
    await wxLogin();
    next();
}
router.beforeEach((to, from, next) => {
    if (to.path !== '/' && to.path !== '/load') {
        store.set('router', { path: to.path, query: to.query });
    }
    if (!store.get('sessionId')) {
        getSessionId({}).then(res => {
            if (res.code === 0) {
                store.set('sessionId', res.data)
            }
        })
    }
    if (noCheckList.indexOf(to.path) < 0) {
        fn(next);
    } else {
        next();
    }
})



export default router
