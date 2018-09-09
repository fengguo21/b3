import * as store from './utils/store.js';
import { getSessionId, wxLogin, getAppMsg } from './utils/api.js';

App({
  globalData: {
    salesPeopleId: '',
  },
  onLaunch(options) {
/*
* if you need get userInfo , Please open this code
*/
    this.globalData.salesPeopleId = options.query.salesPeopleId || '';
    const sessionId = store.get('sessionId');
    const peopleId = store.get('peopleId');
    if(!sessionId){
      getSessionId({}).then((res) => {
        // console.log('sessionId', res);
        store.set('sessionId', res);
        if (!peopleId) {
          this.login();
        }
      });
      return;
    }
    if(!peopleId) {
      this.login();
    }
  },
  onShow() {
    this.checkToken(this.getAppMessage);
  },
  getAppMessage() {
    getAppMsg({}).then((res) => {
      // console.log('onshow:=========================', res);
      store.set('app', res);
    });
  },
  // 检测是否存在token
  checkToken(cb) {
    if (!cb) {
      return;
    }
    // console.log(!store.get('sessionId'));
    if (!store.get('sessionId')) {
      getSessionId({}).then((res) => {
        store.set('sessionId', res);
        cb();
      });
    } else {
      cb();
    }
  },
// 拨打电话
  call(e) {
    const phone = String(e.currentTarget.dataset.phone);
    const phoneNumber = phone.match(/\d+/g).join('');
    // console.log(phoneNumber);
    wx.makePhoneCall({
      phoneNumber,
    });
  },

// 判断是否超出5层页面，若5层则把最底层删除
  rePage() {
    const pages = getCurrentPages();
    const currentRoute = pages[pages.length - 1].route;
    const currentOptions = pages[pages.length - 1].options;
    store.set('currentRoute', {
      currentRoute,
      currentOptions,
    });
    // console.log(currentOptions, `PAGE_ROUTE::${currentRoute}:: ============ ::PAGE_LENGTH::${pages.length}`);
  },
// 判断是否授权定位
  isGetLocation(cb) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] && cb) {
          cb();
        } else {
          wx.showModal({
            title: "提示",
            content: "您需要同意定位授权才可以使用地图",
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#000000",
            confirmText: "确定",
            confirmColor: "#be342a",
            success: (res) => {
              // console.log(res);
              if (res.confirm) {
                this.getLocation(cb);
              }
            },
          });
        }
      },
    });
  },
  getLocation(cb) {
    wx.getLocation({
      type: 'gcj02',
      success: () => {
        if (cb) {
          cb();
        }
      },
      fail: () => {
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userLocation'] && cb) {
              cb();
            } else {
              wx.openSetting({
                success: (res) => {
                  // console.log(res);
                },
              })
            }
          },
        });
      },
    });
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
// 判断是否登录
  isLogin(cb) {
    const me = store.get('me');
    const app = store.get('app');
    if (!me) {
      getApp().auth((me) => {
        if (cb && app)
          cb()
      });
    } else {
      if (cb && app)
        cb()
    }
  },
  // 授权流程
  auth: function( resolve, reject, force ) {
    const me = store.get('me') || null
    if(me && !force){
      if(typeof(resolve) == 'function')
        resolve(me)
      return
    }
    wx.getSetting({
      success: (res) => {
        if(res.authSetting['scope.userInfo']){
          // console.log('进入授权流程')
          if (store.get('sessionId')) {
            this.login(resolve)
          } else {
            getSessionId({}).then((res) => {
              // console.log('sessionId', res);
              store.set('sessionId', res);
              this.login(resolve)
            });
          }
          return
        }
        wx.openSetting({
          success: (res) => {
            // console.log('===== OPEN', res)
            wx.getSetting({
              success: (res) => {
                if(!res.authSetting['scope.userInfo']){
                  wx.showModal({
                    title:'小提示',
                    content:'同意获取用户信息才可以继续',
                    confirmColor: '#ffaf0e',
                    showCancel:false,
                    success: () => {
                      if(typeof(reject) == 'function')
                        reject()
                    }
                  })
                }else{
                  // console.log('进入授权流程')
                  if (store.get('sessionId')) {
                    this.login(resolve)
                  } else {
                    getSessionId({}).then((res) => {
                      // console.log('sessionId', res);
                      store.set('sessionId', res);
                      this.login(resolve)
                    });
                  }
                }
              },
            });
          },
        });
      }
    })
  },
  // 登录流程
  login: function(callback) {
    if (!store.get('sessionId')) {
      this.getSession({}).then((res) => {
        this.loginRoad(callback);
      })
      return;
    }
    this.loginRoad(callback);
  },
  loginRoad(callback) {
    wx.login({
      success: (res) => {
        if (res.code) {
          const code = res.code;
          wx.getUserInfo({
            success: (res) => {
              if (!store.get('sessionId')) {
                this.getSession({}).then(() => {
                  this.wxLogin(code, res, callback);
                })
                return;
              }
              this.wxLogin(code, res, callback);
            },
          });
        } else {
          // console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  wxLogin(code, res, callback) {
    wxLogin({
      code: code,
      encryptedData: res.encryptedData,
      iv: res.iv,
      salesPeopleId: this.globalData.salesPeopleId,
    }).then((ret) => {
      // console.log('GET USER INFO2 ======================', ret);
      wx.showModal({
        title: '提示',
        content: '登录成功',
        confirmColor: '#be342a',
        showCancel: false,
      });
      store.set('sessionId', ret.token);
      store.set('peopleId', ret.people.peopleId);
      store.set('me', ret.people);
      getAppMsg({}).then((res) => {
        store.set('app', res);
      });
      if(typeof(callback) == 'function')
        callback(ret.people)
    });
  },
});