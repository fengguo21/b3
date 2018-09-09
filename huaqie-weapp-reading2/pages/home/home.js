// pages/home/home.js
import { getBanner, getCatalog, fetchCoupon, getBookList, getArticleList, getVipConfig, getCouponById, getBookReadMsg, getBookById, readBook } from '../../util/api.js';
import * as store from '../../util/store.js';
import { formatNumber, convertTimeHHMMSS } from '../../util/tool.js';
import moment from '../../util/moment.js';
import timeago from '../../util/timeago.js';

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
// 原页面相关数据
    page: 1,
    size: 15,
    showModal: false,
    bannerList: [],
    currentBanner: 0,
    couponMsg: '',
    bookList: [],
    bookTotal: 0,
    tabs: [],
    selectTab: '',
    tabType: '',
//  模板相关数据
    showOutTimeModal: false,
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

  bannerChange(ev) {
    // console.log('detail', ev.detail);
    const currentBanner = ev.detail.current;
    this.setData({
      currentBanner,
    });
  },
  clickBanner(e) {
    app.isLogin(() => {
      const detail = e.currentTarget.dataset.detail;
      // mode为1导向活动 为2导向优惠券
      let newText = detail.text;
      if (detail.mode == 1) {
        newText = newText.replace(/\n/g, '<br>')
                         .replace(/<div><br><\/div>/g, '');
        const newDetail = {
          title: detail.title,
          text: newText,
        }
        // console.log(newDetail);
        store.set('activeAdvise', newDetail);
        wx.navigateTo({
          url: '/pages/home/bannerAdvise/bannerAdvise',
        });
        // console.log(detail);
      } else if (detail.mode == 2) {
        // console.log(detail);
        this.getCouponById(detail.text).then((res) => {
          this.setData({
            couponMsg: res,
          });
          this.toggleModal();
        });
      } else if (detail.mode == 3) {
        getBookById({
          productId: detail.text,
        }).then((res) => {
          this.bannerToDetail(res);
        });
      } else if (detail.mode == 4) {
        wx.navigateTo({
          url: '/pages/home/openVip/openVip',
        });
      }
    });
  },
  // 弹窗开关
  toggleModal() {
    this.setData({
      showModal: !this.data.showModal,
    });
  },
  // 选择tab
  changeTab(e) {
    const currentId = e.currentTarget.id;
    const type = e.currentTarget.dataset.type;
    if (store.get('prevTab')) {
      // 判断是否重复点击当前tab
      const prevTab = store.get('prevTab');
      if (prevTab.title != currentId) {
        // console.log('不同tab');
        store.set('prevTab', {
          title: currentId,
          type,
        });
        this.setData({
          selectTab: currentId,
          page: 1,
          tabType: type,
          bookList: [],
        });
      }
    } else {
      // console.log('未存在tab');
      store.set('prevTab', {
        title: currentId,
        type,
      });
      this.setData({
        selectTab: currentId,
        page: 1,
        tabType: type,
        bookList: [],
      });
    }
    if (type == 1) {
      this.getBookList(currentId);
    } else if (type == 2) {
      // console.log('图文分类');
      this.getArticleList();
    }
  },

// 播放事件
  radioAll(e) {
    const detail = e.currentTarget.dataset.detail;
    if (detail.basic.typehood == 1) {
      this.radioAllClear(detail);
    } else if (detail.basic.typehood == 2) {
      this.listToDetail(detail);
    }
  },
  // 不是图文分类的情况下执行播放
  radioAllClear(detail) {
    app.isLogin(() => {
      detail.basic.audios.forEach((item) => {
        item.src = item.path;
      });
      this.setData({
        radioList: detail.basic.audios,
      });
      // 判断这个版本是否是有会员的
      app.modeHasVip()
      .then((res) => {
        // console.log(res);
        // 有会员直接播放
        app.canIUse(wx.getBackgroundAudioManager);
        audioCtx.stop();
        allData.currentRadioBook = detail;
        allData.currentRadioIndex = 0;
        this.radioAllPice(0);
        // console.log('can run ');
      })
      .catch((error) => {
        // 没有会员判断是否购买
        if (error.message == 'vip_deadline') {
          this.showOutTimeModal();
        } else {
          app.modeHasBuy(detail).then(() => {
            app.canIUse(wx.getBackgroundAudioManager);
            audioCtx.stop();
            allData.currentRadioBook = detail;
            allData.currentRadioIndex = 0;
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
  },
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
    audioCtx.stop();
    store.set('currentAudio', {audioIndex: index});
    const currentEl = this.data.radioList[index];
    audioCtx.src = currentEl.src;
    app.setOrigin();
    // console.log(audioCtx);
    audioCtx.play();
    this.setData({
      hasRadio: true,
      radioRun: true,
    });
// 启动定时器监听当前音频是否结束
    // allData.timer = setInterval(() => {
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
      // clearInterval(allData.timer);
      // clearInterval(allData.timer);
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

// 独立逻辑，判断是否存在音频
  isRunRadio() {
    let hasRadio;
    // console.log(audioCtx.src);
    if (allData.floatState) {
      hasRadio = true;
    } else {
      hasRadio = false;
    }
    this.setData({
      hasRadio,
    });
  },

// 模板相关事件
  toggleOutTimeModal() {
    this.setData({
      showOutTimeModal: !this.data.showOutTimeModal,
    });
  },
  closeFloat() {
    audioCtx.stop();
    allData.floatState = false;
    this.setData({
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

// 获取服务器数据相关

  getBannerList() {
    getBanner({
      page: 1,
      size: 15,
    }).then((res) => {
      // console.log(res);
      this.setData({
        bannerList: res.list,
      });
    });
  },
  // 获取分类
  getCatalogList() {
    return getCatalog({
      page: 1,
      size: 15,
    }).then((res) => {
      let selectTab;
      if (store.get('prevTab')) {
        selectTab = store.get('prevTab').title;
      } else {
        selectTab = res.list[0].basic.title;
      }
      this.setData({
        tabs: res.list,
        selectTab,
      });
      return new Promise((resolve) => {
        resolve(res.list[0].basic);
      });
      // console.log(res);
    });
  },
  getBookList(catalog) {
    // console.log(this.data.page);
    getBookList({
      page: this.data.page,
      size: this.data.size,
      catalog,
      step: 1,
    }).then((res) => {
      console.log(res);
      store.set('list',res.list)
      res.list.forEach((item) => {
        item.newReadCount = formatNumber(item.basic.readCount);
        item.bookPrice = item.basic.price.toFixed(2);
        if (item.basic.tags[0]) {
          item.tag = item.basic.tags[0].toLowerCase();
        }
      });
      let bookList;
      // console.log(res.list);
      if (res.page == 1 || res.total == 0) {
        bookList = res.list;
      } else {
        bookList = this.data.bookList.concat(res.list);
      }
      this.setData({
        bookList,
        bookTotal: res.total,
      });
    });
  },
  getArticleList() {
    getArticleList({
      page: this.data.page,
      size: this.data.size,
      step: 1,
    }).then((res) => {
      res.list.forEach((item) => {
        item.newReadCount = formatNumber(item.basic.readCount);
        if (item.basic.tags[0]) {
          item.tag = item.basic.tags[0].toLowerCase();
        }
      });
      let bookList;
      // console.log(res.list);
      if (res.page == 1 || res.total == 0) {
        bookList = res.list;
      } else {
        bookList = this.data.bookList.concat(res.list);
      }
      this.setData({
        bookList,
        bookTotal: res.total,
      });
    });
  },
  getCouponById(couponId) {
    return getCouponById({
      couponId,
    }).then((res) => {
      // console.log(res);
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },

// 导航相关
// 前往文章详情
  goDetail(e) {
    // console.log('go detail');
    const detail = e.currentTarget.dataset.detail;
    const productId = e.currentTarget.dataset.product;
    if (detail.basic.typehood == 1) {
      this.goDetailClear(detail, productId);
    } else if (detail.basic.typehood == 2) {
      this.listToDetail(detail, productId);
    }
  },
  // 如果不是图文类型的文章那么跳转相应页面
  goDetailClear(detail, productId) {
    app.isLogin(() => {
      store.set('currentBook', detail);
      // console.log(app);
      app.modeHasVip()
      .then((res) => {
        wx.navigateTo({
          url: `/pages/mine/buyDetail/buyDetail?productId=${productId}`,
        });
      })
      .catch((error) => {
        // console.log(error);
        // 没有会员判断是否购买
        if (error.message == 'vip_deadline') {
          wx.navigateTo({
            url: `/pages/home/bookMenus/bookMenus?productId=${productId}`,
          });
        } else {
          app.modeHasBuy(detail).then(() => {
            wx.navigateTo({
              url: `/pages/mine/buyDetail/buyDetail?productId=${productId}`,
            });
          })
          .catch(() => {
            wx.navigateTo({
              url: `/pages/home/bookMenus/bookMenus?productId=${productId}`,
            });
          });
        }
      });
    });
  },
  getCoupon(e) {
    app.isLogin(() => {
      const couponId = e.currentTarget.dataset.couponId;
      fetchCoupon({
        couponId,
      }).then((res) => {
        this.toggleModal();
        wx.navigateTo({
          url: '/pages/mine/coupon/coupon',
        });
      });
    });
    // console.log(e.currentTarget.dataset);
  },
  navToRadio() {
    wx.navigateTo({
      url: '/pages/home/bookVedio/bookVedio',
    })
  },
  navToVip() {
    this.toggleOutTimeModal();
    wx.navigateTo({
      url: '/pages/home/openVip/openVip',
    });
  },
  listToDetail(detail, productId) {
    // detail.basic.content = detail.basic.content
    //                        .replace(/<div><br><\/div>/g, '');
    store.set('activeArticle', detail);
    // console.log(detail.productId);
    readBook({
      productId: productId,
    }).then((res) => {
      // store.set('me', res);
    });
    wx.navigateTo({
      url: `/pages/home/freeArticle/freeArticle?productId=${productId}`,
    });
  },
  bannerToDetail(bookDetail) {
    app.isLogin(() => {
      const detail = bookDetail;
      store.set('currentBook', detail);
      // console.log(app);
      app.modeHasVip()
      .then((res) => {
        wx.navigateTo({
          url: '/pages/mine/buyDetail/buyDetail',
        });
      })
      .catch((error) => {
        // console.log(error);
        // 没有会员判断是否购买
        if (error.message == 'vip_deadline') {
          wx.navigateTo({
            url: '/pages/home/bookMenus/bookMenus',
          });
        } else {
          app.modeHasBuy(detail).then(() => {
            wx.navigateTo({
              url: '/pages/mine/buyDetail/buyDetail',
            });
          })
          .catch(() => {
            wx.navigateTo({
              url: '/pages/home/bookMenus/bookMenus',
            });
          });
        }
      });
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
    this.getBannerList();
    this.getCatalogList().then((res) => {
      let selectTab;
      let tabType;
      if (store.get('prevTab')) {
        selectTab = store.get('prevTab').title;
        tabType = store.get('prevTab').type;
      } else {
        store.set('prevTab', {
          title: res.title,
          type: res.typehood,
        });
        selectTab = res.title;
        tabType = res.typehood;
      }
      this.setData({
        page: 1,
        tabType,
      });
      if (tabType == 1) {
        this.getBookList(selectTab);
      } else if (tabType == 2) {
        this.getArticleList();
      }
    });
    this.listenPlay();
    this.listenPause();
    this.listenEnd();
    this.isRunRadio();
    this.initFloat();
    if (store.get('me')) {
      getVipConfig({}).then((res) => {
        store.set('app', res);
      });
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
    if (this.data.page * this.data.size <= this.data.bookTotal) {
      // console.log('没有全部加载完成');
      this.setData({
        page: this.data.page + 1,
      });
      // console.log('页面触底');
      if (this.data.tabType == 1) {
        this.getBookList(this.data.selectTab);
      } else if (this.data.tabType == 2) {
        this.getArticleList();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})