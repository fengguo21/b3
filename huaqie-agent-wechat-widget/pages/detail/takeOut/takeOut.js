// takeOut.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        link: '/pages/index/index',
        url: 'https://dn-huaqie.qbox.me/agent-t8.png',
        title:"蛋糕房"
      }, {
        link: '/pages/index/index',
        url: 'https://dn-huaqie.qbox.me/agent-t10.png',
        title: "水果店"
      }, {
        link: '/pages/index/index',
        url: 'https://dn-huaqie.qbox.me/agent-t11.png',
        title: "鲜花店"
      }
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    circular: true
  },


   

    /**
     *    * 生命周期函数--监听页面加载
     *    */
       onLoad: function (options) {
           
       },


       swiperclick: function (e) {//点击图片触发事件
         console.log(1)
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
      title: '欢乐送商城解决方案',
      desc: '小程序开发!',
      path: '/pages/detail/takeOut/takeOut'
    }
  },
})