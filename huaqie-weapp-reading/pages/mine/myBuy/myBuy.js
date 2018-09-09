// pages/mine/myBuy/myBuy.js
import { getCanReadBook } from '../../../util/api.js';
import * as store from '../../../util/store.js';
import { formatNumber, convertTimeHHMMSS } from '../../../util/tool.js';

import moment from '../../../util/moment.js';
import timeago from '../../../util/timeago.js';

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
    booklist: [],
    page: 1,
    size: 15,
    total: 0,
// 模板数据
    // 悬浮播放窗口数据
    radioList: [],
    radioRun: false,
    hasRadio: false,
    radioOther: {
      duration: '00:00',
      author: '未知',
      title: '未知',
      avatar: '未知',
    },
  },

// 获取数据
  getBookList() {
    getCanReadBook({
      page: this.data.page,
      size: this.data.size,
    }).then((res) => {
      console.log(res);
      res.list.forEach((item) => {
        item.newReadCount = formatNumber(item.basic.readCount);
      });
      let booklist;
      if (res.page == 1 || res.total == 0) {
        booklist = res.list;
      } else {
        booklist = this.data.booklist.concat(res.list);
      }
      console.log(booklist);
      this.setData({
        booklist,
        total: res.total,
      });
    });
  },
// 播放事件
  radioAll(e) {
    const detail = e.currentTarget.dataset.detail;
    app.isLogin(() => {
      detail.basic.audios.forEach((item) => {
        item.src = item.path;
      });
      allData.currentRadioBook = detail;
      this.setData({
        radioList: detail.basic.audios,
      });
      app.canIUse(wx.getBackgroundAudioManager);
      audioCtx.stop();
      this.radioAllPice(0);
    });
  },
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
      this.setData({
        hasRadio: true,
        radioRun: false,
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
    this.setData({
      hasRadio: true,
      radioRun: true,
    });

// 启动定时器监听当前音频是否结束
    // allData.timer = setInterval(() => {
    //   // console.log(audioCtx.duration)
    //   if (audioCtx.duration) {
    //     const runTime = moment().valueOf();
    //     const currentTime = (runTime - startTime) / 1000;
    //     if (currentTime >= audioCtx.duration) {
    //       this.radioAllPice(index + 1);
    //     }
    //   }
    // }, 1000);
  },

// 监听函数
  listenPause() {
    audioCtx.onPause(() => {
      app.readBook();
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
      app.readBook();
      this.setData({
        radioRun: true,
      });
    });
  },
  listenEnd() {
    audioCtx.onEnded(() => {
      app.readBook();
      app.endEvent();
      this.setData({
        radioRun: false,
      });
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

// 独立逻辑，判断是否存在音频
  isRunRadio() {
    console.log(audioCtx.src);
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
// 导航相关
// 前往文章详情
  goDetail(e) {
    // console.log('go detail');
    app.isLogin(() => {
      const detail = e.currentTarget.dataset.detail;
      store.set('currentBook', detail);
      wx.navigateTo({
        url: '/pages/mine/buyDetail/buyDetail',
      });
    });
  },
  navToRadio() {
    wx.navigateTo({
      url: '/pages/home/bookVedio/bookVedio',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getBookList();
    this.listenPause();
    this.listenPlay();
    this.listenEnd();
    this.isRunRadio();
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
    if (this.data.page * this.data.size <= this.data.total) {
      this.setData({
        page: this.data.page + 1,
      });
      this.getBookList();
    }
  },

})