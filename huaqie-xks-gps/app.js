import * as store from './utils/store.js';
import { getSessionId, wxLogin, getAppMsg } from './utils/api.js';

App({
  globalData: {
    salesPeopleId: '',
  },
  onLaunch(options) {
  },
  onShow() {
    this.getSession()
  },
// 登录认证相关
  getSession() {
    return getSessionId({}).then((res) => {
      // console.log('sessionId', res);
      store.set('sessionId', res);
      return new Promise((resolve) => {
        resolve(res);
      });
    })
  },
 });