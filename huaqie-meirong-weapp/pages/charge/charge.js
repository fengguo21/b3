// charge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookToastHidden: true,
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    wx.request({
      url: "https://g2.huaqie.com/cloud/prebook/create1111",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",

      data: {
        sessionId: 'sessionId', appId: '5975add7437db858ed72b0be',
        formId: e.detail.formId
      },
      success: function (res) {
        console.log(res.data)
        
      },
      

    })

  },
  bindToastTap: function () {
    console.log('预定成功')
    this.setData({
      bookToastHidden: false
    })
  },
  hideToast: function () {
    this.setData({
      bookToastHidden: true
    })
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
  
  }
})