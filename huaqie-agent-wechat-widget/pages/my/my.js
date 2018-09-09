// my.js

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShareAppMessage: function () {
    return {
      title: '合作洽谈',
      desc: '小程序开发!',
      path: '/pages/my/my'
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toAboutUs: function () {
    wx.navigateTo({
      url: '../aboutUs/aboutUI'
    })
  },
  send: function () {
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },
  phone1: function () {
    wx.makePhoneCall({
      phoneNumber: '18602118917' //仅为示例，并非真实的电话号码
    })
  },
  phone2: function () {
    wx.makePhoneCall({
      phoneNumber: '13714476493' //仅为示例，并非真实的电话号码
    })
  },
  phone3: function () {
    wx.makePhoneCall({
      phoneNumber: '13823133567' //仅为示例，并非真实的电话号码
    })
  },
  phone4: function () {
    wx.makePhoneCall({
      phoneNumber: '18856933224' //仅为示例，并非真实的电话号码
    })
  },
  phone5: function () {
    wx.makePhoneCall({
      phoneNumber: '17602196321' //仅为示例，并非真实的电话号码
    })
  },
  phone6: function () {
    wx.makePhoneCall({
      phoneNumber: '18575500516' //仅为示例，并非真实的电话号码
    })
  },
  phone7: function () {
    wx.makePhoneCall({
      phoneNumber: '13672426697' //仅为示例，并非真实的电话号码
    })
  },
  about:function(){
    wx.navigateTo({
      url: '../aboutUs/aboutUI'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

