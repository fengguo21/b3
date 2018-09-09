
Page({
  data:{
    addressList: [],
    fromPage: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      fromPage: options.fromPage
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  chooseAddress(e) {
    const index = e.currentTarget.dataset.index
    if(this.data.fromPage == 'orders'){
      wx.setStorageSync('addressIndex', index)
      wx.navigateBack()
    }else{
      wx.navigateTo({
        url:'../addressUpdate/addressUpdate?index='+index
      })
    }
  },
   goCreateAddress(){
    wx.navigateTo({
      url: '../address/address',
    })
  },
  
  onShow:function(){
    // 页面显示
    const address = wx.getStorageSync('addressList')
    this.setData({
      addressList: address
    })
    
  }
})