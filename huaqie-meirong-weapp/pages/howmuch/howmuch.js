// pages/howmuch/howmuch.js
var common = require("../../utils/api.js");
Page({
  sure: true,
  /**
   * 页面的初始数据
   */
  data: {
    card: {},
    feed: '',
    services: [],
    sales: '',
    consumenum: 0,
    enable:true,

  },
  show: function () {
    var that = this
    if (this.data.enable == false) {
      wx.showToast({
        title: '稍后重试...',
        icon: 'loading',
        duration: 1000
      })
      setTimeout(function () {
        that.setData({
          enable: true
        })
      }, 5000);
      return
    }
    else if (this.data.enable == true) {
      const services = []
      this.data.services.forEach(e => {
        if(e.active)
            services.push(e.title)
      })
     
      if(!services.length){
        wx.showModal({
          title: '小提示',
          content: '请选择本次服务项目',
          confirmColor: '#ff8ec6',
          showCancel: false
        })
        return
      }

      if(this.data.consumenum==0){
        wx.showModal({
          title: '小提示',
          content: '请输入金额',
          confirmColor: '#ff8ec6',
          showCancel: false
        })
        return
      }
      that.setData({
        enable: false
      })
    common.post('hyb/consumeMember', {
      feedId: this.data.feed,
      amount: this.data.consumenum,
      salesPeopleId: this.data.sales,
      services: services
    }, res => {
      this.setData({
        sure: !this.data.sure
      })
      setTimeout(function () {
        
        that.setData({
          enable: true
        })
      }, 5000)

    

    },



    )
    }
    // wx.showToast({
    //   title: '支付成功',
    //   icon: 'success',
    //   mask:true,
    //   duration: 2000
    // })
  },
  sure: function () {

    this.setData({
      sure: !this.data.sure
    })
    wx.switchTab({
      url: '../user/user',
   
      
    })
      
    
      
    
  },
  inputblur: function (e) {

    this.setData({
      consumenum: e.detail.value
    })
    console.log(e.detail.value)
  },

  chooseService: function(e) {
    const title = e.currentTarget.dataset.title
    const services = this.data.services
    services.forEach(e => {
      if(e.title == title && !e.active)
        e.active = true
      else if(e.title == title && e.active)
        e.active = false
    })
    this.setData({
      services: services
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      feed: options.feed,
      services: options.services,
      ratio:options.ratio,
      sales: options.sales
    })
    
    common.get('hyb/findCardById', {
      feedId: options.cardId
    }, data => {
      let tmp = []
      if(data.basic.services)
        tmp = data.basic.services.map(e => ({
          title: e,
          active: false
        }))
      if(tmp.length == 0)
        tmp.push({
          title: data.basic.service,
          active: true
        })
      this.setData({
        services: tmp
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})