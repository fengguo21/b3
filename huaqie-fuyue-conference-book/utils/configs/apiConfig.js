import { base } from './authConfig.js';
import * as store from '../store.js';

const get = (path, params, showToast) => {
  const showToaster = showToast || true;
  const newParams = { ...params };
  const token = store.get('sessionId');
  // console.log('token:: ===== ::', token);
  if (token) {
    newParams.token = store.get('sessionId');
  }
  newParams.appId = store.appId;

  if (showToaster) {
    wx.showLoading({
      title: '正在加载...',
      mask: true,
    })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        wx.hideLoading();
        if (res && !res.data.code) {
          resolve(res.data.data);
        } else {
          if (res.data.code == 20004 || res.data.code == 20001){
            store.set('sessionId', '');
            store.set('peopleId', '');
            store.set('me', '');
            get('app/findToken', {}, (res) => {
              store.set('sessionId', res);
            });

            wx.showModal({
              title: '小提示',
              content: res.data.code == 20004 ? '登录已过期，请重新登录' : '您的账号已在其他地方登陆，无法正常使用小程序，请重新登录',
              confirmColor: '#be342a',
              showCancel: false,
              success: () => {
                getApp().auth(()=>{
                  let route = 'pages/index/index';
                  let uri = '';
                  let query;
                  if (store.get('currentRoute')) {
                    const router = store.get('currentRoute');
                    route = router.currentRoute;
                    const options = router.currentOptions;
                    for(const key in options) {
                      query += `&${key}=${options[key]}`;
                    }
                    query = query ? query.substring(1) : '';
                  }
                  uri = query ? `/${route}?${query}` : `/${route}`;
                  // console.log(query);
                  wx.redirectTo({
                    url: uri,
                  });
                });
              },
            });
            reject();
            return;
          }
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#be342a',
            showCancel: false,
          });
          reject();
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络出错',
          image: '/images/timeout.png',
          mask: true,
          duration: 1500,
        });
        reject();
      },
    });
  });
};

const post = (path, params, showToast) => {
  const showToaster = showToast || true;
  const newParams = { ...params };
  const token = store.get('sessionId');
  if (token) {
    newParams.token = store.get('sessionId');
  }
  newParams.appId = store.appId;

  if (showToaster) {
    wx.showLoading({
      title: '正在加载...',
      mask: true,
    })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        wx.hideLoading();
        if (res && !res.data.code) {
          resolve(res.data.data);
        } else {
          if(res.data.code == 20004 || res.data.code == 20001){
            store.set('sessionId', '');
            store.set('peopleId', '');
            store.set('me', '');
            get('app/findToken', {}, (res) => {
              store.set('sessionId', res);
            });

            wx.showModal({
              title: '小提示',
              content: res.data.code == 20004 ? '登录已过期，请重新登录' : '您的账号已在其他地方登陆，无法正常使用小程序，请重新登录',
              confirmColor: '#be342a',
              showCancel: false,
              success: () => {
                getApp().auth(()=>{
                  let route = 'pages/index/index';
                  let uri = '';
                  let query;
                  if (store.get('currentRoute')) {
                    const router = store.get('currentRoute');
                    route = router.currentRoute;
                    const options = router.currentOptions;
                    for(const key in options) {
                      query += `&${key}=${options[key]}`;
                    }
                    query = query ? query.substring(1) : '';
                  }
                  uri = query ? `/${route}?${query}` : `/${route}`;
                  wx.redirectTo({
                    url: uri,
                  });
                });
              },
            });
            reject();
            return;
          }
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#be342a',
            showCancel: false,
          });
          reject();
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络出错',
          image: '/images/timeout.png',
          mask: true,
          duration: 1500,
        });
        reject();
      },
    });
  });
};

const http = {
  post,
  get,
};

export default http;
