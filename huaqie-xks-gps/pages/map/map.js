// pages/map/map.js
import { getBusList, getLine, getSessionId } from '../../utils/api.js';
import * as store from '../../utils/store.js';
import moment from '../../utils/moment';

/**
 * 
 * @param {Number} nowWidth 当前屏幕的宽度
 * @param {Number} elWidth 需要转换的元素宽度
 */
const newWidth = (nowWidth, elWidth) => elWidth / 375 * nowWidth;

const calloutConfig = {
  color: '#333333',
  fontSize: 13,
  borderRadius: 5,
  bgColor: '#ffffff',
  display: 'ALWAYS',
  padding: 8,
};

const EARTH_RADIUS = 6378.137; //地球半径

// 计算地图亮点坐标距离
const rad = (d) => {
  return d * Math.PI / 180.0;
};
/**
* lng1  经度1
* lat1  纬度1
* lng2  经度2
* lat2  纬度2
* return 距离（千米）
*/
const getDistance = (lng1, lat1, lng2, lat2) => {
  const radLat1 = rad(lat1);
  const radLat2 = rad(lat2);
  const a = radLat1 - radLat2;
  const b = rad(lng1) - rad(lng2);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
          + Math.cos(radLat1) * Math.cos(radLat2)
          * Math.pow(Math.sin(b / 2), 2)));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s.toFixed(1);
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    map_width: 0,
    map_height: 0,
    scale: 14,
    ii: 3,
    showLocation: false,
    longitude: 0,
    latitude: 0,
    polyline: [{
      points: [{
        longitude: 121.244,
        latitude: 31.058399999999985
      }, {
        latitude: 31.059,
        longitude: 121.246,
      }, {
        longitude: 121.2486,
        latitude: 31.0692
      }],
      color: "#f56c6c",
      width: 3,
      dottedLine: true,
    }],
    markers: [
      {
        iconPath: "../../images/icon-end.png",
        id: 0,
        latitude: 31.031910,
        longitude: 121.130060,
        width: 35,
        rotate: 0,
        height: 45,
        callout: {
          content: '小昆山驾校',
          ...calloutConfig,
        },
      }, 
      {
        iconPath: "../../images/icon-bus.png",
        id: 1,
        latitude: 31.031910,
        longitude: 121.130060,
        width: 39,
        height: 48,
        callout: {
          content: '正在查询',
          ...calloutConfig,
        },
      },
      {
        iconPath: "../../images/icon-me.png",
        id: 2,
        latitude: 31.031910,
        longitude: 121.130060,
        width: 35,
        height: 45,
        callout: {
          content: '我的位置',
          ...calloutConfig,
        },
      },
    ]
  },
  toSchedule() {
    wx.navigateTo({
      url: '../schedule/schedule'
    })
  },
  getCurentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          'markers[2].latitude': res.latitude,
          'markers[2].longitude': res.longitude,
          scale: 14,
        });
      },
      fail: function () {}
    });
  },
  setCurentLocation(lat, lng) {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const diff = getDistance(res.longitude, res.latitude, lng, lat);
        this.setData({
          'markers[2].latitude': res.latitude,
          'markers[2].longitude': res.longitude,
          'markers[1].callout.content': `距离我${diff}km`,
        });
      },
      fail: function () {}
    });
  },
  moveToLocation: function () {
    this.getCurentLocation();
  },
  translateMarker(lat, lng) {
    // console.log('设置图标位置', lat, lng, markerId)
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: false,
      duration: 1000,
      destination: {
        latitude: Number(lat),
        longitude: Number(lng),
      },
      animationEnd: () => {
        this.setData({
          'markers[1].latitude': lat,
          'markers[1].longitude': lng,
        });
        this.setCurentLocation(lat, lng);
      }
    })
  },


  getPolyLines() {
    var line = store.get('currentline').basic.line;
    let linearr = [];
    line.forEach(function (element, index) {
      linearr.push({ latitude: element.position[1], longitude: element.position[0] });
    });
    // console.log(linearr)
    let points = 'polyline[0].points'
    this.setData({
      [points]: linearr,
    });
  },

  getSize: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log((res.windowWidth - 105) / 2);
        that.setData({
          map_width: res.windowWidth,
          map_height: res.windowHeight,
          controls: [{
            id: 1,
            iconPath: "../../images/sm.png",
            position: {
              left: newWidth(res.windowWidth, 325),
              top: newWidth(res.windowWidth, 431),
              width: newWidth(res.windowWidth, 35),
              height: newWidth(res.windowWidth, 35)
            },
            clickable: true
          }, {
            id: 2,
            iconPath: "../../images/la.png",
            position: {
              left: newWidth(res.windowWidth, 325),
              top: newWidth(res.windowWidth, 395),
              width: newWidth(res.windowWidth, 35),
              height: newWidth(res.windowWidth, 35)
            },
            clickable: true
          }, {
            id: 3,
            iconPath: "../../images/location.png",
            position: {
              left: newWidth(res.windowWidth, 15),
              top: newWidth(res.windowWidth, 500),
              width: newWidth(res.windowWidth, 35),
              height: newWidth(res.windowWidth, 35)
            },
            clickable: true
          }, {
            id: 4,
            iconPath: "../../images/schedule.png",
            position: {
              left: newWidth(res.windowWidth, 135),
              top: newWidth(res.windowWidth, 495),
              width: newWidth(res.windowWidth, 105),
              height: newWidth(res.windowWidth, 46)
            },
            clickable: true
          }]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSize();
    this.getCurentLocation();
  },
  controltap: function (e) {
    var that = this;
    let scale = this.data.scale;
    if (e.controlId == 1) {
      // 放大
      // console.log(scale);
      scale -= 1;
      if (scale < 5) {
        scale = 5;
      }
      that.setData({
        scale,
      })
    } else if (e.controlId == 2) {
      // 缩小
      scale += 1;
      if (scale > 17) {
        scale = 17;
      }
      that.setData({
        scale,
      })
    } else if (e.controlId == 3) {
      // 回到当前定位
      this.moveToLocation();
    } else if (e.controlId == 4) {
      // 跳转至时刻表
      that.toSchedule();
    }
    // console.log(this.data.scale);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var lineId = store.get('currentline').basic.vehicleId;
    let self = this;
    wx.connectSocket({
      url: 'wss://gps.huaqie.com',
      method: "GET",
      fail: function () {
        // console.log('fail')
      },
    });
    wx.onSocketOpen(function (res) {});
    var count = 0;
    wx.onSocketMessage((res) => {
      let pos = JSON.parse(res.data);

      for (var i = 0; i < pos.list.length; i++) {
        if (pos.list[i].vehicleId == lineId) {
          self.translateMarker(pos.list[i].lat, pos.list[i].lng);
        }
      }
    });
    wx.onSocketClose(function (res) {
      // console.log('WebSocket 已关闭！')
      wx.connectSocket({
        url: 'wss://gps.huaqie.com',
        method: "GET",
        fail: function () {},
      });
    });
    wx.onSocketError(function (res) {
      // console.log('WebSocket连接打开失败，请检查！')
      wx.connectSocket({
        url: 'wss://gps.huaqie.com',
        method: "GET",
        fail: function () {},
      });
    });
    this.mapCtx = wx.createMapContext('map');
    this.getPolyLines();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const linename = store.get('currentline').basic.title;
    wx.setNavigationBarTitle({
      title: linename,
    });
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