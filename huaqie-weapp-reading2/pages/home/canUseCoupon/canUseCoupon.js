// pages/home/canUseCoupon/canUseCoupon.js
import { getCouponList } from '../../../util/api.js';
import * as store from '../../../util/store.js';
import moment from '../../../util/moment.js';
import NavPannel from '../../../components/navBack/nav-back';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '',
    list: [],
    type: '',
    detail: '',
  },

  chooseCoupon(e) {
    const currentCoupon = e.currentTarget.dataset.coupon;
    store.set('currentCoupon', currentCoupon);
    wx.navigateBack({
      delta: 1,
    });
  },

// 获取数据
  getCouponList() {
    const params = {
      page: 1,
      size: 200,
    };
    params.used = 0;
    getCouponList(params).then((res) => {
      let list;
      let canUseList = [];
      res.list.forEach((item) => {
        item.startDate = moment(item.coupon.basic.startDate).format('YYYY.MM.DD');
        item.endDate = moment(item.coupon.basic.endDate).format('YYYY.MM.DD');
        if (item.coupon.basic.minAmount <= this.data.amount) {
          if (this.data.type == 1) {
            if (item.coupon.basic.products && item.coupon.basic.products.length > 0 && (item.coupon.basic.products.indexOf(this.data.detail.productId))) {
              canUseList.push(item);
            }
            if (!item.coupon.basic.products || item.coupon.basic.products.length <= 0) {
              canUseList.push(item);
            }
          } else if (this.data.type == 2) {
            if (!item.coupon.basic.products || item.coupon.basic.products.length <= 0) {
              canUseList.push(item);
            }
          }
        }
      });
      list = canUseList;
      // console.log(list);
      this.setData({
        list,
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new NavPannel();
    const type = options.type;
    let amount;
    let detail;
    if (type == 1) {
      amount = store.get('currentBook').basic.price.toFixed(2);
      detail = store.get('currentBook');
    } else if (type == 2) {
      amount = store.get('currentVip').price.toFixed(2);
      detail = store.get('currentVip');
    }
    this.setData({
      amount,
      type,
      detail,
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
    this.getCouponList()
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