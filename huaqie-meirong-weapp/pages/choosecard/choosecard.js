// mycard.js
var common = require("../../utils/api.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseicon:"",
    peopleId:'',
    cards:[],
    selected:[],
    sales:'',
    page:1,
    enable:true,
  },
  
 

  
  choosecard:function(event){
    var idx = event.currentTarget.dataset.index
    var feed = event.currentTarget.dataset.feed
    const cardId = event.currentTarget.dataset.cardid
    var ratio = event.currentTarget.dataset.ratio
    var sales=this.data.sales
    var ren=this.data.cards
    var type = event.currentTarget.dataset.type
    for(var w=0;w<ren.length;w++){

      ren[w]=false
    }
    ren[idx]=true
    this.setData({
      selected:ren
    })
      if(type == 1){
        wx.navigateTo({
          url: "/pages/howtimes/howtimes?feed=" + feed + "&sales=" + sales + "&ratio="+ratio + '&cardId=' + cardId
        })
      }else if(type == 2){
        wx.navigateTo({
          url: "/pages/howmuch/howmuch?feed=" + feed + "&sales=" + sales + "&ratio="+ratio + '&cardId=' + cardId
        })
      }else{
        var that = this
        if (this.data.enable == false) {
          wx.showToast({
            title: '稍后重试...',
            icon: 'loading',
            duration: 1000
          })
          setTimeout(function () {
            that.setData({
              enable: true
            })
          }, 5000);
          return
        }
        else if (this.data.enable == true) {
          that.setData({
            enable: false
          })
        console.log(feed,90)
        common.post('hyb/consumeMember', {
          feedId: feed,
          amount: 1,
          salesPeopleId: sales
        }, res => {
          console.log(123456789)
          wx.redirectTo({
            url: '../orderlist/orderlist'
          
           
          })
          setTimeout(function () {

            that.setData({
              enable: true
            })
          }, 5000)
          
        },)
      }}
    },
  

  getdata: function () {
    
    common.get('hyb/findMemberByState', {
      page: this.data.page,
      size: 10,
      step: 2,
      peopleId: this.data.peopleId
    }, res => {
      console.log(4567,res.list)
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

  onLoad: function (options) {
    var _this = this
    const me = wx.getStorageSync('me') || null
    console.log(me,12)
    if (!me) {
      getApp().auth((me) => {
        _this.setData({
          name: me.basic.name,
          avatarUrl: me.basic.avatar
        })
      })
    } 
    console.log(options,55555)
    var that = this;
    this.setData({
      sales:options.peopleId
    })
    wx.getStorage({
      key: 'peopleId',
      success: function (res) {

        console.log(1111, res)
        that.setData({
          peopleId: res.data
        })
        that.getdata()
       
      },
      fail: function (res) {
        // console.log(res)
      },
      complete: function (res) { },
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