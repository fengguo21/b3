import { get } from '../../../util/api'
import { formatNumber } from '../../../util/util'

Page({
  data:{
    tracking: true,
    traces: [],
    logisticCode:'',
    shipperCode:'',
    shipperName: ''
  },
  onLoad:function(options){
     get('order/findExpressById', {
      orderId: options.orderId
    }, res => {
      this.setData({
        traces: res.Traces,
        tracking: false,
        logisticCode: formatNumber(res.LogisticCode, 0, '', ' '),
        shipperCode: res.ShipperCode,
        shipperName: options.shipperName
      })

    })
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