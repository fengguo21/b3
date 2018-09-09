// coupon.js
var common = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

page:1,
    prebook:[],
    creatCard:[],
    consumeCard:[],
    total:'',
    pre:'',
    cre:'',
    con:'',
    total: 0,
    tips: '',
    length:0,

    
    line1:true,
    line2:false,
    line3:false
  
  },


  tabs1: function () {
    this.setData({
      line1: true,
      line2:false,
      line3:false
    })
  },
  tabs2: function () {
   
    this.setData({
      line2: true,
      line1: false,
      line3: false
    })
  },
  tabs3: function () {
    
    this.setData({
      line3: true,
      line2: false,
      line1: false
    })
  },
  f() {
    console.log(this.data.length,111222333)
    if (this.data.page * 250 >= this.data.length) {
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
      page: this.data.page + 1

    })
    this.getdata()
  },
  onReachBottom:function(){
    console.log(5555)
  },
  formatTime: function (tt) {
    var time = new Date(tt)
    var year = time.getFullYear()
    var day=time.getDate()
    var month = ("0" + (time.getMonth() + 1)).slice(-2)
    var hh = ("0" + time.getHours()).slice(-2);
    var mm = ("0" + time.getMinutes()).slice(-2);
    return year + "-" + month + "-" +day+" "+ hh + ':' + mm

  },

  getdata:function(){
    var that=this
    common.get('people/findScoreByState', {
      page: this.data.page,
      size: 250,

    }, res => {
      res.list.forEach(e => {
        e.created = this.formatTime(e.created)
        
      })
      console.log(111, res)
      var ren = []
      var ya = []
      var kun = []
      
     this.setData({
       length:res.total
     })
      for (var i = 0; i < res.list.length; i++) {
        if (res.list[i].extra.channel == 'prebook') {
          ren.push(res.list[i])
        }
        else if (res.list[i].extra.channel == 'consumeCard') {
          ya.push(res.list[i])
        }
        else if (res.list[i].extra.channel == 'createCard') {
          kun.push(res.list[i])
        }
      }
     
      this.setData({
        prebook: this.data.prebook.concat(ren),
        consumeCard: this.data.consumeCard.concat(ya),
        creatCard: this.data.creatCard.concat(kun)
      })
      console.log(this.data.creatCard)
    },
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.get('hyb/findScoreReport', {
    }, res => {
      this.setData({
        total:res.total,
        pre:res.prebook,
        con:res.consumeCard,
        cre:res.createCard
      })
     
      
    },
    )
    
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
  console.log(444444)
  this.f()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})