import moment from './moment';

// 正则判断是否为正确的手机号
export const isPhone = (phone) => {
  const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[3678])[0-9]{8}$/;
  return reg.test(phone);
};
// 校验身份证
export const isIdCard = (cardId) => {
  const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$)$/;
  return reg.test(cardId);
};
// 格式化秒数
export const convertTimeHHMMSS = (val) => {
  let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
  return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
}
// 格式化数字统计
export const formatNumber = (data) => {
  const strNum = String(data);
  switch(strNum.length) {
    case 1: ;
    case 2: ;
    case 3: return strNum;break;
    case 4: return `${strNum.slice(0, 1)}千`;break;
    case 5: return `${strNum.slice(0, 1)}万`;break;
    case 6: return `十万+`;break;
  }
}
/**
 * 计算日期差
 * @param {String} start must be a date
 * @param {String} end must be a date
 */ 
export const diffDate = (start, end) => {
  const diff = moment(start).valueOf() - moment(end).valueOf();
  const diffAbs = Math.abs(diff);
  const progress = moment.duration(diffAbs / 1000, 'seconds')._data.days;
  return progress + 1;
};
/**
 * 对日期进行加法
 * @param {String} startTime
 * @param {Number} days 
 * @param {String} style 
 */
export const dateAdd = (startTime, days, style) => moment(startTime).add({d: days}).format(style || 'YYYY-MM-DD');
/**
 * Object.values
 * @param {Object} obj 
 */ 
export const objValues = (obj) => {
  const _VALUES = [];
  for (const key in obj) {
    _VALUES.push(obj[key]);
  }
  return _VALUES;
};