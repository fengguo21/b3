// pages/home/bookVedio/bookVedio.js
import { convertTimeHHMMSS } from '../../../util/tool.js';
import * as store from '../../../util/store.js';
import NavPannel from '../../../components/navBack/nav-back';

const runIcon = '/images/vedio-run.png';
const stopIcon = '/images/vedio-stop.png';
const app = getApp();
const allData = app.globalData;
const audioCtx = allData.audioCtx;
let timerReady = null;
let startPosition;
let winWidth;
let contorllerW;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioIndex: '',
    radioStatus: false,
    runIcon,
    stopIcon,
    currentTime: '00:00',
    remaintime: '00:00',
    progress: 0,
    touchMoveProgress: 0,
    isFirst: true,
    isLast: false,

    radioOther: {
      duration: '00:00',
      author: '未知',
      title: '未知',
      avatar: '未知',
    },
  },

// 音乐播放
  prev() {
    audioCtx.stop();
    const index = allData.currentRadioIndex;
    const detail = allData.currentRadioBook;
    if (allData.currentRadioIndex - 1 <= 0) {
      allData.currentRadioIndex = 0;
    } else {
      allData.currentRadioIndex = index - 1;
    }
    app.setOrigin();
    audioCtx.play();
    // console.log(allData.currentRadioIndex)
    // this.setData({
    //   radioOther: {
    //     duration: '00:00',
    //     author: detail.basic.avatar,
    //     title: detail.basic[allData.currentRadioIndex].title,
    //     avatar: detail.basic.author,
    //   },
    // });
  },
  next() {
    audioCtx.stop();
    const index = allData.currentRadioIndex;
    const detail = allData.currentRadioBook;
    // console.log(detail);
    if (index >= detail.basic.audios.length - 1) {
      allData.currentRadioIndex = detail.basic.audios.length - 1;
    } else {
      allData.currentRadioIndex = index + 1;
    }
    app.setOrigin();
    audioCtx.play();
  },
  toggleRadioStatus() {
    app.canIUse(wx.getBackgroundAudioManager);
    let status = this.data.radioStatus;
    // console.log(`获取到的status::=============::${status}`);
    status = !status;
    // console.log(status);
    this.radioRun(status);
    // console.log(`重置后的status::=============::${status}`);
  },
  radioRun(status) {
    if (status) {
      // this.setTimes();
      audioCtx.play();
    } else {
      audioCtx.pause();
    }
    this.setData({
      radioStatus: status,
    });
  },
  readyTimes() {
    // let count = 0;
    // timerReady = setInterval(() => {
    //   count += 1;
    //   console.log(audioCtx.duration);
    //   if (count >= 10) {
    //     clearInterval(timerReady);
    //     timerReady = null;
    //     wx.showToast({
    //       title: "音频超时",
    //       image: "/images/wrong.png",//仅支持success或者loading
    //       duration: 1500,
    //     });
    //     return;
    //   }

    if (audioCtx.duration) {
      const remaintime = audioCtx.duration - audioCtx.currentTime;
      this.setData({
        currentTime: convertTimeHHMMSS(audioCtx.currentTime),
        remaintime: convertTimeHHMMSS(remaintime),
        progress: audioCtx.currentTime / audioCtx.duration,
      });
    }
    // }, 1000);
  },

// 移动控件事件
  moveStart(e) {
    const startLong = e.changedTouches[0].clientX;
    audioCtx.pause();
    startPosition = startLong;
    // startPosition
  },
  movey(e) {
    // if (audioCtx.duration) {
      let progress;
      let touchMoveProgress;
      const currentTime = audioCtx.currentTime;
      const moveLong = e.changedTouches[0].clientX;
      const movePosition = moveLong - startPosition;
      const moveProgress = movePosition / contorllerW * audioCtx.duration;
      if ((currentTime + moveProgress) >= audioCtx.duration) {
        progress = 1;
        touchMoveProgress = audioCtx.duration;
        // audioCtx.seek(audioCtx.duration);
      } else if(currentTime + moveProgress <= 0) {
        progress = 0;
        touchMoveProgress = 0;
      } else {
        progress = (currentTime + moveProgress) / audioCtx.duration;
        touchMoveProgress = currentTime + moveProgress;
        // audioCtx.seek(currentTime + moveProgress);
      }
      // console.log(moveProgress);
      this.setData({
        progress,
        touchMoveProgress,
      });
    // }
  },
  moveEnd(e) {
    // if (audioCtx.src) {
      let runTime;
      if (this.data.touchMoveProgress >= audioCtx.duration) {
        runTime = audioCtx.duration;
      } else {
        runTime = this.data.touchMoveProgress;
      }
      // const runTime = parseInt(this.data.touchMoveProgress, 10);
      if (runTime < audioCtx.duration) {
        // audioCtx.startTime = runTime;
        // audioCtx.seek(runTime);
        app.setProgress(runTime).then(() => {
          audioCtx.play();
        });
        // this.setData({
        //   progress: this.data.touchMoveProgress / audioCtx.duration,
        // });
        // setTimeout(() => {
        // audioCtx.play();
        // }, 200);
      } else {
        app.setProgress(0).then(() => {
          app.endEvent();
        });
      }

    // }
  },

// 监听事件
  listenPlay() {
    if (!audioCtx.paused) {
      this.setData({
        radioStatus: true,
      });
    } else {
      this.setData({
        radioStatus: false,
      });
    }
    audioCtx.onPlay(() => {
      this.initFloat();
      app.readBook();
      this.setData({
        radioStatus: true,
      });
    });
  },
  listenRunning() {
    audioCtx.onTimeUpdate(() => {
      const duration = parseInt(audioCtx.duration, 10);
      const currentTime = parseInt(audioCtx.currentTime, 10);
      let progress = (currentTime / duration).toFixed(3);
      let remaintime = duration - currentTime;
      let current = currentTime;
      if (remaintime <= 0) {
        remaintime = 0;
        progress = 0;
        current = duration;
      }
      // console.log('audioCtx is TimeUpdate', current, remaintime, progress);
      this.setData({
        currentTime: convertTimeHHMMSS(current),
        remaintime: convertTimeHHMMSS(remaintime),
        progress,
      });
    });
  },
  listenEnd() {
    audioCtx.onEnded(() => {
      app.readBook();
      app.endEvent();
      const remaintime = audioCtx.duration;
      // console.log(audioCtx.duration);
      audioCtx.pause();

      // audioCtx.startTime = 0;
      this.setData({
        radioStatus: false,
        currentTime: convertTimeHHMMSS(0),
        remaintime: convertTimeHHMMSS(remaintime),
        progress: 0,
      });
    });
  },
  listenStop() {
    audioCtx.onStop(() => {
      // audioCtx.pause();
      app.readBook();
      this.setData({
        radioStatus: false,
      });
    });
  },
  listenPause() {
    audioCtx.onPause(() => {
      // audioCtx.pause();
      app.readBook();
      this.setData({
        radioStatus: false,
      });
    });
  },
  init() {
    this.readyTimes();
    this.listenPlay();
    this.listenPause();
    this.listenEnd();
    this.listenRunning();
    this.listenStop();
    this.initFloat();
  },


// 导航相关
  goBookDetail() {
    wx.navigateTo({
      url: `../bookDetail/bookDetail?radioIndex=${allData.currentRadioIndex}`,
    });
  },
  navToRecord() {
    wx.navigateTo({
      url: '../userRecord/userRecord',
    });
  },

// 初始化悬浮条
  initFloat() {
    // console.log(allData);
    const detail = allData.currentRadioBook;
    const index = allData.currentRadioIndex;
    if(index <= 0) {
      this.setData({
        isFirst: true,
        isLast: false,
      });
    } else if (index >= detail.basic.audios.length - 1) {
      this.setData({
        isFirst: false,
        isLast: true,
      });
    } else {
      this.setData({
        isFirst: false,
        isLast: false,
      });
    }
    if (detail && index < detail.basic.audios.length) {
      this.setData({
        radioIndex: index,
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
    new NavPannel();
    const radioIndex = allData.currentRadioIndex;
    this.setData({
      radioIndex,
    });
    // app.canIUse(wx.getBackgroundAudioManager);
    // this.audioCtx = wx.getBackgroundAudioManager();
    // audioCtx.src = 'https://shershen08.github.io/vue-plugins-demo-static/dist/sample.mp3';
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('ready', audioCtx);
    // console.log(app);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
    wx.getSystemInfo({
      success: (res) => {
        winWidth = res.windowWidth;
        contorllerW = 516 / 750 * winWidth;
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.radioPause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // audioCtx.pause();
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
  onShareAppMessage: function (res) {
    const detail = allData.currentRadioBook;
    // console.log(detail);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      return {
        title: detail.basic.title,
        path: `/pages/mine/buyDetail/buyDetail?productId=${detail.productId}&audioIndex=${allData.currentRadioIndex}`,
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
        title: detail.basic.title,
        path: `/pages/mine/buyDetail/buyDetail?productId=${detail.productId}&audioIndex=${allData.currentRadioIndex}`,
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