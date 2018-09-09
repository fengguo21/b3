import { get } from '../../util/api'
import moment from '../../util/moment'
const steps = {
  1: '待付款',
  2: '待服务',
  3: '待完成',
  4: '已完成',
  6: '已取消'
}

Page({
  data: {
    me: {},
    tabs: [true, false, false, false],
    orders: [],
    page: 1,
    total: 0,
    step: 1,
    tips: ''
  },
  getOrders: function() {
    get('order/findByState', {
      step: this.data.step,
      page: this.data.page,
      size: 10
    }, res => {
      console.log('====== orders', res)
      res.list.forEach(e => {
        e.created = moment(e.created).format('YYYY年MM月DD日 HH:mm:ss')
      })
      this.setData({
        orders: res.list,
        total: res.total,
        tips: (this.data.step in steps)?steps[this.data.step]:''
      })
    })
  },
  onShow: function () {
    const me = wx.getStorageSync('me')
    if(!me){
      getApp().auth((me)=>{
        this.setData({
          me: me
        })
        this.getOrders()
      }, cancel => {
        wx.switchTab({
          url: '/pages/case/list/list'
        })
      })
    }else{
      this.setData({
        me: me
      })
      this.getOrders()
    }
    
  },
  tab: function (e) {
    var n = e.currentTarget.dataset.index;
    const tabs = this.data.tabs.map((e, k) => {
      return (k == n-1)?true:false
    })

    this.setData({
      tabs: tabs,
      step: n,
      page: 1,
      tips: ''
    })

    this.getOrders()
  },
  makePhoneCall: function (e) {
    var tel_num = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel_num
    })
  },
  goto: function() {
    wx.navigateTo({
      url: '../case/detaile/detaile',
    })
  },
  goLocation: function () {
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     console.log(latitude, longitude)
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       scale: 28
    //     })
    //   }
    // })
    // return
    wx.navigateTo({
      url: '../map/map',
    })
  },
  onReachBottom() {
    if(this.data.page * 10 >= this.data.total && this.data.total > 0){
      console.log('到底了')
      this.setData({
        tips: '---- 我是有底线的 ----'
      })
      return
    }

    this.setData({
      tips: '加载中...'
    })
      
    this.setData({
      page: (this.data.page + 1)
    })
    this.getOrders()
  }
})