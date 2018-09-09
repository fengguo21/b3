import * as api from './server';
import config from './commonConfig';

export const base = config.base;
// 每一个项目必定存在
export const getApp = params => api.get(`${base}/app/find`, params);
export const getAppId = params => api.get(`${base}/app/findAppId`, params);
export const getSessionId = params => api.get(`${base}/app/findToken`, params);
export const editApp = params => api.post(`${base}/app/update`, params);
export const editAppWeapp = params => api.post(`${base}/super/setupAppWeApp`, params);
export const editAppWepayFacilitator = params => api.post(`${base}/super/setupAppWepayFacilitator`, params);
export const editAppInvoice = params => api.post(`${base}/super/setupAppInvoice`, params);

// 获取应用菜单
export const getMenus = params => api.get(`${base}/app/findAppMenuAll`, params);
// 登录
export const requestLogin = params => api.post(`${base}/app/signIn`, params);
// 重设密码
export const requestResetPassword = params => api.post(`${base}/app/resetPassword`, params);
// 发送验证码
export const sendCode = params => api.post(`${base}/app/sendCode`, params);
// 修改密码
export const editPassword = params => api.post(`${base}/app/password`, params);
// 修改个人信息
export const updatePeople = params => api.post(`${base}/app/updatePeople`, params);

// 获取权限列表
export const getAnalyticsAll = params => api.get(`${base}/app/findAuthorityAll`, params);
// 获取统计信息
export const findTotalReport = params => api.get(`${base}/app/findTotalReport`, params);
export const findPeriodReport = params => api.get(`${base}/app/findPeriodReport`, params);
// 员工相关
export const getRoles = params => api.get(`${base}/app/findRoleList`, params);
export const createRole = params => api.post(`${base}/app/createRole`, params);
export const removeRole = params => api.post(`${base}/app/removeRole`, params);
export const editRole = params => api.post(`${base}/app/updateRole`, params);
// 房间相关
export const getRoom = params => api.get(`${base}/room/find`, params);
export const getRooms = params => api.get(`${base}/room/findList`, params);
export const getAllRooms = params => api.get(`${base}/room/findAll`, params);
export const addRoom = params => api.post(`${base}/room/create`, params);
export const editRoom = params => api.post(`${base}/room/update`, params);
export const removeRoom = params => api.post(`${base}/room/remove`, params);
// 用户相关
export const getPeople = params => api.get(`${base}/app/findPeople`, params);
export const getPeoples = params => api.get(`${base}/app/findPeopleList`, params);
// 会议相关
export const getConference = params => api.get(`${base}/conference/find`, params);
export const getConferences = params => api.get(`${base}/conference/findList`, params);
export const addConference = params => api.post(`${base}/conference/create`, params);
export const editConference = params => api.post(`${base}/conference/update`, params);
export const removeConference = params => api.post(`${base}/conference/remove`, params);
// 订单相关
export const getOrder = params => api.get(`${base}/order/find`, params);
export const getOrders = params => api.get(`${base}/order/findList`, params);
export const refundOrder = params => api.post(`${base}/order/refund`, params);
export const getOrderInvoiceXML = params => api.get(`${base}/order/findInvoiceXml`, params);
export const getPair = params => api.get(`${base}/order/findPair`, params);
export const finishOrder = params => api.post(`${base}/order/finish`, params);
export const exportOrderExcel = params => api.get(`${base}/order/findXlsx`, params);
// 日志相关
export const getLogs = params => api.get(`${base}/app/findLogList`, params);
// 团餐相关
export const getGroupon = params => api.get(`${base}/groupon/find`, params);
export const getGroupons = params => api.get(`${base}/groupon/findList`, params);
export const getAllGroupons = params => api.get(`${base}/groupon/findAll`, params);
export const addGroupon = params => api.post(`${base}/groupon/create`, params);
export const editGroupon = params => api.post(`${base}/groupon/update`, params);
export const removeGroupon = params => api.post(`${base}/groupon/remove`, params);
// 资金相关
export const getIncomes = params => api.get(`${base}/app/findIncomeList`, params);
export const getRefunds = params => api.get(`${base}/order/findRefundList`, params);
export const exportIncomeExcel = params => api.get(`${base}/app/findIncomeXlsx`, params);
export const exportRefundExcel = params => api.get(`${base}/app/findRefundXlsx`, params);
// 统计相关
export const getBriefReport = params => api.get(`${base}/app/findBriefReport`, params);

