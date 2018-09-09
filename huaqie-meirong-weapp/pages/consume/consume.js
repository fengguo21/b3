// orderlist.js
var common = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      consumelist:[],
      feed:'',
      page:1,
      total: 0,
      tips: '',
      typehood:0,

    



  },
  classes: function () {
    if (item.classes == '预约') {
      return classes1
    }
    else if (item.classes == '服务') {
      return classes2
    }
    else {
      return classes3
    }
  },

  f() {
    if (this.data.page * 20 >= this.data.total) {
      console.log('到底了')
      this.setData({
        tips: '---- 没有更多了 ----'
      })
      return
    }

    this.setData({
      tips: '加载中...'
    })
    console.log(234)
    this.setData({
      page: this.page + 1

    })
    this.getdata()
  },

  getdata:function(options){
    common.get('hyb/findEventByState', {
      page: this.data.page,
      size: 20,
      feedId: this.data.feed
    }, res => {

      res.list.forEach(e => {
        e.created = this.formatTime(e.created)
       
      })
      console.log(22222222,res)
      this.setData({
        consumelist:this.data.consumelist.concat(res.list)
      })


    },
    )
  },
  formatTime: function (tt) {
    var time = new Date(tt)
    var year = time.getFullYear()
    var month = ("0" + (time.getMonth() + 1)).slice(-2)
    var d = ("0" + time.getDate()).slice(-2);
    var hh = ("0" + time.getHours()).slice(-2);
    var mm = ("0" + time.getMinutes()).slice(-2);
    return year + "-" + month + '-' + d + "  " + hh + ':' + mm

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
this.setData({
  feed:options.feed,
  typehood:options.type
})
    
    common.get('hyb/findEventByState', {
      page:1,
      size:20,
      feedId:options.feed
    }, res => {
      res.list.forEach(e => {
        e.created = this.formatTime(e.created)

      })
      console.log(res)
      this.setData({
        consumelist:res.list
      })


    },
    )

    
   
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