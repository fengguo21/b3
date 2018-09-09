// pages/mine/coupon/coupon.js
import { getCouponList } from '../../../util/api.js';
import * as store from '../../../util/store.js';
import moment from '../../../util/moment.js';

const NOT_USE_URL = '/images/coupon-not-use.png';
const USED_URL = '/images/coupon-used.png';
const TIMEOUTED_URL = '/images/coupon-timeouted.png';
const NOT_USE_TEXT = '立即使用';
const USED_TEXT = '已使用';
const TIMEOUTED_TEXT = '已过期';
const NOT_USE_CSS = '';
const USED_CSS = 'btn-used';
const TIMEOUTED_CSS = 'btn-out';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["未使用", "已使用", "已过期"],
    selectIndex: 0,
    couponUrl: '',
    btnText: '',
    btnColor: '',
    list: [],
    page: 1,
    size: 15,
    total: 0,
  },

  setCoupon(index) {
    let nowUrl = '';
    let btnText = '';
    let btnColor = '';
    if (index == 0) {
      nowUrl = NOT_USE_URL;
      btnText = NOT_USE_TEXT;
      btnColor = NOT_USE_CSS;
    } else if (index == 1) {
      nowUrl = USED_URL;
      btnText = USED_TEXT;
      btnColor = USED_CSS;
    } else {
      nowUrl = TIMEOUTED_URL;
      btnText = TIMEOUTED_TEXT;
      btnColor = TIMEOUTED_CSS;
    }
    this.setData({
      couponUrl: nowUrl,
      btnText,
      btnColor,
    });
  },

  selectTab(e) {
    const index = e.currentTarget.id;
    if (store.get('prevCouponTab')) {
      const prevTabIndex = store.get('prevCouponTab');
      if (prevTabIndex != index) {
        store.set('prevCouponTab', index);
        this.setCoupon(index);
        this.setData({
          selectIndex: index,
          page: 1,
          list: [],
        });
      }
    } else {
      store.set('prevCouponTab', index);
      this.setCoupon(index);
      this.setData({
        selectIndex: index,
        page: 1,
        list: [],
      });
    }
    this.getCouponList(Number(index));
    // console.log(e);
  },

  useCoupon() {
    if (this.data.selectIndex == 0) {
      wx.switchTab({
        url: '/pages/home/home',
      });
    }
  },


// 获取数据
  getCouponList(mode) {
    const params = {
      page: this.data.page,
      size: this.data.size,
    };
    switch(mode) {
      case 0: params.used = 0;break;
      case 1: params.used = 1;break;
      case 2: params.overdue = 1;break;
    }
    // console.log(params);
    getCouponList(params).then((res) => {
      let list;
      res.list.forEach((item) => {
        item.startDate = moment(item.coupon.basic.startDate).format('YYYY.MM.DD');
        item.endDate = moment(item.coupon.basic.endDate).format('YYYY.MM.DD');
      });
      if (res.page == 1 || res.total == 0) {
        list = res.list;
      } else {
        list = this.data.list.concat(res.list);
      }
      // console.log(list);
      this.setData({
        list,
        total: res.total,
      });
    });
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
    const tabIndex = this.data.selectIndex;
    store.set('prevCouponTab', tabIndex);
    this.setCoupon(tabIndex);
    this.setData({
      page: 1,
    });
    this.getCouponList(Number(tabIndex));
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
  scrollToLower() {
    console.log('页面上拉触底');
    if (this.data.page * this.data.size <= this.data.total) {
      this.setData({
        page: this.data.page + 1,
      });
      this.getCouponList(this.data.selectIndex);
    }
  },
  onReachBottom: function () {

  },

})