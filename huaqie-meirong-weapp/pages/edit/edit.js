//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    items: [

      { name: '明天', value: '明天', },
      { name: '后天', value: '后天' },

    ],
    multiArray: [['上午7点', '上午8点', '上午9点', '下午1点', '下午2点', '下午3点'], ['00分', '10分', '20分', '30分', '40分', '50分']],
    multiIndex: [0, 0],
    times: [
      { name: '30分钟', value: '30分钟' },
      { name: '1小时', value: '1小时', },
      { name: '2小时', value: '2小时' },
      { name: ' 3 小时', value: '3小时', },
      { name: '3小时以上', value: '3小时以上' },

    ],

    bookToastHidden: true,
    serviceChoice: [
      { name: '美容', value: '美容', checked: 'true' },
      { name: '美发', value: '美发' },
      { name: '美睫', value: '美睫' },
      { name: '美甲', value: '美甲' },


    ],



  },
  onShareAppMessage: function () {
    return {
      title: '预约',
      desc: '预约美容',
      path: '/pages/index/index'
    }
  },
  // formSubmit: function (e) {
  //   console.log('form发生了submit事件，携带数据为：', e.detail.value);
  //   wx.request({
  //     url: "https://g2.huaqie.com/cloud/prebook/create",
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     method: "POST",

  //     data: {
  //       sessionId: 'sessionId', appId: '5975add7437db858ed72b0be',
  //       formId: e.detail.formId
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       wx.switchTab({
  //         url: '../user/user'
  //       })
  //     }

  //   })

  // },
  formReset: function () {
    console.log('form发生了reset事件')
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  radioChangeT: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindToastTap: function () {
    console.log('预定成功')
    this.setData({
      bookToastHidden: false
    })
  },
  hideToast: function () {
    this.setData({
      bookToastHidden: true
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },


})
