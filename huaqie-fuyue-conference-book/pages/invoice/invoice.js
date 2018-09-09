// pages/invoice/invoice.js
import { createInvioce } from '../../utils/api';

const app = getApp();

// 表单验证
const validForm = (formData) => {
  let canPass = true;
  let wrongText = '';
  if (!formData.title) {
    wrongText = '请填写公司名称';
    canPass = false;
  } else if (!formData.taxNo) {
    wrongText = '请填写税号';
    canPass = false;
  } else if (!formData.address) {
    wrongText = '请填写单位地址';
    canPass = false;
  } else if (!formData.tel) {
    wrongText = '请填写公司电话';
    canPass = false;
  } else if (!formData.bank) {
    wrongText = '请填写开户银行';
    canPass = false;
  } else if (!formData.account) {
    wrongText = '请填写银行账户';
    canPass = false;
  }
  if (!canPass) {
    wx.showModal({
      title: '提示',
      content: wrongText,
      showCancel: false,
      confirmColor: '#be342a',
    })
  }
  return canPass;
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    typeList: [
      {
        label: '电子',
        value: 1,
        checked: true,
      },
      {
        label: '纸质',
        value: 2,
        checked: false,
      },
    ],
    chooseType: 1,
  },

// 表单相关
  // 单选切换
  radioChange(e) {
    const typeList = this.data.typeList;
    typeList.forEach((item) => {
      item.checked = item.value == e.detail.value;
    });
    this.setData({
      typeList,
      chooseType: e.detail.value,
    });
  },
  // 表单提交
  formSubmit(e) {
    app.isLogin(() => {
      // console.log('form发生了submit事件，携带数据为：', e.detail.value);
      if (validForm(e.detail.value)) {
        createInvioce({
          orderId: this.data.orderId,
          ...e.detail.value,
        }).then((res) => {
          wx.showToast({
            title: "已提交开票信息",
            icon: "success",//仅支持success或者loading
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index',
            });
          }, 1500);
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const orderId = options.orderId;
    this.setData({
      orderId,
    });
    app.rePage();
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
  // onShareAppMessage: function () {

  // }
})