// pages/roomList/roomList.js
import dmaskInit from '../../components/detailMask/detailMask';
import moment from '../../utils/moment';
import * as store from '../../utils/store';
import { diffDate, dateAdd, objValues } from '../../utils/tool';
import { getMeeting, getNewOrder } from '../../utils/api';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectType: '',
    conferenceId: '',
    hotelMsg: {},
    chooseIndex: 0,
    roomList: [],
    dmask: {
      images: [],
    },
  },

  openRoom(e) {
    this.getNewOrderList(e);
  },

// 数据获取
  getMeetingMsg() {
    const conferenceId = this.data.conferenceId;
    getMeeting({
      conferenceId,
    }).then((res) => {
      const diff = diffDate(res.startDate, res.endDate);
      const roomList = objValues(res.rooms);
      const today = moment().format('YYYY-MM-DD');
      roomList.forEach((item) => {
        const rooms = [];
        // const saledCountList = objValues(item.soldCount);
        let saledCount = 0;
        const maxCount = item.maxCount;
        for(let i = 0; i < diff; i++) {
          // 计算期间的日期
          const date = dateAdd(res.startDate, i, 'MM月DD日');
          const dateValue = dateAdd(res.startDate, i, 'YYYY-MM-DD');
          // 获取每天被售出的列表
          const daySaledList = dateValue in item.soldCount ? objValues(item.soldCount[dateValue]) : [];
          // 计算每天被售出的数量
          const daySaledCount = daySaledList.length && daySaledList.length > 0
                                ? daySaledList.reduce((prev, current) => prev + current)
                                : 0;
          const count = maxCount - daySaledCount;
          // 为外层计数
          saledCount += daySaledCount;
          let disabled = false;
          if (moment(dateValue).valueOf() < moment(today).valueOf()) {
            disabled = true;
          }
          rooms.push({
            date,
            count,
            value: dateValue,
            disabled,
          });
        }
        // 获取可展示的房间数
        let canUseValue;
        let canUseRoom;
        if (rooms.length > 0) {
          const tmillin = moment(today).valueOf();
          const firstMillin = moment(rooms[0].value).valueOf();
          const endMillin = moment(rooms[rooms.length - 1].value).valueOf();
          if (tmillin <= endMillin) {
            canUseValue = tmillin < firstMillin ? rooms[0].value : today;
          } else {
            canUseValue = rooms[rooms.length - 1].value;
          }
        }
        canUseRoom = rooms.find(item => item.value == canUseValue);
        item.rooms = rooms;
        item.have = (canUseRoom && canUseRoom.count) || 0;
        item.out = item.maxCount - item.have;
        item.totalHave = item.maxCount * diff - saledCount;
        item.progress = diff;
        item.basic.typehood = item.basic.typehood.toLowerCase();
      });
      this.setData({
        roomList,
      })
    });
  },
  getNewOrderList(e) {
    getNewOrder({}).then((res) => {
      const list = res;
      const roomId = list && list.basic.roomId;
      const conferenceId = list && list.conferenceId;
      const currentConference = this.data.conferenceId;
      const isOrdered = this.data.roomList.find(item => item.roomId == roomId);
      if (conferenceId == currentConference && isOrdered) {
        wx.showModal({
          title: '提示',
          content: '您已在当前会议时定过房间了，不能再次预定',
          showCancel: false,
          confirmColor: '#be342a',
        });
        return;
      }
      this.toggleDmask(e);
    });
  },
  getAppMsg() {
    const app = store.get('app');
    const hotelMsg = {
      hotel: app.basic.desc,
      phone: app.basic.tel,
      address: app.basic.address,
      avatar: app.basic.avatar,
    };
    this.setData({
      hotelMsg,
    });
  },

// 拨打电话
  call(e) {
    app.call(e);
  },
// 导航相关
  navToMap(e) {
    app.isGetLocation(() => {
      wx.navigateTo({
        url: '/pages/map/map',
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const conferenceId = options.conferenceId;
    // console.log(conferenceId);
    this.setData({
      conferenceId,
    });
    app.rePage();
    new dmaskInit();
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
      this.getMeetingMsg();
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