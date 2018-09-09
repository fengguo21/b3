// pages/index/index.js
import moment from '../../utils/moment.js';
import { dateAdd, diffDate } from '../../utils/tool';
import { getNewOrder } from '../../utils/api';
import * as store from '../../utils/store';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false,
    meetAddress: {},
    roomMsg: {},
    peopleMsg: {},
    meetingMsg: {},
    mealMsg: {},
  },

// 导航相关
  // 跳转至自助餐拼团
  navToMeal() {
    const conferenceId = this.data.orderDetail && this.data.orderDetail.conferenceId;
    const grouponId = this.data.orderDetail && this.data.orderDetail.groupon.grouponId;
    const conferenceEnd = this.data.orderDetail && this.data.orderDetail.conference.endDate;
    const today = moment().format('YYYY-MM-DD');
    if (moment(today).valueOf() > moment(conferenceEnd).valueOf()) {
      wx.showModal({
        title: '提示',
        content: '当前会议已过期',
        showCancel: false,
        confirmColor: '#be342a',
      })
      return;
    }
    wx.navigateTo({
      url: `/pages/addMeal/addMeal?conferenceId=${conferenceId}&grouponId=${grouponId}`,
    });
  },
  navToDetail() {
    const conferenceId = this.data.orderDetail && this.data.orderDetail.conferenceId;
    const conferenceEnd = this.data.orderDetail && this.data.orderDetail.conference.endDate;
    const today = moment().format('YYYY-MM-DD');
    if (moment(today).valueOf() > moment(conferenceEnd).valueOf()) {
      wx.showModal({
        title: '提示',
        content: '当前会议已过期',
        showCancel: false,
        confirmColor: '#be342a',
      })
      return;
    }
    wx.navigateTo({
      url: `/pages/roomList/roomList?conferenceId=${conferenceId}`,
    });
  },
  navToMap(e) {
    app.isGetLocation(() => {
      wx.navigateTo({
        url: '/pages/map/map',
      });
    });
  },

// 获取数据
  getNewOrderList() {
    getNewOrder({}).then((res) => {
      const list = res;
      // console.log(list);
      const isEmpty = list ? false : true;
      if (!list) {
        this.setData({
          isEmpty,
        });
        return;
      }
      const dates = list.basic.dates;
      // 入住人信息
      const bill = list.extra.invoice ? true : false;
      const peopleMsg = {bill, ...list.basic};
      peopleMsg.inDate = dates[0];
      peopleMsg.outDate = dateAdd(dates[dates.length - 1], 1);
      // 会议信息
      const meetingMsg = list.conference;
      meetingMsg.progress = diffDate(meetingMsg.endDate, meetingMsg.startDate);
      // 房间信息
      const roomMsg = {
        created: moment(list.payment.updated).format('YYYY-MM-DD'),
        amount: list.amount,
        ...list.room,
      }
      // 团餐信息
      const dateStr = list.grouponDates && list.grouponDates.length > 0
                      ? list.grouponDates.sort().join('、')
                      : '';
      const groupon = list.groupon || {};
      const isMealAvaliable = list.groupon ? true : false;
      const mealMsg = {
        isAvaliable: isMealAvaliable,
        dates: list.grouponDates || [],
        dateStr,
        ...groupon,
      };
      this.setData({
        orderDetail: list,
        peopleMsg,
        meetingMsg,
        roomMsg,
        isEmpty,
        mealMsg,
      });
    });
  },
  getAppMsg() {
    const app = store.get('app');
    const meetAddress = {
      hotel: app.basic.desc,
      phone: app.basic.tel,
      address: app.basic.address,
    };
    this.setData({
      meetAddress,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    app.checkToken(() => {
      this.getNewOrderList();
      this.getAppMsg();
    });
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
  // onShareAppMessage: function () {

  // }
})