// detail.js
var common = require("../../utils/api.js");
var commonx = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enable: true,
    n: 0,
    name: '',
    work: '',
    img: '',
    id: '',
    service: '',
    date: '',
    idx: 0,
    bookToastHidden: true,
    periods: [],
    peopleId: '',
    a: 0,
    b: 0,
    prebooktimes: 0,
    reserved: [],
    available: [],
    promotePeriods: {},

    t: [],
    worktime: [],
    fullday: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'],
    line1: true,
    line2: false,
  },
  tabs1: function () {
    this.getdate(1)
    this.setData({
      line1: true,
      line2: false,
    })
    this.getdata()
  },
  tabs2: function () {
    this.getdate(2)
    this.setData({
      line2: true,
      line1: false,
    })
    this.getdata()
  },

  onpost: function () {
    var that = this
    if (this.data.enable == true) {
      this.data.n = 0
      for (var q = 0; q < this.data.t.length; q++) {
        if (this.data.t[q] === true) {
          this.setData({
            n: this.data.n + 1
          })
        }
      }
      if (this.data.n == 0) {
        wx.showModal({
          title: '小提示',
          content: '请选择预约时段',
          confirmColor: '#ff8ec6',
          showCancel: false
        })
        return
      }

      that.setData({
        periods: []
      })
      for (var i = 0; i < this.data.t.length; i++) {

        if (this.data.t[i] === true) {
          this.data.periods.push(this.data.worktime[i])
        }
      }
      var that = this
      console.log(this.data.periods)
      common.post('hyb/prebook', {
        service: this.data.service,
        periods: this.data.periods,
        salesPeopleId: this.data.id,
        date: this.data.date,
      }, res => {
        this.setData({
          enable: false,

        })
        setTimeout(function () {
          that.setData({
            enable: true
          })
        }, 5000)
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 2000
        })
        wx.redirectTo({
          url: '../orderlist/orderlist',
        })
      }
      )
    }
  },
  choosetab: function (event) {
    var idx = event.currentTarget.dataset.idx
    idx = parseInt(idx)
    this.setData({
      idx: idx
    })
    if (this.data.available[idx] == false) {
      return
    }

    var ff = 0
    for (var f = 0; f < this.data.t.length; f++) {
      if (this.data.t[f] == true) {
        ff += 1
        console.log(ff)
      }
    }
    if (ff > 1 && this.data.t[this.data.idx] == false) {
      return
    }
    console.log(222, this.data.t[this.data.idx])
    if (this.data.t[this.data.idx] == false) {
      if (this.data.t.indexOf(true) == -1) {
        var ren = this.data.t
        ren[this.data.idx] = !this.data.t[this.data.idx]
        this.setData({
          t: ren
        })
      }
      else if ((this.data.idx - this.data.t.lastIndexOf(true)) <= 1 && (this.data.idx - this.data.t.indexOf(true)) >= -1) {
        var ren = this.data.t
        ren[this.data.idx] = !this.data.t[this.data.idx]
        this.setData({
          t: ren
        })
      }
    }
    else if (idx == this.data.t.lastIndexOf(true) | idx == this.data.t.indexOf(true)) {
      var ren = this.data.t
      ren[this.data.idx] = !this.data.t[this.data.idx]
      this.setData({
        t: ren
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getdata: function () {
    common.get('hyb/findPrebookByState', {
      peopleId: this.data.id,
      date: this.data.date,
      page: 1,
      size: 1000
    }, res => {
      console.log(res.list, 222222222)
      this.setData({
        reserved: []
      })
      if (res.list.length > 0) {
        for (var l = 0; l < res.list.length; l++) {
          this.setData({
            reserved: this.data.reserved.concat(res.list[l].basic.periods)
          })

        }
      } 
      //console.log(this.data.reserved)
      //console.log(res.list[0].basic.periods, 2121212)

      common.get('hyb/findWorkTimeByDate', {
        peopleId: this.data.id,
        date: this.data.date
      }, res => {

        console.log(5656, res)
        if (!res) {
          console.log('kkkk')
          this.setData({
            worktime: this.data.fullday
          })
        }
        else {
          this.setData({
            worktime: res.basic.periods
          })
        }

        var morning = []
        var afternoon = []
        var evening = []
        var bool = []
        var available = []
        for (var i = 0; i < this.data.worktime.length; i++) {
          bool.push(false)


          if (parseInt(this.data.worktime[i].substring(6, 8)) <= 12) {
            morning.push(this.data.worktime[i])
          }
          else if (parseInt(this.data.worktime[i].substring(6, 8)) <= 18) {
            afternoon.push(this.data.worktime[i])
          }
          else {
            evening.push(this.data.worktime[i])
          }
        }
        for (var i = 0; i < this.data.worktime.length; i++) {
          console.log()
          if (this.data.reserved.indexOf(this.data.worktime[i]) == -1) {
            available.push(true)
          } else {
            available.push(false)
          }
        }
        this.setData({
          available: available
        })
        console.log(this.data.available, 222)
        this.setData({
          t: bool,
          morningwork: morning,
          a: morning.length,
          afternoonwork: afternoon,
          b: afternoon.length + morning.length,
          eveningwork: evening
        })
        console.log('red', this.data.t)

      },
      )

    },
    )
  },
  getdate: function (n) {
    var myDate = Date.parse(new Date());
    myDate += 1000 * 60 * 60 * 24 * n
    date = new Date(myDate)
    var year = date.getFullYear().toString();    //获取完整的年份(4位,1970-????)
    var month = commonx.formatNumber((date.getMonth() + 1).toString());       //获取当前月份(0-11,0代表1月)
    var date = commonx.formatNumber((date.getDate()).toString());        //获取当前日(1-31)
    var fulldate = year + '-' + month + '-' + date;
    this.setData({
      worktime: [],
      morningwork: [],
      afternoonwork: [],
      eveningwork: [],
      date: fulldate
    })
  },
  onLoad: function (options) {
    this.setData({
      name: options.name,
      work: options.work,
      img: options.img,
      id: options.id,
      service: options.service,
      prebooktimes: options.prebooktimes
    })
    this.getdate(1)
    this.setData({
      line1: true,
      line2: false,
    })
    this.getdata()
    common.get('app/findById', {}, data => {
      let ratio = 0
      if(data.extra.promotePeriods && data.extra.promotePeriods.ratio)
        ratio = data.extra.promotePeriods.ratio
      const tmp = {}
      data.extra.promotePeriods.periods.map(e => {
        tmp[e] = true
      })
      this.setData({
        promotePeriods: { 
          ratio: ratio, 
          periods: tmp
        }
      })
    })
  },

  

  onShareAppMessage: function (res) {

    return {
      title: '技师详情',
      path: "pages/detail/detail",

    }
  },
})