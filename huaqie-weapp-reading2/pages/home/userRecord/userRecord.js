// pages/home/userRecord/userRecord.js
import { sendComment, getComment } from '../../../util/api.js';
import * as store from '../../../util/store.js';
import moment from '../../../util/moment.js';
import NavPannel from '../../../components/navBack/nav-back';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId: '',
    list: [],
    recordValue: '',
    page: 1,
    size: 15,
    total: 0,
  },

// 监听键盘输入
  bindKeyInput(e) {
    // console.log(e.detail.value);
    this.setData({
      recordValue: e.detail.value,
    });
  },

// 绑定发布事件
  submitRecord() {
    app.isLogin(() => {
      this.sendRecord();
    });
    // wx.showToast({
    //     msg: `发布了${this.data.recordValue}`,
    // });
    // console.log(`发布了${this.data.recordValue}`);
  },
  sendRecord() {
    const productId = this.data.productId;
    if (!this.data.recordValue) {
      wx.showToast({
        title: "评论不能为空",
        image: "/images/wrong.png",//仅支持success或者loading
        duration: 1500,
      });
      return;
    }
    sendComment({
      productId,
      text: this.data.recordValue,
    }).then((res) => {
      wx.showToast({
        title: "评论已提交审核",
        icon: "success",//仅支持success或者loading
        duration: 1500,
      });
      this.setData({
        recordValue: '',
      });
    });
  },


// 获取数据
  getCommentList() {
    const productId = this.data.productId;
    getComment({
      page: this.data.page,
      size: this.data.size,
      productId,
      step: 2,
    }).then((res) => {
      // console.log(res,23)
      let list;
      res.list.forEach((item) => {
        item.createFormat = moment(item.created).format('YYYY-MM-DD');
      });
      if (res.page == 1 || res.total == 0) {
        list = res.list;
      } else {
        list = this.data.list.concat(res.list);
      }
      this.setData({
        total: res.total,
        list,
      });
      // console.log(res);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const opProductId = options.productId;
    const productId = opProductId || app.globalData.currentRadioBook.productId;
    // console.log('real productId::=====', productId);
    this.setData({
      productId,
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
    this.setData({
      page: 1,
    });
    this.getCommentList();
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
    // console.log('页面上拉触底');
    // console.log(this.data.page,this.data.size,this.data.total)
    // console.log(this.data.page * this.data.size <= this.data.total)
    if (this.data.page * this.data.size <= this.data.total) {
      this.setData({
        page: this.data.page + 1,
      });
      this.getCommentList();
    }
  },
})