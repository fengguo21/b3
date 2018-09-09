import { post } from '../../../util/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseType: ['招商银行', '民生银行', '工商银行', '农业银行', '建设银行', '中国银行', '中信实业银行',
       '恒丰银行', '广东发展银行','深圳发展银行', '光大银行', '兴业银行', '交通银行', '华夏银行', '上海浦东发展银行', 
       '中信银行', '中国邮政储蓄银行', '上海农村商业银行', '上海银行'],
    houseTypeIndex: 0,
    account: '',
    name: '',
    phone: '',
    amount: 0,
  },

  bindPickerChange(e) {
    this.setData({
      houseTypeIndex: e.detail.value
    })
  },

  bindchangeAccount(e) {
    this.setData({
      account: e.detail.value
    })
  },

  bindchangeName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  bindchangePhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  withdraw() {
    if(!this.data.account){
      wx.showModal({
        title:'小提示',
        content:'请填写账户号',
        confirmColor: '#ffaf0e',
        showCancel:false
      })
      return
    }else if(!this.data.name){
      wx.showModal({
        title:'小提示',
        content:'请填写开户名',
        confirmColor: '#ffaf0e',
        showCancel:false
      })
      return
    }else if(!this.data.phone){
      wx.showModal({
        title:'小提示',
        content:'请填写手机号',
        confirmColor: '#ffaf0e',
        showCancel:false
      })
      return
    }

    post('bank/peopleWithdraw', {
      amount: this.data.amount,
      bank: this.data.houseType[this.data.houseTypeIndex],
      account: this.data.account,
      name: this.data.name,
      phone: this.data.phone
    }, res => {
      wx.navigateBack()
      console.log('========== POST', res)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      amount: options.amount
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