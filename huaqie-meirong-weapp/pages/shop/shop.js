// shop.js
var common = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

    productList: [],

    advertises: ['https://qbox.huaqie.com/Ft0HYJebLn-dF2mWl8dIZ1UWJsjm','https://qbox.huaqie.com/Ft0HYJebLn-dF2mWl8dIZ1UWJsjm'],

    total: 0,
    page: 1,
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
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
    this.getProductList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  getProductList() {
    common.get('product/findByState', {
      page: this.data.page,
      size: 20
    }, res => {
      this.setData({
        total: res.total
      })
      console.log(res, 777)

      res.list.forEach(e => {

      })
      this.setData({
        productList: this.data.productList.concat(res.list),

      })

    },
    )
  },
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