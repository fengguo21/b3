// pages/home/openVip/openVip.js
import * as store from '../../../util/store.js';
import { openVip, getVipConfig } from '../../../util/api.js';
import NavPannel from '../../../components/navBack/nav-back';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceList: [],
    imageList: [],
    powerList: [
      {
        imgUrl: '/images/vip-team.png',
        title: '科大20年最好的作品',
        desc: '每一本书都经过科大30小时的策划、撰稿、录音等5道工序，耗时数天的打磨和把关，为会员提供最佳体验。',
      },
      {
        imgUrl: '/images/vip-book.png',
        title: '所有书单任意听',
        desc: '开通VIP后，有效期内，所有书单都可以直接收听。',
      },
      {
        imgUrl: '/images/vip-curt.png',
        title: '第二年八折续费',
        desc: '第2年成功续费，即可享受八折年度会员。',
      },
    ],
  },


  openVip(e) {
    app.isLogin(() => {
      const title = e.currentTarget.dataset.title;
      // console.log(title);
      this.toPay(title)
    });
  },
  navToVip(e){
    const detail = e.currentTarget.dataset.detail
    store.set('currentVip',detail)
    wx.navigateTo({
      url: '/pages/mine/viporder/viporder'
    })
  },
  toPay(title) {
    openVip({
      title,
      channel: 'wepay.widget',
    }).then((res) => {
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': `prepay_id=${res.prepayId}`,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': (res) => {
          // console.log(res);
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            mask: true,
            duration: 1500,
          });
          wx.switchTab({
            url: '/pages/mine/mine',
          })
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
  getVipMsg() {
    getVipConfig({}).then((res) => {
      const priceList = res.extra.vips;
      const imageList = res.extra.vipImages;
      priceList.forEach((item) => {
        item.priceFormat = item.price.toFixed(2);
      });
      this.setData({
        priceList,
        imageList,
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new NavPannel();
    this.getVipMsg();
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

  }
})