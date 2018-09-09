// pages/indexShare/indexShare.js
import moment from '../../utils/moment.js';
import { dateAdd, diffDate } from '../../utils/tool';
import { getOrder, payOrder } from '../../utils/api';
import * as store from '../../utils/store';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canClick: true,
    orderId: '',
    orderDetail: '',
    isEmpty: false,
    meetAddress: {},
    roomMsg: {},
    peopleMsg: {},
    meetingMsg: {},
  },

// 支付
  readyToPay() {
    app.isLogin(() => {
      if (this.data.orderDetail.step == 2) {
        wx.showToast({
          title: '当前订单已支付',
        });
        return;
      }
      if (this.data.canClick) {
        this.goPay();
      }
      // console.log('ready to pay');
    });
  },
  // 支付
  goPay(cb) {
    this.setData({
      canClick: false,
    });
    // const res = this.data.orderMsg;
    // console.log("下单成功::================", res);
    payOrder({
      orderId: this.data.orderId,
      channel: 'WEPAY',
      subChannel: 'WIDGET'
    }).then((res) => {
      // console.log('支付参数：', res)
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': `prepay_id=${res.prepayId}`,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': (res) => {
          this.setData({
            canClick: true,
          });
          this.getOrderById();
        },
        'fail': (res) => {
          this.setData({
            canClick: true,
          });
        },
      });
    }).catch(() => {
      this.setData({
        canClick: true,
      });
    });
  },

// 导航相关
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
  getOrderById() {
    getOrder({
      orderId: this.data.orderId,
    }).then((res) => {
      // console.log(res);
      const dates = res.basic.dates;
      // 入住人信息
      const bill = res.extra.invoice ? true : false;
      const peopleMsg = res.basic;
      peopleMsg.inDate = dates[0];
      peopleMsg.outDate = dateAdd(dates[dates.length - 1], 1);
      // 会议信息
      const meetingMsg = res.conference;
      meetingMsg.progress = diffDate(meetingMsg.endDate, meetingMsg.startDate);
      // 房间信息
      const roomMsg = {
        created: moment(res.payment.updated).format('YYYY-MM-DD'),
        amount: res.amount,
        ...res.room,
      }
      this.setData({
        orderDetail: res,
        peopleMsg,
        meetingMsg,
        roomMsg,
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
    // console.log(options);
    const orderId = options.orderId;
    this.setData({
      orderId,
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
    app.checkToken(() => {
      this.getAppMsg();
      this.getOrderById();
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