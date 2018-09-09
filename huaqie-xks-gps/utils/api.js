import http from './configs/apiConfig.js';

// 获取session
export const getSessionId = params => http.get('account/sessionId', params);
// 用户登录
export const wxLogin = params => http.post('account/signInByWeApp', params);
// 获取用户信息
export const getPeople = params => http.get('people/findById', params);
// 获取系统信息：GET app/findById
export const getAppMsg = params => http.get('app/findById', params);
// 创建车辆
export const creatVehicle = params => http.post('gps/create', params);
// 获取班车列表
export const getBusList = params => http.get('gps/findByState', params);
// 删除车辆
export const deleteVehicle = params => http.post('gps/remove', params);
// 修改车辆
export const updateVehicle = params => http.post('gps/update', params);
// 创建路线
export const createLine = params => http.post('gps/createLine', params);
// 获取路线
export const getLine = params => http.get('gps/findLineByState', params);
// 删除路线
export const removeLine = params => http.post('gps/removeLine', params);
// 修改路线
export const updateLine = params => http.post('gps/updateLine', params);
// 获取时刻表
export const getSchedule = params => http.get('gps/findScheduleByState', params);
