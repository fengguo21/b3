import { get, post } from '../../util/api'
import moment from '../../util/moment'

const steps = {
  1: '待付款',
  2: '待服务',
  3: '待完成',
  4: '已完成',
  5: '已退款',
  6: '已取消'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    showButton: false,
    tips: '立即付款'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    get('order/findById', {
      orderId: options.orderId
    }, res => {
      res.stepText = (res.step in steps)?steps[res.step]:'状态未知'
      res.created = moment(res.created).format('YYYY年MM月DD日 HH:mm:ss')
      if(res.payment.created)
        res.payment.created = moment(res.payment.created).format('YYYY年MM月DD日 HH:mm:ss')
      this.setData({
        order: res,
        showButton: res.step == 1 || res.step == 3,
        tips: (res.step == 3)?'确认完成':'立即付款'
      })
    })
  },
  process: function() {
    if(this.data.order.step == 1){
        post('order/rePay', {
          orderId: this.data.order.orderId
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
                  showButton: false,
                  [`order.stepText`]: '待服务'
                })
            },
            'fail':function(res){
            }
          })
        })
    }else if(this.data.order.step == 3){
      post('order/confirm', {
        orderId: this.data.order.orderId
      }, ret => {
          this.setData({
            [`order.step`]: 4,
            showButton: false,
            [`order.stepText`]: '已完成'
          })
      })
    }
  },

 
})