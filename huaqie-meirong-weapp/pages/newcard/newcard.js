// newcard.js
var common = require("../../utils/api.js");

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sure: false,
    phone: '',
    name: '',
    peopleId: '',
    enable:true,
    phonecheck:false,
    namecheck:false,

  },


  submit: function (options) {
    if (this.data.namecheck == false) {
      wx.showModal({
        title: '小提示',
        content: '请输入姓名',
        confirmColor: '#ff8ec6',
        showCancel: false
      })
      return
    }
    if(this.data.phonecheck==false){
      wx.showModal({
        title: '小提示',
        content: '电话输入有误',
        confirmColor: '#ff8ec6',
        showCancel: false
      })
    }
    var that = this
    if (this.data.enable == false && this.data.phonecheck == true) {
      wx.showToast({
        title: '稍后重试...',
        icon: 'loading',
        duration: 1000
      })
      setTimeout(function () {
        that.setData({
          enable: true
        })
      }, 1000);
      return
    }
    else if (this.data.enable == true && this.data.phonecheck == true) {
      that.setData({
        enable: false
      })

    console.log(5421, options.peopleId)
    console.log(this.data.phone, this.data.name)
    
      common.post('hyb/createMember', {
        phone: this.data.phone,
        name: this.data.name,
        salesPeopleId: this.data.peopleId
      }, res => {
        this.setData({
          sure: !this.data.sure
        })
        setTimeout(function () {
         
          that.setData({
            enable: true
          })
        }, 5000)



      }
      )
    
    
    }

  },
  touser: function () {
    console.log(987)
    wx.switchTab({
      url: '../user/user',
    })

  },



  nameinput: function (e) {
    console.log(e.detail.value)
    if(e.detail.value){
      this.setData({
        namecheck:true
      })
    }
    this.setData({
      name: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      phone:e.detail.value
    })
    if ((/^1[3|4|5|7|8][0-9]\d{8}$/.test(e.detail.value))) {
      console.log(123)
      this.setData({
        phonecheck: true
      })
    }
   
  },
  

  
  formReset: function () {
    console.log('form发生了reset事件')
  },
  bindToastTap: function () {
    console.log('办卡成功')
    this.setData({
      bookToastHidden: false
    })
  },
  hideToast: function () {
    this.setData({
      bookToastHidden: true
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var _this = this
    
    console.log(me, 12)
    
    try {
      var me = wx.getStorageSync('me')
      if (!me) {
        getApp().auth((me) => {
          _this.setData({
            name: me.basic.name,
            avatarUrl: me.basic.avatar
          })
        })
      } 
      if (me.basic.name) {
        this.setData({
          name:me.basic.name,
          namecheck:true
        })
        
      }
    } catch (e) {
      this.setData({
        name:''
      })
    }
    try {
      
      if (me.extra.phone) {
        this.setData({
          phone: me.extra.phone,
          phonecheck:true
        })
       
      }
    } catch (e) {
      this.setData({
        phone:''
      })
    }

    this.setData({
      peopleId: options.peopleId
    })
    console.log(5421, options)
    
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