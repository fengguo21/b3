// pages/reserve/reserve.js
import maskInit from '../../components/mask/mask';
import smaskInit from '../../components/successMask/success-mask';
import moment from '../../utils/moment';
import { postRoom, payOrder } from '../../utils/api';
import { isPhone, isIdCard, dateAdd } from '../../utils/tool';

const initPrice = (room, values, type) => {
  let totalPrice = values.length && values.length>0 
                             ? room.price * values.length
                             : room.price;
  if (type == 'special') {
    totalPrice = values.length && values.length>0 
                               ? room.price * values.length / 2
                               : room.price / 2;
  }
  return totalPrice;
};

const checkForm = (formData) => {
  let canPass = true;
  let wrongText = '';
  if (!formData.name) {
    wrongText = '请填写姓名';
    canPass = false;
  } else if (!formData.sex) {
    wrongText = '请选择性别';
    canPass = false;
  } else if (!isPhone(formData.tel)) {
    wrongText = '手机号错误';
    canPass = false;
  } else if (!isIdCard(formData.identityId)) {
    wrongText = '身份证错误';
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

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canClick: true,
    orderId: '',
    orderMsg: '',
    type: '',
    sexList: [
      {
        label: '女',
        value: 'F',
        checked: false,
      },
      {
        label: '男',
        value: 'M',
        checked: false,
      },
    ],
    roomMsg: {},
  // 支付成功相关数据
    smask: {
      title: '预约成功',
      tip: '',
      typehood: 1,
    },
    formParams: null,
  },
// 表单相关
  // 单选切换
  radioChange(e) {
    const sexList = this.data.sexList;
    sexList.forEach((item) => {
      item.checked = item.value == e.detail.value;
    });
    this.setData({
      sexList,
    });
  },
  // 监听身份证输入
  inputIdCard(e) {
    const idCard = e.detail.value;
    // console.log(idCard);
    const identityId = idCard.split('');
    const identityIdTwo = identityId[identityId.length - 2] % 2;
    if (idCard.length == 18) {
      const sexList = this.data.sexList;
      const sex = identityIdTwo ? 'M' : 'F';
      sexList.forEach((item) => {
        item.checked = item.value == sex;
      });
      this.setData({
        sexList,
      });
    }
  },

// 创建订单
  formSubmit(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    const formParams = e.detail.value;
    const special = this.data.type == 'special'
                    ? 'SPECIAL'
                    : '';
    formParams.roomId = this.data.roomId;
    formParams.conferenceId = this.data.conferenceId;
    formParams.dates = this.data.dates;
    formParams.special = special;
    this.setData({
      formParams,
    });
    // console.log(formParams); return
    this.toggleMask();
  },
  createOrder() {
    const identityId = this.data.formParams.identityId.split('');
    const identityIdTwo = identityId[identityId.length - 2] % 2;
    const sex = this.data.formParams.sex;
    if (!checkForm(this.data.formParams)) {
      return;
    }
    if ((identityIdTwo && sex == 'F') || (!identityIdTwo && sex == 'M')) {
      wx.showModal({
        title: '提示',
        content: '身份证号与性别不符',
        showCancel: false,
        confirmColor: '#be342a',
      });
      return;
    }
    this.setData({
      canClick: false,
    });
    postRoom(this.data.formParams).then((res) => {
      this.setData({
        canClick: true,
      });
      this.setData({
        orderId: res.orderId,
        orderMsg: res,
        'mask.showModal': !this.data.mask.showModal,
      });
    }).catch(() => {
      this.setData({
        canClick: true,
      });
    });
    // console.log('下单===============', this.data.formParams);
  },
  // 支付
  goPay(cb) {
    const res = this.data.orderMsg;
    // console.log("下单成功::================", res);
    payOrder({
      orderId: res.orderId,
      channel: 'WEPAY',
      subChannel: 'WIDGET'
    }).then((res) => {
      // console.log('支付参数：', res)
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': `prepay_id=${res.prepayId}`,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': (res) => {
          if (cb) {
            cb();
          }
          this.setData({
            orderMsg: '',
            'smask.tip': this.data.roomMsg.basic.title,
          });
        },
        'fail': (res) => {
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    const conferenceId = options.conferenceId;
    const roomId = options.roomId;
    const type = options.type;
    const dates = JSON.parse(options.dates);
    const room = JSON.parse(options.room);
    room.inDate = dates[0];
    room.outDate = dateAdd(dates[dates.length-1], 1);
    room.totalPrice = initPrice(room, dates, type);
    this.setData({
      roomMsg: room,
      dates,
      roomId,
      conferenceId,
      type,
    });
    app.rePage();
    new maskInit();
    new smaskInit();
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
    wx.hideShareMenu();
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
    return {
      title: `${this.data.roomMsg.basic.title}`,
      path: `/pages/indexShare/indexShare?orderId=${this.data.orderMsg.orderId}`,
      imageUrl: this.data.roomMsg.basic.avatar,
      success: (res) => {
        // 转发成功
      },
      fail: (res) => {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          image: '/images/wrong.png',
        });
      },
    };
  },
})