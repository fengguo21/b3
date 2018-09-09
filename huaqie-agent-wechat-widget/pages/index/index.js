//index.js
//获取应用实例
const app = getApp()

Page({
  
  data: {
    
   
  },
  onShareAppMessage: function () {
    return {
      title: '产品服务',
      desc: '小程序开发!',
      path: '/pages/index/index'
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  send:function(){
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },
  toDetail1: function () {
    wx.navigateTo({
      url: '../../pages/detail/takeOut/takeOut'
    })
    console.log(1)
  },
  toDetail2: function () {
    wx.navigateTo({
      url: '../../pages/detail/smallShop/smallShop'
    })
    console.log(1)
  },
  toDetail3: function () {
    wx.navigateTo({
      url: '../../pages/detail/customer/customer'
    })
    console.log(1)
  },
  toDetail4: function () {
    wx.navigateTo({
      url: '../../pages/detail/distribution/distribution'
    })
    console.log(1)
  },
  toDetail5: function () {
    wx.navigateTo({
      url: '../../pages/detail/sharedCharge/sharedCharge'
    })
    console.log(1)
  },
  toDetail6: function () {
    wx.navigateTo({
      url: '../../pages/detail/mobilePay/mobilePay'
    })
    console.log(1)
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
