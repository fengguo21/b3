// pages/mine/myComment/myComment.js
import { getComment } from '../../../util/api.js';
import * as store from '../../../util/store.js';
import moment from '../../../util/moment.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    size: 15,
    total: 0,
    me: '',
  },

// 获取数据
  getCommentList() {
    const peopleId = store.get('me').peopleId;
    console.log(peopleId);
    getComment({
      page: this.data.page,
      size: this.data.size,
      peopleId,
      step: 2,
    }).then((res) => {
      let list;
      res.list.forEach((item) => {
        // console.log(item);
        item.createFormat = moment(item.created).format('YYYY-MM-DD');
      });
      if (res.page == 1 || res.total == 0) {
        list = res.list;
      } else {
        list = this.data.list.concat(res.list);
      }
      this.setData({
        total: res.total,
        list,
      });
      // console.log(res.list);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const me = store.get('me');
    this.setData({
      me,
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
    this.setData({
      page: 1,
    });
    this.getCommentList();
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
    console.log('页面上拉触底');
    if (this.data.page * this.data.size <= this.data.total) {
      this.setData({
        page: this.data.page + 1,
      });
      this.getCommentList();
    }
  },
})