// pages/home/bookMenus/bookMenus.js
import { getComment } from '../../../util/api.js';
import { convertTimeHHMMSS } from '../../../util/tool.js';
import moment from '../../../util/moment.js';
import timeago from '../../../util/timeago.js';
import * as store from '../../../util/store.js';

const radioStopImg = '/images/book-radio.png';
const radioRunImg = '/images/book-run.png';
const app = getApp();
const allData = app.globalData;
const audioCtx = allData.audioCtx;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDetail: '',
// 公共数据
    isOpen: false,
    bookSummary: '',
    bookSummaryAll: '',
    recordList: [],
    radioStopImg,
    radioRunImg,
    radioList: [],
    hasVip: '',
    page: 1,
    size: 15,
    total: 0,
// 悬浮播放控制器模板数据
    hasRadio: false,
    radioRun: false,
    radioOther: {
      duration: '00:00',
      author: '未知',
      title: '未知',
      avatar: '未知',
    },
  },

  toggleOpen() {
    this.setData({
      isOpen: !this.data.isOpen,
    });
  },
  notShare() {
    wx.showModal({
      title: "提示",
      content: "您没有购买本书，不能分享",
      confirmColor: '#ffa42f',
      showCancel: false,
    });
    return;
  },
// 播放相关事件
  radioAll() {
    wx.showModal({
      title: "提示",
      content: "您没有购买本书，不能播放",
      confirmColor: '#ffa42f',
      showCancel: false,
    });
    return;
    app.canIUse(wx.getBackgroundAudioManager);
    audioCtx.stop();
    this.radioAllPice(0);
    allData.currentRadioBook = this.data.bookDetail;
    // this.radioPice();
  },

// 按序播放音频逻辑（递归函数）
  radioAllPice(index) {
    if (this.data.radioList.length <= 0) {
      wx.showModal({
        title: "提示",
        content: "这本书还没有音频，不能播放",
        confirmColor: '#ffa42f',
        showCancel: false,
      });
      return;
    }
    allData.currentRadioIndex = index;
    clearInterval(allData.timer);
    const startTime = moment().valueOf();
    const radioList = [...this.data.radioList];
// 判断是否播放至列表的最后一个音频;
    // console.log('run which way', index >= this.data.radioList.length);
    if (index >= this.data.radioList.length) {
      // console.log('stop');
      audioCtx.stop();
      radioList.forEach((item, key) => {
        item.isRun = false;
      });
      this.setData({
        hasRadio: true,
        radioRun: false,
        radioList,
      });
      return;
    }

// 不是最后一个音频则正常按序播放;
    // console.log('radio auto');
    audioCtx.stop();
    store.set('currentAudio', {audioIndex: index});
    const currentEl = this.data.radioList[index];
    audioCtx.src = currentEl.src;
    app.setOrigin();
    audioCtx.play();
    radioList.forEach((item, key) => {
      item.isRun = false;
      if (key == index) {
        item.isRun = true;
      }
    });
    this.setData({
      hasRadio: true,
      radioRun: true,
      radioList,
    });

// 启动定时器监听当前音频是否结束
    allData.timer = setInterval(() => {
      // console.log(audioCtx.duration)
      if (audioCtx.duration) {
        const runTime = moment().valueOf();
        const currentTime = (runTime - startTime) / 1000;
        if (currentTime >= audioCtx.duration) {
          this.radioAllPice(index + 1);
        }
      }
    }, 1000);
  },

// 单个播放音频逻辑
  radioPice(e) {
    wx.showModal({
      title: "提示",
      content: "您没有购买本书，不能播放",
      confirmColor: '#ffa42f',
      showCancel: false,
    });
    return;
    app.canIUse(wx.getBackgroundAudioManager);
    // audioCtx.src = 'undefined';
    const radioList = [...this.data.radioList];
    audioCtx.stop();
    const index = e.currentTarget.dataset.index;
    allData.currentRadioBook = this.data.bookDetail;
    allData.currentRadioIndex = index;
    store.set('currentAudio', {audioIndex: index});
    const currentEl = this.data.radioList[index];
    audioCtx.src = currentEl.src;
    app.setOrigin();
    audioCtx.play();
    radioList.forEach((item, key) => {
      item.isRun = false;
      if (key == index) {
        item.isRun = true;
      }
    });
    this.setData({
      hasRadio: true,
      radioRun: true,
      radioList,
    });
  },
  clearRadio() {
    const radioList = [...this.data.radioList];
    radioList.forEach((item, key) => {
      item.isRun = false;
    });
    // audioCtx.pause();
    this.setData({
      radioList,
    });
  },

// 模板相关事件
  closeFloat() {
    audioCtx.pause();
    allData.floatState = false;
    this.setData({
      radioRun: false,
      hasRadio: false,
    });
    // this.clearRadio();
  },
  toggleFloatRadio() {
    let status = this.data.radioRun;
    status = !status;
    if (status) {
      audioCtx.play();
    } else {
      audioCtx.pause();
    }
    this.setData({
      radioRun: status,
    });
    console.log('toggle the Float Radio');
  },

// 监听函数
  listenPause() {
    audioCtx.onPause(() => {
      clearInterval(allData.timer);
      this.setData({
        radioRun: false,
      });
    });
  },
  listenPlay() {
    if (!audioCtx.paused) {
      this.setData({
        radioRun: true,
      });
    } else {
      this.setData({
        radioRun: false,
      });
    }
    audioCtx.onPlay(() => {
      this.initFloat();
      this.setData({
        radioRun: true,
      });
    });
  },
  listenEnd() {
    audioCtx.onEnded(() => {
      this.setData({
        radioRun: false,
      });
    });
  },

// 独立逻辑，判断是否存在音频
  isRunRadio() {
    let hasRadio;
    if (allData.floatState) {
      hasRadio = true;
    } else {
      hasRadio = false;
    }
    this.setData({
      hasRadio,
    });
  },
// 获取数据
  getCommentList(productId) {
    getComment({
      productId,
      page: this.data.page,
      size: this.data.size,
      step: 2,
    }).then((res) => {
      let recordList;
      res.list.forEach((item) => {
        item.createFormat = moment(item.created).format('YYYY-MM-DD');
      });
      if (res.page == 1 || res.total == 0) {
        recordList = res.list;
      } else {
        recordList = this.data.recordList.concat(res.list);
      }
      this.setData({
        recordList: res.list,
        total: res.total,
      });
    })
  },
// 导航相关
  navToVip() {
    wx.navigateTo({
      url: '/pages/home/openVip/openVip',
    })
  },
  navToDetail(e) {
    wx.showModal({
      title: "提示",
      content: "您没有购买本书，不能阅读",
      confirmColor: '#ffa42f',
      showCancel: false,
    });
    return;
    const radioIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/home/bookDetail/bookDetail?radioIndex=${radioIndex}`,
    })
  },
  navToRadio() {
    wx.navigateTo({
      url: '/pages/home/bookVedio/bookVedio',
    })
  },
  buyBook() {
    wx.navigateTo({
      url: `/pages/mine/myOrder/myOrder`,
    })
  },

// 初始化悬浮条
  initFloat() {
    // console.log(allData);
    const detail = allData.currentRadioBook;
    const index = allData.currentRadioIndex;
    if (detail && index < detail.basic.audios.length) {
      this.setData({
        radioOther: {
          author: detail.basic.author,
          title: detail.basic.audios[index].title,
          duration: convertTimeHHMMSS(detail.basic.audios[index].period),
          avatar: detail.basic.avatar,
        },
      });
    }
  },
// 生命周期相关
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const bookDetail = store.get('currentBook');
    bookDetail.price = bookDetail.basic.price.toFixed(2);
    this.setData({
      bookDetail,
    });
    wx.setNavigationBarTitle({
      title: bookDetail.basic.title,
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
    app.canIUse(wx.getBackgroundAudioManager);
    // 获取图书简介并且 设置隐藏
    const book = this.data.bookDetail;
    console.log(book);
    let hasVip;
    const vipConfig = store.get('app').extra.vips || false;
    if (!vipConfig || vipConfig.length <= 0) {
      hasVip = false;
    } else {
      hasVip = true;
    }
    const maxLength = 100;
    let bookSummary = '';
    const bookSummaryAll = book.basic.text ? book.basic.text : '';
    const summary = bookSummaryAll.slice(0, maxLength);
    if (summary.length >= maxLength) {
      bookSummary = `${summary}...`;
    } else {
      bookSummary = summary;
    }
    book.basic.audios.forEach((item) => {
      // console.log(item);
      item.duration = convertTimeHHMMSS(item.period);
      item.createTime = timeago().format(item.created, 'zh_CN');
      item.isComplate = false;
      item.isRun = false;
      item.src = item.path;
    });
    // console.log(book.basic.audios);
    this.setData({
      bookSummaryAll,
      bookSummary,
      hasVip,
      radioList: book.basic.audios,
    });
    this.setData({
      page: 1,
    });
    this.getCommentList(book.productId);
    this.isRunRadio();
    this.listenPlay();
    this.listenPause();
    this.listenEnd();
    this.initFloat();
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
    if (this.data.page * this.data.size < this.data.total) {
      this.setData({
        page: this.data.page + 1,
      });
      this.getCommentList(this.data.bookDetail.productId);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      return {
        title: this.data.bookDetail.basic.title,
        path: `/pages/mine/buyDetail/buyDetail?productId=${this.data.bookDetail.productId}&audioIndex=${res.target.dataset.index}`,
        success: function(res) {
        },
        fail: function() {
          wx.showToast({
            title: '分享失败',
            image: '/images/wrong.png',
            mask: true,
            duration: 1500,
          });
        }
      }
    } else {
      return {
        title: this.data.bookDetail.basic.title,
        path: `/pages/mine/buyDetail/buyDetail?productId=${this.data.bookDetail.productId}&audioIndex=0`,
        success: function(res) {
        },
        fail: function() {
          wx.showToast({
            title: '分享失败',
            image: '/images/wrong.png',
            mask: true,
            duration: 1500,
          });
        }
      }
    }
  },
})