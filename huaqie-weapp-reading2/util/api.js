import http from './apiConfig.js';

// 获取session
export const getSessionId = params => http.get('account/sessionId', params);
// 用户登录
export const wxLogin = params => http.post('account/signInByWeApp', params);
// 获取用户信息
export const getPeople = params => http.get('people/findById', params);
// 获取分类：GET dsh/frontFindCatalogByState
// 参数：sessionId, appId, page, size
export const getCatalog = params => http.get('dsh/frontFindCatalogByState', params);
// 获取书本列表 GET dsh/findBookByState
// 参数：sesssionId，appId, page, size, catalog
export const getBookList = params => http.get('dsh/findBookByState', params);
// 获取单个书本 GET dsh/findBookById
// 参数：sessionId, appId, productId
export const getBookById = params => http.get('dsh/findBookById', params);
// 获取图文书本列表 GET dsh/findArticleByState
// 参数：sesssionId，appId, page, size
export const getArticleList = params => http.get('dsh/findArticleByState', params);
// 获取图文书本列表 GET dsh/findArticleById
// 参数：sesssionId，appId, productId
export const getArticleById = params => http.get('dsh/findArticleById', params);
// 发表评论 POST dsh/createComment
// 参数：sessionId, appId, productId, text
export const sendComment = params => http.post('dsh/createComment', params);
// 获取所有评论：GET dsh/findCommentByState
// step=1表示尚未审核，step=2表示已审核
// 参数：sessionId, appId, productId(获取书本所有评论必填), peopleId（获取用户所有评论必填）
export const getComment = params => http.get('dsh/findCommentByState', params);
// 购买书本：POST dsh/createBookOrder
// 参数：sessionId, appId, productId
export const buyBook = params => http.post('dsh/createBookOrder', params);
// 购买VIP：POST dsh/createVipOrder
// 参数：sessionId, appId, title
export const openVip = params => http.post('dsh/createVipOrder', params);
// 获取VIP配置：GET app/findById
// 参数：sessionId, appId
export const getVipConfig = params => http.get('app/findById', params);
// 获取轮播图：GET advertise/findByState
// 参数：sessionId, appId, page, size
// 返回：mode: 1:活动，2:优惠券
export const getBanner = params => http.get('advertise/findByState', params);
// 获取可领取的优惠券列表 GET coupon/findByState
// 参数：sessionId, appId, page, size
export const getCanCouponList = params => http.get('coupon/findByState', params);
// 获取单个优惠券 GET coupon/findById
// 参数：sessionId, appId, couponId
export const getCouponById = params => http.get('coupon/findById', params);
// 领取优惠券 POST coupon/fetch
// 参数：sessionId, appId, couponId
export const fetchCoupon = params => http.post('coupon/fetch', params);
// 获取领取的优惠券 GET coupon/frontFindRecordByState
// 参数：sessionId, appId, page, size, overdue(1:已过期，可不甜),used(1:使用过，可不填,0:未使用，可不填)
export const getCouponList = params => http.get('coupon/frontFindRecordByState', params);
// 阅读书本 POST dsh/readBook
// 参数：sessionId, appId, productId, audioIndex(语音列表编号，从0开始), audioTime（已阅读时长）

// 个人的阅读信息存放在people 的 extra.books下面，可通过GET people/findById 获取
export const readBook = (params, showLoading) => http.post('dsh/readBook', params, showLoading);
// 获取某本书的阅读信息：frontFindMyReading
// 参数：sessionId, appId, productId
export const getBookReadMsg = params => http.get('dsh/frontFindMyReading', params);
// 获取自己阅读过的书籍：GET frontFindMyBookByState
// 参数：sessionId, appId, page, size
export const getCanReadBook = params => http.get('dsh/frontFindMyBookByState', params);






