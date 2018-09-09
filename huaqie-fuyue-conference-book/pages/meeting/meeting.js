// pages/meeting/meeting.js
import moment from '../../utils/moment.js';
import { getMeeting } from '../../utils/api';
import { diffDate } from '../../utils/tool';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 会议Id
    conferenceId: '',
    isEnd: false,
    detail: {},
  },

// 获取数据
  getMeetingMsg() {
    const conferenceId = this.data.conferenceId;
    getMeeting({
      conferenceId,
    }).then((res) => {
      // console.log(res);
      let isEnd = false;
      const today = moment().format('YYYY-MM-DD');
      if (moment(today).valueOf() > moment(res.endDate).valueOf()) {
        isEnd = true;
      }
      res.progress = diffDate(res.endDate, res.startDate);
      this.setData({
        detail: res,
        isEnd,
      });
    });
  },

// 拨打电话
  call(e) {
    app.call(e);
  },

// 导航相关
  navToRooms() {
    app.isLogin(() => {
      if (!this.data.isEnd) {
        wx.navigateTo({
          url: `/pages/roomList/roomList?conferenceId=${this.data.conferenceId}`,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const conferenceId = options.conferenceId;
    this.setData({
      conferenceId,
    });
    app.rePage();
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
    app.checkToken(this.getMeetingMsg);
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
    return {
      title: this.data.detail.title,
      path: `/pages/meeting/meeting?conferenceId=${this.data.conferenceId}`,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          image: '/images/wrong.png',
        });
      }
    };
  }
})