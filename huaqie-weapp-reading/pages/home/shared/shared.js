// pages/home/shared/shared.js
import { getBookById } from '../../../util/api.js';
import * as store from '../../../util/store.js';
import WxParse from '../../../components/wxParse/wxParse.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId: '',
    audioIndex: '',
    detail: '',
    book: '',
    audioCtx: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const productId = options.productId;
    const audioIndex = options.audioIndex;
    this.setData({
      productId,
      audioIndex,
    });
    getBookById({
      productId,
    }).then((res) => {
      const detail = res.basic.audios[audioIndex];
      detail.text = detail.doc.replace(/\n/g, '<br/>');
      this.setData({
        detail,
        book: res,
      });
      wx.setNavigationBarTitle({
        title: detail.title,
      });
      WxParse.wxParse('article', 'html', detail.text, this, 0);
    })
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
    if (this.data.detail) {
      WxParse.wxParse('article', 'html', this.data.detail.text, this, 0);
      if (!this.data.audioCtx) {
        this.data.audioCtx = wx.createAudioContext('myAudio');
      }
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