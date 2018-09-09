import { get } from '../../../util/api'
import moment from '../../../util/moment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdraw: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    get('bank/findWithdrawById', {
      withdrawId: options.withdrawId
    }, res => {
      console.log('====', res)
      if(!res)
        return
      res.created = moment(res.created).format('YYYY-MM-DD HH:mm:ss')
      res.updated = moment(res.updated).format('YYYY-MM-DD HH:mm:ss')
      this.setData({
        withdraw: res
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