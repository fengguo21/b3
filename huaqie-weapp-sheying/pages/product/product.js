import { get, post } from '../../util/api'

Page( {
    data: {
        product: {},
        doing: false,
        showModal: false,
        phone: '',
        modalTips: ''
    },
    onLoad: function(options) {
        //初始化数据
        get('product/findById', {
            productId: options.productId
        }, res => {
            this.setData({
                product: res
            })
        })
       
    },
    onShareAppMessage: function (res) {
        return {
          title: '活动详情',
          path: '/pages/product/product?productId='+this.data.product.productId,
          success: function(res) {
            // 转发成功
          },
          fail: function(res) {
            // 转发失败
          }
        }
      },
      inputChange: function(e) {
        console.log('======', e.detail.value)
        this.setData({
          phone: e.detail.value,
          modalTips: ''
        })
      },
       showDialogBtn: function() {
      this.setData({
        showModal: true
      })
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {
    },
    hideModal: function () {
      this.setData({
        showModal: false
      });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
      this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/;
      if(!this.data.phone){
        this.setData({
          modalTips: '请输入手机号'
        })
        return
      }else if(!reg.test(this.data.phone)){
        this.setData({
          modalTips: '手机号格式错误'
        })
        return
      }
      this.hideModal();
      this.doPay()
    },
      doPay() {

    if(this.data.doing)
      return
    this.setData({
      doing: true
    })
    const me = wx.getStorageSync('me')
    post('order/create', {
      products: [{
        productId: this.data.product.productId,
        count: 1
      }],
      address: {
        name: me.basic.name,
        phone: this.data.phone
      },
      channel: 'wepay.widget'
    }, (ret) => {
      this.setData({
        doing: false
      })
      console.log(ret)
      if(!ret)
        return
      console.log( 'CREATEORDER ========', ret)
      wx.requestPayment({
        'timeStamp': ret.timeStamp,
        'nonceStr': ret.nonceStr,
        'package': 'prepay_id='+ret.prepayId,
        'signType': 'MD5',
        'paySign': ret.paySign,
        'success': (res) => {
          
          wx.switchTab({
            url: '/pages/account/account'
          })
        },
        'fail': (res) => {
          wx.switchTab({
            url: '/pages/account/account'
          })
        }
      })
    })
  },

  toPay() {
    const me = wx.getStorageSync('me') || null
    if(!me){
      getApp().auth((me)=>{
        this.showDialogBtn()
      })
    }else{
      this.showDialogBtn()
    }
  }
})