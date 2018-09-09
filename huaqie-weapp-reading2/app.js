import { convertTimeHHMMSS } from './util/tool.js';
import * as store from './util/store.js';
import moment from './util/moment.js';
import { getSessionId, wxLogin, getVipConfig, readBook } from './util/api.js';

App({
  globalData: {
    audioCtx: null,
    salesPeopleId: '',
    timer: null,
    currentRadioBook: '',
    currentRadioIndex: '',
    floatState: false,
    timer1: null,
    timer2: null,
  },

  onLaunch(options) {
    // 小程序初始化
    const canUse = this.canIUse(wx.getBackgroundAudioManager);
    if (canUse) {
      this.globalData.audioCtx = wx.getBackgroundAudioManager();
    }
    this.globalData.salesPeopleId = options.query.salesPeopleId || '';
    const sessionId = store.get('sessionId');
    const peopleId = store.get('peopleId');
    if(!sessionId){
      getSessionId({}).then((res) => {
        // console.log('sessionId', res);
        store.set('sessionId', res);
        if (!peopleId) {
          this.login()
        }
      });
      return
    }
    if(!peopleId) {
      this.login()
    }
  },
  onShow(){
    this.globalData.audioCtx.onStop(() => {
      // console.log('listen stop~~~~~~~~~~');
      this.readBook();
    });
    // 小程序显示
  },
  // 发送信息
  readBook() {
    readBook({
      productId: this.globalData.currentRadioBook.productId,
      audioIndex: this.globalData.currentRadioIndex,
      audioTime: this.globalData.audioCtx.currentTime,
    }, false).then((res) => {
      store.set('me', res);
    });
  },
  // end DO
  endEvent() {
    const currentBook = this.globalData.currentRadioBook;
    const currentIndex = this.globalData.currentRadioIndex;
    if (currentIndex >= currentBook.basic.audios.length - 1) {
      // this.globalData.currentRadioIndex = currentBook.basic.audios.length - 1;
      // this.globalData.audioCtx.pause();
      this.setOrigin(() => {
        // console.log('end =========');
        this.globalData.audioCtx.pause();
      });
    } else {
      this.globalData.currentRadioIndex = currentIndex + 1;
      this.setOrigin();
    }
  },
// 设置原生信息封面
  setOrigin(cb) {
    clearTimeout(this.globalData.timer1);
    clearTimeout(this.globalData.timer2);
    this.globalData.timer1 = setTimeout(() => {
      const currentBook = this.globalData.currentRadioBook;
      const currentIndex = this.globalData.currentRadioIndex;
      this.globalData.floatState = true;
      this.globalData.audioCtx.src = currentBook.basic.audios[currentIndex].src;
      this.globalData.audioCtx.play();
      this.globalData.audioCtx.title = currentBook.basic.audios[currentIndex].title;
      this.globalData.audioCtx.epname = currentBook.basic.title;
      this.globalData.audioCtx.singer = currentBook.basic.author;
      this.globalData.audioCtx.coverImgUrl = currentBook.basic.avatar;
      this.globalData.audioCtx.webUrl = this.globalData.audioCtx.src;
      if (cb) {
        this.globalData.timer2 = setTimeout(() => {
          cb();
        }, 200)
      }
    }, 200);
  },
  setProgress(position) {
    return new Promise((resolve) => {
      if (position) {
        setTimeout(() => {
          this.globalData.audioCtx.startTime = position;
          this.globalData.audioCtx.seek(position);
        }, 200);
      }
      resolve();
    });
  },
// 判断是否是会员
// 独立逻辑判断版本是否有会员
  modeHasVip() {
    return  new Promise((resolve, reject) => {
      // console.log(store.get('app'));
      const appMsg = store.get('app');
      const me = store.get('me');
      // 判断该版本是否存在会员
      if (appMsg.extra.vips && appMsg.extra.vips.length > 0) {
        const today = moment().valueOf();
        // 会员未过期
        if (me.extra.vip && today < me.extra.vip.deadline) {
          resolve({
            code: 0,
            message: 'success',
          });
        } else {
          // 会员过期或会员未开通
          if (!me.extra.vip) {
            reject({
              code: 1,
              message: 'not_open_vip',
            });
          } else {
            reject({
              code: 2,
              message: 'vip_deadline',
            });
          }
        }
      } else {
        reject({
          code: 3,
          message: 'system_vip_inval',
        });
      }
    });
  },
  modeHasBuy(detail) {
    return new Promise((resolve, reject) => {
      const me = store.get('me');
      if (me.extra.books) {
        let bookList = [];
        me.extra.books.forEach((item) => {
          bookList.push(item.productId);
        });
        if (bookList.indexOf(detail.productId) >= 0) {
          resolve();
        } else {
          reject();
        }
      } else {
        reject();
      }
    })
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
  isLogin(cb) {
    const me = store.get('me');
    const app = store.get('app');
    if (!me) {
      getApp().auth((me) => {
        if (cb && app) {
          cb();
        }
      });
    } else {
      if (cb && app) {
        cb();
      }
    }
  },
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
                // console.log(res.authSetting['scope.userInfo']);
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
                      this.login(resolve);
                    });
                  }
                }
              },
            });
          },
        });
      },
    })
  },
  login: function(callback) {
    // console.log('GET USER  ======================', store.get('sessionId'));
    if (!store.get('sessionId')) {
      this.getSession().then((res) => {
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
          // console.log('GET USER INFO0 ======================', store.get('sessionId'));
          wx.getUserInfo({
            success: (res) => {
              console.log(res)
              // console.log('GET USER INFO1 ======================', store.get('sessionId'));
              if (!store.get('sessionId')) {
                this.getSession().then(() => {
                  this.wxLogin(code, res, callback);
                })
                return;
              }
              this.wxLogin(code, res, callback);
            },
            // fail: () => {
            //   wx.showModal({
            //     title: "提示",
            //     content: '如果拒绝授权则无法正常使用当前小程序',
            //     showCancel: true,
            //     cancelText: "取消",
            //     cancelColor: "#000000",
            //     confirmText: "授权",
            //     confirmColor: "#e84213",
            //     success: (res) => {
            //       if (res.confirm) {
            //         this.auth();
            //       }
            //     },
            //   });
            // },
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
      store.set('sessionId', ret.sessionId);
      store.set('peopleId', ret.people.peopleId);
      store.set('me', ret.people);
      getVipConfig({}).then((res) => {
        store.set('app', res);
      });
      if(typeof(callback) == 'function')
        callback(ret.people)
    });
  },
// 查询兼容
  canIUse(wxApi) {
    if (!wxApi) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        showCancel: false,
      });
      return false;
    } else {
      return true;
    }
  },
})