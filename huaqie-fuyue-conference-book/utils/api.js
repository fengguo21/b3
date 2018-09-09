import http from './configs/apiConfig.js';

// 获取token 参数：appId
export const getToken = parmas => http.get('app/findToken', params);
// 获取token 参数：appId 同getToken减少
export const getSessionId = params => http.get('app/findToken', params);
// 用户登录
export const wxLogin = params => http.post('app/signInByWeApp', params);
// 获取用户信息
export const getPeople = params => http.get('people/findById', params);
// 获取系统信息：GET app/findById
export const getAppMsg = params => http.get('app/find', params);
// 获取会议信息 参数：token appId conferenceId
export const getMeeting = params => http.get('conference/find', params);
// 获取团餐信息 grouponId
export const getMeal = params => http.get('groupon/find', params);
// 通过peopleId获取团餐信息
export const getMealById = params => http.get('order/findPeopleLastGroupon', params);
// ------- 提交订房订单：
//   POST order/create
// 参数：
//   token
//   appId
//   roomId，房间Id
//   conferenceId，会议Id
//   name,姓名
//   identityId,身份证号
//   tel,手机号
//   sex,性别：1：男，2:女
//   dates,arr
export const postRoom = params => http.post('order/create', params);
// ------- 参加团餐：
// 	POST groupon/join
// 参数：
// 	token
// 	appId
// 	grouponId
export const jionMeal = params => http.post('order/createGroupon', params);
// ------- 提交团餐订单：
//   POST order/createGroupon
// 参数：
//   token
//   appId
//   conferenceId，会议Id
export const postMeal = params => http.post('order/createGroupon', params);
// 获取最近订单
export const getNewOrder = params => http.get('order/findPeopleLast', params);
// 通过orderId获取订单
export const getOrder = params => http.get('order/find', params);
// ------- 支付订单：
//   POST order/payment
// 参数：
//   token
//   appId
//   orderId,订单Id
//   channel，支付方式，WEPAY_WIDGET
export const payOrder = params => http.post('order/payment', params);
// 填写发票
// orderId
// title 公司名
// taxtNo 账号
// address 地址
// tel 电话
// bank 开户银行
// account 开户账号
// typehood 1电子 2纸质
// email 
export const createInvioce = params => http.post('order/createInvoice', params);
