import { get } from '../../../util/api'
import cart from '../../../util/cart'
var common = require("../../../utils/api.js");

Page({
  data:{
    product: {},
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.product.basic.title,
      path: '/page/shop/details/details?productId='+this.data.product.productId+'&salesPeopleId='+wx.getStorageSync('peopleId'),
      //imageUrl: 'https://dn-huaqie.qbox.me/agent-sd1.png',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;
    console.log('num', num, 'total', total)
    cart.addProduct({
      productId: this.data.product.productId,
      count: num,
      basic: this.data.product.basic
    })

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },
gocart(){
  console.log(1)
  wx.navigateTo({
    url: '../cart/cart',
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
},
  contact() {
    wx.makePhoneCall({
      phoneNumber: '15921097791'
    })
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },

  onLoad(options) {
    console.log('options:', options)
    this.setData({
      hasCarts: (cart.products.length>0)?true:false,
      totalNum: cart.count()
    })
     wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    })
     console.log(options)
    common.get('product/findById', {
      productId: options.productId
     
    }, data => {
      console.log(data)
       wx.hideLoading()
      this.setData({
        product: data
      })
      wx.setNavigationBarTitle({
        title: data.basic.title
      })
    })
  }
 
})