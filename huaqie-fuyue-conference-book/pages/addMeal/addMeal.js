// pages/addMeal/addMeal.js
import moment from '../../utils/moment';
import maskInit from '../../components/mask/mask';
import smaskInit from '../../components/successMask/success-mask';
import { jionMeal, payOrder, getMealById } from '../../utils/api';
import { diffDate, dateAdd, objValues } from '../../utils/tool';
import * as store from '../../utils/store';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    conferenceId: '',
    grouponId: '',
    orderId: '',
    peopleId: '',
    selectCount: 0,
    selectList: [],
    // 获取到的已选中数组
    selectDates: [],
    canClick: true,
    conference: {},
    detail: {},
    checkboxItems: [],

// 成功弹窗数据
    smask: {
      title: '参团成功',
      tip: '20',
      typehood: 2,
    },
  },

  goCreate() {
    if (this.data.orderId) {
      if (this.data.selectDates.length <= 0) {
        wx.showToast({
          title: '当前订单已支付',
        });
        return;
      }
      this.goPay(() => {
        this.setData({
          selectDates: [],
        });
        this.getMealMsg();
      });
      return;
    }
    if (!this.data.canClick) {
      wx.showModal({
        title: '提示',
        content: '订单正在提交，请不要重复操作',
        showCancel: false,
        confirmColor: '#be342a',
      })
      return;
    }
    const count = this.data.selectCount;
    if (count && count > 0) {
      this.toggleMask();
    } else {
      wx.showModal({
        title: "提示",
        content: "没有选择拼团日期不能拼团",
        showCancel: false,
        confirmText: "确定",
        confirmColor: "#be342a",
      });
    }
  },
// 创建订单
  createOrder() {
    // console.log(this.data.selectList); return;
    this.setData({
      canClick: false,
    });
    jionMeal({
      conferenceId: this.data.conferenceId,
      grouponId: this.data.grouponId,
      dates: this.data.selectList,
    }).then((res) => {
      this.setData({
        canClick: true,
      });
      this.setData({
        orderMsg: res,
        'mask.showModal': !this.data.mask.showModal,
      });
    }).catch(() => {
      this.setData({
        canClick: true,
      });
    });
    // console.log('下单===============');
    // this.setData({
    //   'mask.showModal': !this.data.mask.showModal,
    // });
  },
  // 支付
  goPay(cb) {
    const res = this.data.orderMsg;
    const orderId = this.data.orderId
                    ? this.data.orderId
                    : res.orderId;
    // console.log("下单成功::================", res);
    payOrder({
      orderId,
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
            'smask.tip': '指定人数',
          });
        },
        'fail': (res) => {
        }
      })
    })
  },
// 复选框改变事件
  selectCheck(e) {
    if (this.data.orderId) {
      wx.showModal({
        title: '提示',
        content: '您不是参团人，不能选择拼团日期',
        showCancel: false,
        confirmColor: '#be342a',
      });
      return;
    }
  },
  checkboxChange(e) {
    if (this.data.orderId) {
      wx.showModal({
        title: '提示',
        content: '您不是参团人，不能选择拼团日期',
        showCancel: false,
        confirmColor: '#be342a',
      });
      return;
    }
    const values = e.detail.value;
    const checkboxItems = this.data.checkboxItems;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      // 改变选中
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if(checkboxItems[i].value == values[j]){
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    values.sort();
    // 率先捕捉执行了这个事件，所以将值赋予全局
    this.setData({
      selectCount: values.length,
      selectList: values,
      checkboxItems,
    });
  },
  // 初始化checkbox, 存在orderId禁用
  initCheckbox(checkboxItems, values) {
    // const checkboxItems = this.data.checkboxItems;
    const buyList = [];
    const selectList = this.data.selectDates;
    values.forEach((item) => {
      if (selectList.indexOf(item)) {
        buyList.push(item);
      }
    });
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      if (values.length > 0 && this.data.orderId) {
        checkboxItems[i].disabled = true;
      }
      // 已经买过的全部变为isBuy
      for (var j = 0, lenJ = buyList.length; j < lenJ; ++j) {
        if(checkboxItems[i].value == buyList[j]){
          checkboxItems[i].isBuy = true;
          break;
        }
      }
      // 被选中的全部变为被选中
      for (var j = 0, lenJ = selectList.length; j < lenJ; ++j) {
        if(checkboxItems[i].value == selectList[j]){
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    return checkboxItems;
  },

// 数据获取
  getMealMsg() {
    const peopleId = this.data.peopleId
                     ? this.data.peopleId
                     : store.get('me').peopleId;
    getMealById({
      peopleId,
    }).then((ret) => {
      // console.log(res);
      const values = ret.dates;
      const res = ret.groupon;
      let checkboxItems = [];
      const meeting = ret.conference;
      const diff = diffDate(meeting.startDate, meeting.endDate);
      const today = moment().format('YYYY-MM-DD');
      // console.log(diff);
      // console.log(res);
      for(let i = 0; i < diff; ++ i) {
        const date = dateAdd(res.startDate, i, 'MM月DD日');
        const dateValue = dateAdd(res.startDate, i, 'YYYY-MM-DD');
        // 获取每天被售出的列表
        const daySaledList = dateValue in res.soldCount ? objValues(res.soldCount[dateValue]) : [];
        // 计算每天被售出的数量
        const daySaledCount = daySaledList.length && daySaledList.length > 0
                              ? daySaledList.reduce((prev, current) => prev + current)
                              : 0;
        // console.log(minCount);
        let isOutline = false;
        if (moment(dateValue).valueOf() < moment(today).valueOf()) {
          isOutline = true;
        }
        let disabled = false;
        if (daySaledCount > res.maxCount) {
          disabled = true;
        }
        checkboxItems.push({
          date: date,
          count: res.minCount - daySaledCount <= 0
                 ? 0
                 : res.minCount - daySaledCount,
          value: dateValue,
          isOutline,
        });
      }
      // 选中已选的日期
      // if (values.length > 0 && this.data.orderId) {
      //   for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      //     checkboxItems[i].disabled = true;
      //     for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
      //       if(checkboxItems[i].value == values[j]){
      //         checkboxItems[i].checked = true;
      //         break;
      //       }
      //     }
      //   }
      // }
      checkboxItems = this.initCheckbox(checkboxItems, values);
      res.time = '周一至周日11:20-13:30、17:30-19:30';
      this.setData({
        detail: res,
        checkboxItems,
        conference: meeting,
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const conferenceId = options.conferenceId;
    const grouponId = options.grouponId;
    const orderId = options.orderId;
    const peopleId = options.peopleId;
    const selectDates = JSON.parse(options.selectDates || "[]");
    // console.log(selectDates);
    this.setData({
      conferenceId,
      grouponId,
      orderId: orderId || '',
      peopleId: peopleId || '',
      selectDates,
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
    app.checkToken(() => {
      app.isLogin(() => {
        this.getMealMsg();
      });
    });
    // if (this.data.orderId) {
    //   this.initCheckbox();
    // }
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
    const selectDates = JSON.stringify(this.data.orderMsg.basic.dates);
    return {
      title: `${this.data.detail.title}`,
      path: `/pages/addMeal/addMeal?orderId=${this.data.orderMsg.orderId}&conferenceId=${this.data.conferenceId}&grouponId=${this.data.grouponId}&selectDates=${selectDates}&peopleId=${this.data.peopleId}`,
      imageUrl: this.data.detail.avatar,
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
  }
})