import { get, post } from '../../../util/api'

const steps = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '已完成',
  5: '已退款',
  6: '已取消'
}

Page({
  data:{
    me: {},
    thumb:'',
    nickname:'',
    orders:[],
    page: 1,
    total: 0,
    hasAddress:false,
    address:{},
    nodes:'',
    tips: '',
    step: 1,
    curIndex: 1,
    stepText: '待付款'
  },
   changeTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if(index == this.data.curIndex)
      return
    this.setData({
      curIndex: index,
      step: index,
      stepText: steps[index],
      page: 1
    })
    this.getOrders()
  },

  onShow() {
      getApp().auth((me)=>{
        this.setData({
          me: me.basic
        })
        this.getOrders()
        
      }, ()=> {
        wx.switchTab({
          url: '/page/component/index'
        })
      })
  },
  getOrders() {
    console.log('======= CURRENT PAGE', this.data.page)
    get('order/frontFindByState', {
        step: this.data.step,
        page: this.data.page,
        size: 10
      }, res => {
        if(!res)
          return
        res.list.forEach(e => {
          e.stepTitle = (e.step in steps)?steps[e.step]:'未知'
          e.stepClass = 'step-'+e.step
        })
        this.setData({
          orders: (this.data.page==1)?res.list:this.data.orders.concat(res.list),
          total: res.total
        })
      })
  },
  /**
   * 发起支付请求
   */
  payOrders(e){
    const oid = e.currentTarget.dataset.oid;
    console.log('oid', oid)
    post('order/rePay', {
      orderId: oid
    }, ret => {
      console.log('REPAY======', ret)
      wx.requestPayment({
        'timeStamp': ret.timeStamp,
        'nonceStr': ret.nonceStr,
        'package': 'prepay_id='+ret.prepayId,
        'signType': 'MD5',
        'paySign': ret.paySign,
        'success':(res) =>{
          const nextIndex = this.data.curIndex+1
          this.setData({
            curIndex: nextIndex,
            step: nextIndex,
            stepText: steps[nextIndex],
            page: 1
          })
          this.getOrders()
          /*
          this.data.orders.forEach(e => {
            if(e.orderId == oid){
              e.step = 2
              e.stepTitle = (e.step in steps)?steps[e.step]:'未知'
              e.stepClass = 'step-'+e.step
            }
            })
            this.setData({
              orders: this.data.orders
            })
            */
        },
        'fail':function(res){
        }
      })
    })
  },
  /**
   * 确认收货
   */
  confirm(e){
    const oid = e.currentTarget.dataset.oid;
    console.log('oid', oid)
    post('order/confirm', {
      orderId: oid
    }, ret => {
      const nextIndex = this.data.curIndex+1
        this.setData({
      curIndex: nextIndex,
      step: nextIndex,
      stepText: steps[nextIndex],
      page: 1
    })
    this.getOrders()
        /*
      this.data.orders.forEach(e => {
        if(e.orderId == oid){
          e.step = 4
          e.stepTitle = (e.step in steps)?steps[e.step]:'未知'
          e.stepClass = 'step-'+e.step
        }
        })
        this.setData({
          orders: this.data.orders
        })
        */
    })
  },
  onReachBottom() {
    if(this.data.page * 10 >= this.data.total){
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