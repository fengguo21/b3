
import { getSchedule } from '../../utils/api.js';
import * as store from '../../utils/store.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schedule: [],
    lineIndex: '',
  },
  getSchedule() {
    let self = this
    let line = store.get('currentline')
    let param = { lineFeedId: line.feedId, page: 1, size: 100 }
    getSchedule(param).then(function (res) {
      // console.log(res)
      res.list.forEach(function (element, index) {
        while (element.basic.times.length < 5) {
          element.basic.times.push(' ')
          // statement
        }
      });
      // console.log(res.list);
      self.setData({
        schedule: res.list
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSchedule();
    const linename = store.get('currentline').basic.title;
    const lineIndex = store.get('currentLineIndex') || '1';
    this.setData({
      lineIndex,
    });
    wx.setNavigationBarTitle({
      title: linename,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    const linename = store.get('currentline');
    // console.log('当前线路',linename)
    const session = store.get('sessionId');
    // console.log('sessionId:',session)
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})