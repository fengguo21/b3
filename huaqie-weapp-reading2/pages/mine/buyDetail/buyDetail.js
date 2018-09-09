// pages/home/bookMenus/bookMenus.js
import { getComment, getBookById } from '../../../util/api.js';
import { convertTimeHHMMSS } from '../../../util/tool.js';
import moment from '../../../util/moment.js';
import timeago from '../../../util/timeago.js';
import * as store from '../../../util/store.js';
import NavPannel from '../../../components/navBack/nav-back';

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
    productId: '',
    bookDetail: '',
// 公共数据
    isOpen: false,
    page: 1,
    size: 15,
    total: 0,
    bookSummary: '',
    recordList: [],
    bookSummaryAll: '',
    recordList: [],
    radioStopImg,
    radioRunImg,
    radioList: [],
    hasVip: '',
// 悬浮播放控制器模板数据
    hasRadio: false,
    radioRun: false,
    radioOther: {
      duration: '00:00',
      author: '未知',
      title: '未知',
      avatar: '未知',
    },
// 是否显示购买
    isShowBuy: false,
    hasVip: false,
  },

  toggleOpen() {
    this.setData({
      isOpen: !this.data.isOpen,
    });
  },

// 播放相关事件
  radioAll() {
    app.isLogin(() => {
      app.canIUse(wx.getBackgroundAudioManager);
      app.modeHasVip()
      .then((res) => {
        // console.log(res);
        // 有会员直接播放
        audioCtx.stop();
        allData.currentRadioBook = this.data.bookDetail;
        this.radioAllPice(0);
        // console.log('can run ');
      })
      .catch((error) => {
        // 没有会员判断是否购买
        if (error.message == 'vip_deadline') {
          audioCtx.stop();
          allData.currentRadioBook = this.data.bookDetail;
          this.radioAllPice(0);
        } else {
          app.modeHasBuy(this.data.bookDetail).then(() => {
            audioCtx.stop();
            allData.currentRadioBook = this.data.bookDetail;
            this.radioAllPice(0);
          })
          .catch(() => {
            wx.showModal({
              title: "提示",
              content: "您没有购买本书，不能播放",
              showCancel: false,
              confirmColor: "#5b595d",
            });
          });
        }
      });
    });
    // this.radioPice();
  },

// 按序播放音频逻辑（递归函数）
  radioAllPice(index) {
    if (this.data.radioList.length <= 0) {
      wx.showModal({
        title: "提示",
        content: "这本书还没有音频，不能播放",
        confirmColor: '#e84213',
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
    // allData.timer = setInterval(() => {
    //   console.log(audioCtx.duration)
    //   if (audioCtx.duration) {
    //     const runTime = moment().valueOf();
    //     const currentTime = (runTime - startTime) / 1000;
    //     if (currentTime >= audioCtx.duration) {
    //       this.radioAllPice(index + 1);
    //     }
    //   }
    // }, 1000);
  },

// 单个播放音频逻辑
  radioPice(e) {
    app.isLogin(() => {
      app.modeHasVip()
      .then((res) => {
        // console.log(res);
        // 有会员直接播放
        this.radio(e);
      })
      .catch((error) => {
        // 没有会员判断是否购买
        if (error.message == 'vip_deadline') {
          this.radio(e);
        } else {
          app.modeHasBuy(this.data.bookDetail).then(() => {
            this.radio(e);
          })
          .catch(() => {
            wx.showModal({
              title: "提示",
              content: "您没有购买本书，不能播放",
              showCancel: false,
              confirmColor: "#5b595d",
            });
          });
        }
      });
    });
  },
  radio(e) {
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
    // console.log('toggle the Float Radio');
  },

// 监听函数
  listenPause() {
    audioCtx.onPause(() => {
      // clearInterval(allData.timer);
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
      const book = this.data.bookDetail;
      const currentRadioBook = allData.currentRadioBook;
      const currentIndex = allData.currentRadioIndex;
      if (book.productId == currentRadioBook.productId) {
        book.basic.audios.forEach((item, key) => {
          item.isRun = false;
          if (key == currentIndex) {
            item.isRun = true;
          }
        });
      }
      this.setData({
        radioRun: false,
        radioList: book.basic.audios,
      });
    });
  },

// 独立逻辑，判断是否存在音频
  isRunRadio() {
    // console.log(audioCtx.src == 'https://error');
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
    const radioIndex = e.currentTarget.dataset.index;
    app.canIUse(wx.getBackgroundAudioManager);
    app.modeHasVip()
    .then((res) => {
      // console.log(res);
      // 有会员直接播放
      wx.navigateTo({
        url: `/pages/home/bookDetail/bookDetail?radioIndex=${radioIndex}`,
      })
    })
    .catch((error) => {
      // 没有会员判断是否购买
      if (error.message == 'vip_deadline') {
        wx.navigateTo({
          url: `/pages/home/bookDetail/bookDetail?radioIndex=${radioIndex}`,
        })
      } else {
        app.modeHasBuy(this.data.bookDetail).then(() => {
          wx.navigateTo({
            url: `/pages/home/bookDetail/bookDetail?radioIndex=${radioIndex}`,
          })
        })
        .catch(() => {
          wx.showModal({
            title: "提示",
            content: "您没有购买本书，不能阅读",
            showCancel: false,
            confirmColor: "#5b595d",
          });
        });
      }
    });
  },
  navToRadio() {
    wx.navigateTo({
      url: '/pages/home/bookVedio/bookVedio',
    })
  },
  buyBook() {
    store.set('currentBook', this.data.bookDetail);
    wx.navigateTo({
      url: `/pages/mine/myOrder/myOrder`,
    })
  },
  navToRecord() {
    const productId = this.data.bookDetail.productId;
    // console.log('navProductId::=====================', productId);
    wx.navigateTo({
      url: `/pages/home/userRecord/userRecord?productId=${productId}`,
    });
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
  initPage() {
    const book = this.data.bookDetail;
    const currentRadioBook = allData.currentRadioBook;
    const currentIndex = allData.currentRadioIndex;
    // console.log(book);
    let hasVip;
    const vipConfig = store.get('app') ? store.get('app').extra.vips : false;
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
    if (book.productId == currentRadioBook.productId) {
      book.basic.audios.forEach((item, key) => {
        item.isRun = false;
        if (key == currentIndex) {
          item.isRun = true;
        }
      });
    }
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
    this.initPower();
    this.isRunRadio();
    this.listenPause();
    this.listenPlay();
    this.listenEnd();
    this.initFloat();
  },
  // 初始化权限，查看是否显示购买按钮
  initPower() {
    // console.log('init start');
    app.modeHasVip()
    .then((res) => {
      // console.log('is vip');
      this.setData({
        isShowBuy: false,
      });
    })
    .catch((error) => {
      // 没有会员判断是否购买
      // console.log('error:: ========== ::', error);
      if (error.message == 'system_vip_inval') {
        // console.log('system_vip_inval');
        this.setData({
          hasVip: true,
        });
      }
      if (error.message == 'vip_deadline') {
        // 会员过期
        // console.log('vip_deadline');
        this.setData({
          isShowBuy: false,
        });
      } else {
        // 查看是否购买
        app.modeHasBuy(this.data.bookDetail).then(() => {
          // console.log('has buy');
          this.setData({
            isShowBuy: false,
          });
        })
        .catch(() => {
          // console.log('not buy');
          this.setData({
            isShowBuy: true,
          });
        });
      }
    });
  },
// 生命周期相关
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new NavPannel();
    const productId = options.productId;
    // console.log(productId);
    let bookDetail = store.get('currentBook');
    if (productId) {
      getBookById({
        productId,
      }).then((res) => {
        bookDetail = res;
        bookDetail.price = bookDetail.basic.price.toFixed(2);
        this.setData({
          bookDetail,
          prouctId: bookDetail.productId,
        });
        wx.setNavigationBarTitle({
          title: bookDetail.basic.title,
        });
        this.initPage();
      });
      return;
    }
    bookDetail.price = bookDetail.basic.price.toFixed(2);
    this.setData({
      bookDetail,
      prouctId: bookDetail.productId,
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
    if (this.data.bookDetail) {
      app.canIUse(wx.getBackgroundAudioManager);
      // 获取图书简介并且 设置隐藏
      this.initPage();
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
    // console.log('页面上拉触底');
    // console.log(this.data.page, this.data.size)
    // console.log(this.data.page * this.data.size <= this.data.total)
    if (this.data.page * this.data.size <= this.data.total) {
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
    // console.log(this.data.bookDetail.productId);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
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
  }
})