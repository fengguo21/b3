// pages/mine/mine.js
import * as store from '../../util/store.js';
import { getPeople } from '../../util/api.js';
import moment from '../../util/moment.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    username: '',
    vipEnd: '',
  },

// 重新登录
  reLog() {
    app.isLogin(() => {
      this.getPeople();
    });
  },

// 获取用户信息
  getPeople() {
    getPeople({}).then((res) => {
      store.set('me', res);
      let vipEnd = '';
      const nowTime = moment().valueOf();
      if (res.extra.vip && nowTime < res.extra.vip.deadline) {
        vipEnd = moment(res.extra.vip.deadline).format('YYYY-MM-DD');
      }
      this.setData({
        avatar: res.basic.avatar,
        username: res.basic.name,
        vipEnd,
      });
    });
  },

// 导航相关
  goBuys() {
    app.isLogin(() => {
      wx.navigateTo({
        url: './myBuy/myBuy',
      });
    })
  },
  goRecords() {
    app.isLogin(() => {
      wx.navigateTo({
        url: './myComment/myComment',
      });
    })
  },
  goCoupon() {
    app.isLogin(() => {
      wx.navigateTo({
        url: './coupon/coupon',
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.reLog();
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