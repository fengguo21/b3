// customer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        link: '/pages/index/index',
        url: 'https://dn-huaqie.qbox.me/agent-t20.png',
        title:"美发店"
      }, {
        link: '/pages/index/index',
        url: 'https://dn-huaqie.qbox.me/agent-t21.png',
        title: "按摩店"
      }, {
        link: '/pages/index/index',
        url: 'https://dn-huaqie.qbox.me/agent-t22.png',
        title: "瑜伽馆"
      }
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    circular:true
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
    return {
      title: '客临门解决方案',
      desc: '小程序开发!',
      path: '/pages/detail/customer/customer'
    }
  },
})