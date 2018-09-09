// pages/mine/myOrder/myOrder.js
import * as store from '../../../util/store.js';
import { buyBook, getPeople } from '../../../util/api.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDetail: '',
    useCoupon: '',
    lastPrice: 0,
  },

  buy() {
    app.isLogin(() => {
      this.toPay();
    });
  },
  toPay() {
    const productId = this.data.bookDetail.productId;
    const recordId = !this.data.useCoupon ? '' : this.data.useCoupon.recordId;
    // console.log(recordId);
    buyBook({
      productId,
      recordId,
      channel: 'wepay.widget',
    }).then((res) => {
      console.log('pay==========', res);
      if (!res) {
        store.remove('currentCoupon');
        getPeople({}).then((res) => {
          store.set('me', res);
        });
        wx.showToast({
          title: "购买成功",
          icon: "success",//仅支持success或者loading
          mask: true,
          duration: 1500,
          success: () => {
            wx.reLaunch({
              url: `/pages/mine/buyDetail/buyDetail?productId=${productId}`,
            })
          }
        });
        // wx.switchTab({
        //   url: '/pages/mine/mine',
        // })
        return;
      }
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': `prepay_id=${res.prepayId}`,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': (res) => {
          store.remove('currentCoupon');
          getPeople({}).then((res) => {
            store.set('me', res);
          });
          wx.showToast({
            title: "购买成功",
            icon: "success",//仅支持success或者loading
            mask: true,
            duration: 1500,
            success: () => {
              wx.reLaunch({
                url: `/pages/mine/buyDetail/buyDetail?productId=${productId}`,
              })
            }
          });
          console.log('do this');

          // wx.reLaunch({
          //   url: `/pages/mine/buyDetail/buyDetail?productId=${productId}`,
          // })
          // wx.switchTab({
          //   url: '/pages/mine/mine',
          // })
        },
        'fail': (res) => {
          console.log(res);
          wx.showToast({
            title: '已取消支付',
            image: '/images/wrong.png',
            mask: true,
            duration: 1500,
          });
        }
      })
    });
  },

// 导航相关
  // 选择优惠券
  chooseCoupon() {
    wx.navigateTo({
      url: '/pages/home/canUseCoupon/canUseCoupon?type=1',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    store.remove('currentCoupon');
    const bookDetail = store.get('currentBook');
    bookDetail.price = bookDetail.basic.price.toFixed(2);
    this.setData({
      bookDetail,
      lastPrice: bookDetail.price,
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
    const useCoupon = store.get('currentCoupon');
    if (useCoupon) {
      const det = this.data.bookDetail.price - useCoupon.coupon.basic.price;
      let lastPrice;
      if (det <= 0) {
        lastPrice = 0;
      } else {
        lastPrice = det.toFixed(2);
      }
      console.log(useCoupon);
      this.setData({
        useCoupon,
        lastPrice,
      });
    }
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
    if (store.get('currentCoupon')) {
      store.remove('currentCoupon');
    }
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