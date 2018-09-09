// pages/home/freeArticle/freeArticle.js
import * as store from '../../../util/store.js';
import WxParse from '../../../components/wxParse/wxParse.js';
import { getArticleById } from '../../../util/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    base: '',
    detail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let base;
    let detail;
    const productId = options.productId;
    if (productId) {
      getArticleById({
        productId,
      }).then((res) => {
        // console.log(res);
        base = res;
        detail = res.basic;
        this.dataSet({
          detail,
          base,
        });
      });
    } else {
      base = store.get('activeArticle');
      detail = store.get('activeArticle').basic;
      // console.log('detail::===========::', detail);
      this.dataSet({
        detail,
        base,
      });
    }
  },

  dataSet(obj) {
    // console.log(obj);
    this.setData({
      detail: obj.detail,
      base: obj.base,
    });
    wx.setNavigationBarTitle({
      title: obj.detail.title,
    });
    WxParse.wxParse('article', 'html', obj.detail.content, this, 0);
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
    // console.log(this.data.detail.text);
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
    // console.log(this.data.base);
    return {
      title: this.data.detail.title,
      imageUrl: this.data.detail.avatar,
      path: `/pages/home/freeArticle/freeArticle?productId=${this.data.base.productId}`,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          image: '/images/wrong.png',
          mask: true,
          duration: 1500,
        });
      }
    }
  }
})