import axios from 'axios';
import * as store from '../common/localStore';
import { wxLogin } from '@/common/initConfig'

const base = 'https://g2.huaqie.com/cloud';

const get = (cmd, params) => {
	params.sessionId = store.get('sessionId') || 'undefined';
	params.appId = store.appId;
	return axios.get(cmd, { params: params }).then(res => {
        if(res.data.code == 10001) {
            store.remove('logined');
            wxLogin();
            return;
        }
        return res.data;
    } )
}

const post = (cmd, params) => {
	params.sessionId = store.get('sessionId') || 'undefined';
	params.appId = store.appId;
	return axios.post(cmd, params).then(res => {
        if(res.data.code == 10001) {
            store.remove('logined');
            wxLogin();
            return;
        }
        return res.data;
    } )
}


// globel set
export const getSessionId = params => { return get(`${base}/account/sessionId`, params) }
export const getWechatConfig = params => { return get(`${base}/app/getWechatConfig`, params) }
export const getAuthUrl = params => { return get(`${base}/account/weWapAuthUrl`, params) }
// 上传微信文件
export const uploadWechatFile = params => { return post(`${base}/app/uploadWechatFile`, params) }
// 获取个人信息
export const getPeople = params => { return get(`${base}/people/findById`, params) }
export const signIn = params => { return post(`${base}/account/signInByWeWap`, params) }

// course
// 创建课程阅读学籍 POST ienglish/createCourse
// 参数：sessionId, appId, productId
export const createCourse = params => { return post(`${base}/ienglish/createCourse`, params) }
// 修改阅读课时或时长 POST ienglish/updateCourse
// 参数：sessionId, appId, feedId, index, step(1，2，3，阅读状态，可选)，time(阅读时间，可选)
export const updateCourse = params => { return post(`${base}/ienglish/updateCourse`, params) }
// 获取课程类别 free:[1:免费，2:收费]
export const getCourseList = params => { return get(`${base}/product/frontFindByState`, params) }
// 购买课程 productId
export const buyCourse = params => { return post(`${base}/order/createCourse`, params) }
//获取课程阅读信息 productId
export const getCourseById = params => { return get(`${base}/ienglish/frontFindCourseById`, params) }
// 获取语音评论  feedId, index(课时编号), page, size
export const getAudios = params => { return get(`${base}/ienglish/frontFindCommentByState`, params) }
// 提交语音评论  feedId, index(课时编号), audio(语音地址) Array
export const commitAudios = params => { return post(`${base}/ienglish/comment`, params) }
// 获取老师推荐 page, size
export const getRecommendList = params => { return get(`${base}/ienglish/frontFindRecommendByState`, params) }
// 获取轮播
export const getBanner = params => { return get(`${base}/advertise/findByState`, params) }

// 文章相关

// 获取文章 feedId
export const getArticleById = params => { return get(`${base}/ienglish/findArticleById`, params) }
// 获取文章列表 group:[1,2,3,4], page, size
export const getArticleList = params => { return get(`${base}/ienglish/findArticleByState`, params) }

// 个人相关

// 修改个人信息
export const updateUser = params => { return post(`${base}/people/update`, params) }
// 上传头像
export const uploadAvatar = params => { return post(`${base}/app/upload`, params) }

// 支付
export const charge = params => { return post(`${base}/order/createCharge`, params) }


