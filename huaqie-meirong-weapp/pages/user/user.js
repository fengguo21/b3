//index.js
//获取应用实例
var common = require("../../utils/api.js");
const app = getApp()

Page({
  data: {
    
    userInfo: '',
    hasUserInfo: false,
    name:'',
    avatarUrl:'',
    latestinfo:'',
    arrivetime:'',
    newcardtime:'',
    whichday:'',
    
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  tomyorderlist: function () {
    wx.navigateTo({
      url: '../orderlist/orderlist'
    })
  },
  tocoupon: function () {
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },
  tomycard: function () {
    wx.navigateTo({
      url: '../mycard/mycard'
    })
  },
  totomorrow: function () {
    wx.navigateTo({
      url: '../tomorrow/tomorrow'
    })
  },
  ffff:function(){
    wx.showModal({
      title: '提示',
      content: '确认取消预约吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShow: function () {
    var _this=this
    const me = wx.getStorageSync('me') || null
    if (!me) {
      getApp().auth((me) => {
        _this.setData({
          name: me.basic.name,
          avatarUrl: me.basic.avatar
        })
      })
    } 
    else {
      _this.setData({
      name: me.basic.name,
       avatarUrl: me.basic.avatar
    })
    }

    common.get('hyb/frontFindEventByState', {
      page: 1,
      size: 1
    }, res => {
console.log(32323232,res)
      res.list.forEach(e => {
        e.created = this.formatTime(e.created)
        e.basic.channel = this.formatstr(e.basic.channel)
      })

      if(res.list[0].basic.channel=='预约'){
        var bookdate=parseInt(res.list[0].basic.extra.date.substring(8,10))
        var today = parseInt(this.GetDateStr(0))
        var tomorrow = parseInt(this.GetDateStr(1))
        var aftertomorrow = parseInt(this.GetDateStr(2))
        var which=''
        if(bookdate==today){
          which='今天'
        }
        else if (bookdate == tomorrow) {
          
            which='明天'
         
        }
        else if (bookdate == aftertomorrow) {
          
            which= '后天'
          
        }
        else{
          which = res.list[0].basic.extra.date
        }
        this.setData({
          whichday:which
        })


        console.log(1,bookdate,today,tomorrow,aftertomorrow,this.data.whichday)

        this.setData({
          latestinfo: res.list[0],
          arrivetime: res.list[0].basic.extra.periods[0].substring(0, 5)

        })
        console.log(this.data.latestinfo)

      }
      

      else if (res.list[0].basic.channel == '办卡'){
        this.setData({
          latestinfo: res.list[0],
          newcardtime: res.list[0].created
          // arrivetime: res.list[0].basic.extra.periods[0].substring(0, 5)

        })

      }
      else if (res.list[0].basic.channel == '消费'){
        this.setData({
          latestinfo: res.list[0],
          newcardtime: res.list[0].created
          // arrivetime: res.list[0].basic.extra.periods[0].substring(0, 5)

        })
      }
      

      

      
     

    },
    )

    
  },
  GetDateStr: function(AddDayCount) { 
    var dd = new Date(); 
    dd.setDate(dd.getDate() + AddDayCount);
    
    var d = dd.getDate(); 
    return d; 
  },
  formatTime: function (tt) {
    var time = new Date(tt)
    var year = time.getFullYear()
    var month = ("0" + (time.getMonth() + 1)).slice(-2)
    var d = ("0" + time.getDate()).slice(-2);
    var hh = time.getHours()
    var mm = time.getMinutes()
    return year + "-" + month + '-' + d + "  " + hh + ':' + mm

  },
  formatstr: function (str) {
    if (str == "createCard") {
      return '办卡'
    }
    else if (str == 'consumeCard') {
      return '消费'
    }
    else if (str == 'prebook') {
      return '预约'
    }
  },
  
})


