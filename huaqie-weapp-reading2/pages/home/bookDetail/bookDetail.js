// pages/home/bookDetail/bookDetail.js
import * as store from '../../../util/store.js';
import WxParse from '../../../components/wxParse/wxParse.js';
import NavPannel from '../../../components/navBack/nav-back';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioIndex: '',
    detail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const radioIndex = options.radioIndex;
    // console.log(radioIndex);
    const detail = store.get('currentBook').basic.audios[radioIndex];
    this.setData({
      radioIndex,
      detail,
    });
    wx.setNavigationBarTitle({
      title: detail.title,
    });
    new NavPannel();
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
    const htmlContent = this.data.detail.doc
                        .replace(/(\t+)+/g, '')
                        .replace(/\n/g, '<br/>')
                        .replace(/<div><br><\/div>/g, '');
    // console.log(htmlContent);
    WxParse.wxParse('article', 'html', htmlContent, this, 0);
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