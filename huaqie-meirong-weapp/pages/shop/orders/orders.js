import cart from '../../../util/cart'
import { get, post } from '../../../util/api'

Page({
  data:{
    address:{},
    hasAddress: false,
    total:0,
    products: [],
    totalPrice: 0,
    fee: 0,
    note: '',
    doing: false
  },
  updateNote(e){
    this.setData({
      note: e.detail.value
    })
  },
  onReady() {
    
  },

  goAddresses() {
    const address = wx.getStorageSync('addressList')
    if (address.length == 0) {
      wx.navigateTo({
        url: '../address/address?fromPage=orders'
      })
    }else{
      wx.navigateTo({
        url: '../addressList/addressList?fromPage=orders'
      })
    }
  },
  
  onShow:function(){
    const self = this;
    wx.getStorage({
      key:'addressList',
      success(res) {
        self.setData({
          address: res.data[wx.getStorageSync('addressIndex') || 0],
          hasAddress: true
        })
      }
    })
    const products = []
    cart.products.forEach(e => {
      if(e.selected)
        products.push(e)
    })
    this.setData({
      products: products
    })
    get('product/findValidFeeByAppId', {
      
    }, ret => {
      if(!ret){
        this.getTotalPrice()
        return
      }
      const fees = ret.basic
      if(fees.typehood == 1){
        let weight = 0
        products.forEach(e => {
          weight += (Number(e.basic.weight)*e.count)
        })
        if(weight < fees.baseWeight)
          this.setData({
            fee: fees.baseFee
          })
        else{
          this.setData({
            fee: Number((fees.baseFee+((weight-fees.baseWeight)/fees.stepWeight)*fees.stepFee).toFixed(2))
          })
        }
      }else if(fees.typehood == 2){
        let total = 0;
        this.data.products.forEach(e => {
          total += (e.basic.price * e.count)
        })
        console.log('====== TOTL', total)
        if(total < fees.amount)
          this.setData({
            fee: fees.fee
          })
      }
      this.getTotalPrice();
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let total = 0;
    this.data.products.forEach(e => {
      total += (e.basic.price * e.count)
    })
    this.setData({
      totalPrice: total.toFixed(2),
      total: (total + this.data.fee).toFixed(2)
    })
  },

  doPay() {
    if(this.data.note.length > 30){
     wx.showModal({
      title: '小提示',
      content: '备注不能超过30个字哈',
      confirmColor: '#ffaf0e',
      confirmText: '知道了',
      showCancel: false,
      success: function(res) {
     
      }
    })
      return
    }
    //const address = wx.getStorageSync('addressList')[0] || null
    if(!this.data.address.name){
      wx.showModal({
      title: '小提示',
      content: '请填写收货地址',
      confirmColor: '#ffaf0e',
      confirmText: '知道了',
      showCancel: false,
      success: (res) => {
        this.goAddresses()
      }
    })
      return
    }
    if(this.data.doing)
      return
    this.setData({
      doing: true
    })
    post('order/create', {
      products: this.data.products,
      address: {
        name: this.data.address.name,
        phone: this.data.address.phone,
        zone: this.data.address.summary,
        detail: this.data.address.detail
      },
      note: this.data.note,
      channel: 'wepay.widget'
    }, (ret) => {
      this.setData({
        doing: false
      })
      console.log(ret)
      if(!ret)
        return
      cart.clear()
      console.log( 'CREATEORDER ========', ret)
      wx.requestPayment({
        'timeStamp': ret.timeStamp,
        'nonceStr': ret.nonceStr,
        'package': 'prepay_id='+ret.prepayId,
        'signType': 'MD5',
        'paySign': ret.paySign,
        'success': (res) => {
          
          wx.switchTab({
            url: '/page/component/user/user'
          })
        },
        'fail': (res) => {
          console.log('fail', res)
          /*
          wx.switchTab({
            url: '/page/component/user/user'
          })
          */
        }
      })
    })
  },

  toPay() {
    const me = wx.getStorageSync('me') || null
    if(!me){
      getApp().auth((me)=>{
        this.doPay()
      })
    }else{
      this.doPay()
    }
  }
})