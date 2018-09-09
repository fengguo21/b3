// pages/map/map.js
import * as store from '../../utils/store';

let timer = null;

const app = getApp();
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
  return s;
};

const endLocal = {};
// 获取坐标
const getPosition = () => {
  const appMsg = store.get('app');
  const position = appMsg.basic.position;
  const poiArr = position.split(',');
  endLocal.latitude = poiArr[0];
  endLocal.longitude = poiArr[1];
  // console.log(poiArr);
};
getPosition();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: {
      scale: '5',
      center: {
        latitude: '',
        longitude: '',
      },
      markers: [{
        iconPath: "/images/icon-location-end.png",
        id: 0,
        latitude: endLocal.latitude,
        longitude: endLocal.longitude,
        width: 30,
        height: 30
      }],
    },
  },
// 点击地图控件
  controlTap(e) {
    const id = e.controlId;
    if (id === 1) {
      this.roundToGet();
    }
  },
// 地图设置
  // 缩放地图
  scaleMap(diff) {
    let scale;
    if (diff <= 1) {
      scale = 18;
    } else if (diff <= 10) {
      scale = 14;
    } else if (diff <= 30) {
      scale = 12;
    } else {
      scale = 10;
    }
    this.setData({
      'map.scale': scale,
    });
  },
  // 设置line
  setPolyline(start) {
    let polyline = [{
      points: [ start, endLocal ],
      color: '#BE342ADD',
      width: 2,
    }];
    this.setData({
      'map.polyline': polyline,
    });
  },
  // 设置控件
  setControl() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          'map.controls': [{
            id: 1,
            iconPath: '/images/icon-location-reload.png',
            position: {
              left: 30,
              top: res.windowHeight - 70,
              width: 40,
              height: 40,
            },
            clickable: true,
          }],
        });
      },
    });
  },
  // 单次获取地理位置
  getLocal() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        const diff = getDistance(longitude, latitude, endLocal.longitude, endLocal.latitude);
        this.scaleMap(diff);
        this.setPolyline({ longitude, latitude });
        this.setData({
          'map.center': { longitude, latitude },
        });
      }
    })
  },
  // 持续获取当前位置
  roundToGet() {
    clearTimeout(timer);
    this.getLocal();
    timer = setTimeout(() => {
      this.roundToGet();
    }, 5000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.rePage();
    this.roundToGet();
    this.setControl();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap');
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
    clearTimeout(timer);
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