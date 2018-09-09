// study.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    imgUrls: [
      {
        
        url: 'https://dn-huaqie.qbox.me/bannero.png'
      }, {
       
        url: 'https://dn-huaqie.qbox.me/bannert.png'
      }, 

    ],
    indicatorDots: false,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    circular:true
    

  },
  
  
  tostudyDetail: function () {
    wx.navigateTo({
      url: '../studyDetail/studyDetail'
    })
  },
  tostudyDetail2: function () {
    wx.navigateTo({
      url: '../studyDetail2/studyDetail2'
    })
  },
  tostudyDetail3: function () {
    wx.navigateTo({
      url: '../studyDetail3/studyDetail3'
    })
  },
 
  

 
  
  onShareAppMessage: function () {
    return {
      title: '学习社区',
      desc: '小程序开发!',
      path: '/pages/study/study'
    }
  },
})