import { get, post } from '../../../util/api'
import moment from '../../../util/moment'

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
    orderId: '',
    buttonText: '',
    buttonClass: '',
    order: {}
  },
  goProduct(e) {
    const pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: '/page/component/details/details?productId='+pid
    })
  },
  getExpress() {
    if(this.data.order.shipment.self)
      return
   wx.navigateTo({
     url: '../express/express?orderId='+this.data.orderId+'&shipperName='+this.data.order.shipment.company
   })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId
    })
    wx.showToast({
    title: '加载中...',
    icon: 'loading',
    duration: 2000
  })
    get('order/findById', {
      orderId: options.orderId
    }, ret => {
       wx.hideLoading()
      ret.stepTitle = (ret.step in steps)?steps[ret.step]:'未知'
      ret.stepClass = 'step-'+ret.step
      ret.paymentedText = moment(ret.payment.created).format('YYYY年MM月DD日 HH:mm:ss')
      ret.shipmentedText = moment(ret.shipment.created).format('YYYY年MM月DD日 HH:mm:ss')
      ret.createdText = moment(ret.created).format('YYYY年MM月DD日 HH:mm:ss')
      let buttonText = ''
      let buttonClass = ''
      if(ret.step == 1){
        buttonText = '继续付款'
        buttonClass = 'button-step-1'
      }else if(ret.step == 3){
        buttonText = '确认收货'
        buttonClass = 'button-step-3'
      }
      this.setData({
        order: ret,
        buttonText: buttonText,
        buttonClass: buttonClass
      })
    })
  },
  process: function() {
    if(this.data.order.step == 1){
        post('order/rePay', {
          orderId: this.data.orderId
        }, ret => {
          wx.requestPayment({
            'timeStamp': ret.timeStamp,
            'nonceStr': ret.nonceStr,
            'package': 'prepay_id='+ret.prepayId,
            'signType': 'MD5',
            'paySign': ret.paySign,
            'success':(res) =>{
                this.setData({
                  [`order.step`]: 2,
                  [`order.stepTitle`]: '待发货',
                  [`order.stepClass`]: 'step-2'
                })
            },
            'fail':function(res){
            }
          })
        })
    }else if(this.data.order.step == 3){
      post('order/confirm', {
        orderId: this.data.orderId
      }, ret => {
          this.setData({
            [`order.step`]: 4,
            [`order.stepTitle`]: '已完成',
            [`order.stepClass`] : 'step-4'
          })
      })
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})