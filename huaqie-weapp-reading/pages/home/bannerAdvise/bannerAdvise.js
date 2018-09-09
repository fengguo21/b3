// pages/home/bannerAdives/bannerAdvise.js
import * as store from '../../../util/store.js';
import WxParse from '../../../components/wxParse/wxParse.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const detail = store.get('activeAdvise');
    this.setData({
      detail,
    });
    wx.setNavigationBarTitle({
      title: detail.title,
    });
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
    // console.log(this.data.detail.text);
    WxParse.wxParse('article', 'html', this.data.detail.text, this, 0);
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

})