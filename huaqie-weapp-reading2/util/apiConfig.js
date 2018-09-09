import * as store from './store.js';

const base = 'https://g2.huaqie.com/cloud';

const get = (path, params, showToast) => {
  const showLoading = showToast != undefined ? showToast : true;
  const newParams = { ...params };
  newParams.sessionId = store.get('sessionId') || 'undefined';
  newParams.appId = store.appId;

  if (showLoading) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
  }

  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'GET',
      header: {
          'content-type': 'application/json'
      },
      success: (res) => {
        if (!res.data.code) {
          resolve(res.data.data);
        } else {
          if(res.data.code == 10001){
            store.set('sessionId', '')
            store.set('peopleId', '')
            store.set('me', '')
            get('account/sessionId', {}, (res) => {
              store.set('sessionId', res);
            })

            wx.showModal({
              title: '小提示',
              content: '会话已过期，请重新登录',
              confirmColor: '#e84213',
              showCancel: false,
              success: () => {
                getApp().auth(()=>{
                  get(path, params, callback)
                })
              }
            })
            return
          }
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#e84213',
            showCancel: false,
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络出错',
          image: '/images/timeout.png',
          mask: true,
          duration: 1500,
        });
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  });
};

const post = (path, params, showToast) => {
  const showLoading = showToast != undefined ? showToast : true;
  const newParams = { ...params };
  newParams.sessionId = store.get('sessionId') || 'undefined';
  newParams.appId = store.appId;

  if (showLoading) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
  }

  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'POST',
      header: {
          'content-type': 'application/json'
      },
      success: (res) => {
        if (!res.data.code) {
          resolve(res.data.data);
        } else {
          if(res.data.code == 10001){
            store.set('sessionId', '')
            store.set('peopleId', '')
            store.set('me', '')
            get('account/sessionId', {}, (res) => {
              store.set('sessionId', res);
            })

            wx.showModal({
              title: '小提示',
              content: '会话已过期，请重新登录',
              confirmColor: '#ffaf0e',
              showCancel: false,
              success: () => {
                getApp().auth(()=>{
                  post(path, params, callback)
                })
              }
            })
            return
          }
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#ffaf0e',
            showCancel: false,
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络出错',
          image: '/images/timeout.png',
          mask: true,
          duration: 1500,
        });
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  });
};

const http = {
  post,
  get,
};

export default http;
