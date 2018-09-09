// smallShop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        link: '/pages/index/index',
        url: 'https://dn-huaqie.qbox.me/agent-t28.png',
        title: "红酒店"
      }, {
        link: '/pages/index/index',
        url: 'https://dn-huaqie.qbox.me/agent-t29.png',
        title: "茶叶店"
      },
      {
        link: '/pages/index/index',
        url: 'https://dn-huaqie.qbox.me/agent-t30.png',
        title: "手表店"
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
      title: '精品商铺解决方案',
      desc: '小程序开发!',
      path: '/pages/detail/smallShop/smallShop'
    }
  },
})