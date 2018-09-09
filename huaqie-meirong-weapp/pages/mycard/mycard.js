// mycard.js
var common = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  peopleId:'',
  cards:[],
  total: 0,
  tips: '',
  page:1
  },

  toconsume:function(e){
    var feed = e.currentTarget.dataset.feed
    var typehood = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../consume/consume?'+'feed='+feed+'&&type='+typehood,
    })
  },

  getdata:function(){
    this.setData({
      cards:[]
    })
    console.log(111,this.data.peopleId)
    common.get('hyb/findMemberByState', {
      page: this.data.page,
      size: 10,
      step: 2,
      peopleId: this.data.peopleId
    }, res => {
      console.log(this.data.peopleId)

      this.setData({
        cards: this.data.cards.concat(res.list)
      })

      console.log(456, this.data.cards)
    },



    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onShow: function () {
    var that=this;
    wx.getStorage({
      key: 'peopleId',
      success: function(res) {
        
        console.log(1111,res)
       that.setData({
         peopleId:res.data
       })
       that.getdata()
        console.log('re',that.data.peopleId)
      },
      fail: function(res) {
        // console.log(res)
      },
      complete: function(res) {},
    })
   
    
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
 

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