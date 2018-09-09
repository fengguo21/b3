import { get, post } from './util/api'

App({
  onLaunch: function (options) {
    console.log('=========== ON LAUNCH', options, options.query)
    this.globalData.salesPeopleId = options.query.salesPeopleId || ''
    const sessionId = wx.getStorageSync('sessionId')
    const peopleId = wx.getStorageSync('peopleId')
    if (!sessionId) {
      get('account/sessionId', {}, (data) => {
        wx.setStorageSync('sessionId', data)
        if (!peopleId)
          this.login()
      })
      return
    }
    if (!peopleId)
      this.login()
  },
  auth: function (resolve, reject, force) {
    const me = wx.getStorageSync('me') || null
    if (me && !force) {
      if (typeof (resolve) == 'function')
        resolve(me)
      return
    }
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          console.log('进入授权流程')
          this.login(resolve)
          return
        }
        wx.openSetting({
          success: (res) => {
            console.log('===== OPEN', res)
            wx.getSetting({
              success: (res) => {
                if (!res.authSetting['scope.userInfo']) {
                  wx.showModal({
                    title: '小提示',
                    content: '同意获取用户信息才可以继续',
                    confirmColor: '#e85787',
                    showCancel: false,
                    success: () => {
                      if (typeof (reject) == 'function')
                        reject()
                    }
                  })
                } else {
                  console.log('进入授权流程')
                  this.login(resolve)
                }
              }
            })
          }
        })
      }
    })
  },
  login: function (callback) {
    wx.login({
      success: (res) => {
        if (res.code) {
          const code = res.code
          wx.getUserInfo({
            success: (res) => {
              post('account/signInByWeApp', {
                code: code,
                encryptedData: res.encryptedData,
                iv: res.iv,
                salesPeopleId: this.globalData.salesPeopleId
              }, (ret) => {
                console.log('GET USER INFO ======================', ret)
                wx.setStorageSync('sessionId', ret.sessionId)
                wx.setStorageSync('peopleId', ret.people.peopleId)
                wx.setStorageSync('me', ret.people)
                if (typeof (callback) == 'function')
                  callback(ret.people)
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
	// 获取用户信息
	getUserInfo: function(cb) {
		var that = this
		if (this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
			//调用登录接口
			wx.login({
				success: function() {
					wx.getUserInfo({
						success: function(res) {
							that.globalData.userInfo = res.userInfo
							typeof cb == "function" && cb(that.globalData.userInfo)
						}
					})
				}
			})
		}
	},
	//跳转预约页面
	yuyue:function(){
        wx.navigateTo({
           url: '/pages/yuyue/yuyue'
        });
    },
    // 全局变量
	globalData: {
		feedid:'', //案例ID 1000098 多张户型图 1000089 单张户型图 1000090 无户型图
		designerId:2227, //设计师id
    salesPeopleId: ''
	}
})