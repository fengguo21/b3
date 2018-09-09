// pages/mine/myOrder/myOrder.js
import * as store from '../../../util/store.js';
import { openVip, getPeople } from '../../../util/api.js';
import NavPannel from '../../../components/navBack/nav-back';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDetail: '',
    useCoupon: '',
    vip:'',
    vipprice:'',
    lastPrice: 0,
  },

  openVip(e) {
    app.isLogin(() => {
      const title = store.get('currentVip').title
      // console.log(title);
      this.toPay(title)
    });
  },
  navToVip(e) {
    const detail = e.currentTarget.dataset.detail
    // console.log(detail)
    store.set('currentVip', detail);
    wx.navigateTo({
      url: '/pages/mine/viporder/viporder'
    })
  },
  toPay(title) {
    const productId = this.data.bookDetail.productId;
    const recordId = !this.data.useCoupon ? '' : this.data.useCoupon.recordId;
    openVip({
      title,
      channel: 'wepay.widget',
      recordId:recordId
    }).then((res) => {
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': `prepay_id=${res.prepayId}`,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': (res) => {
          // console.log(res);
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
        },
        'fail': (res) => {
          // console.log(res);
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
      url: '/pages/home/canUseCoupon/canUseCoupon?type=2',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    new NavPannel();
    const vip = store.get('currentVip');
    const bookDetail = store.get('currentBook');
    vip.price = vip.price.toFixed(2);
    vip.priceBig = vip.price.substring(0, vip.price.length-2)
    vip.priceLit = vip.price.substring(vip.price.length - 2)
    // console.log(vip.priceBig,vip.priceLit)
    this.setData({
      bookDetail,
      vip,
      lastPrice: vip.price,
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
      const det = this.data.vip.price - useCoupon.coupon.basic.price;
      let lastPrice;
      if (det <= 0) {
        lastPrice = 0;
      } else {
        lastPrice = det.toFixed(2);
      }
      // console.log(useCoupon);
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