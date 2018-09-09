// pages/index/index.js
import { getBusList, getLine ,getSessionId} from '../../utils/api.js';
import * as store from '../../utils/store.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    width: 0,
    lines:[],
  },
  getSize:function(){
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        // console.log('getSystemInfo');
        // console.log(res.windowWidth,res.windowHeight);

        that.setData({
           width: res.windowWidth,
           height: res.windowHeight
        })
      }
    })
  },
  tomap(e){
    const lineIndex = e.currentTarget.dataset.index;
    store.set('currentline', e.currentTarget.dataset.line);
    store.set('currentLineIndex', lineIndex);
    // console.log(this.height)
    wx.navigateTo({
      url: '../map/map'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    this.getSize()
    let param = {page:1,size:10}
    getLine(param).then(function(res){
      // console.log(res)
      res.list.forEach( function(element, index) {
        element.basic.title = element.basic.step == '2'?element.basic.title + "(停运)":element.basic.title
      })

      self.setData({
        lines:res.list
      })
      // console.log(self.data.lines,'text')
    })
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
  onShareAppMessage: function () {

  }
})