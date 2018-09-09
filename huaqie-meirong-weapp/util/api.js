const API = 'https://g2.huaqie.com/cloud/'
const APP_ID = '59ef0655f8b1042a557cd969'

export const get = (cmd, params, callback) => {
  params.sessionId = wx.getStorageSync('sessionId') || 'undefined'
  params.appId = APP_ID
  wx.request({
    url: API+cmd,
    data: params,
    success: (res) => {
      if(res.data.code == 10001){
        wx.setStorageSync('sessionId', '')
        wx.setStorageSync('peopleId', '')
        wx.setStorageSync('me', '')
        get('account/sessionId', {}, (data) => {
          wx.setStorageSync('sessionId', data)
        })
        
        wx.showModal({
          title: '小提示',
          content: '会话已过期，请重新登录',
          confirmColor: '#ffaf0e',
          showCancel: false,
          success: () => {
            getApp().auth(()=>{
              get(cmd, params, callback)
            }, ()=>{})
          }
        })
        return
      }
      callback(res.data.data)
    },
    fail: (res) => {

    }
  })
}

export const post = (cmd, params, callback) => {
  params.sessionId = wx.getStorageSync('sessionId') || 'undefined'
  params.appId = APP_ID
  wx.request({
    url: API+cmd,
    data: params,
    method: 'POST',
    success: (res) => {
      if(res.data.code == 10001){
        wx.setStorageSync('sessionId', '')
        wx.setStorageSync('peopleId', '')
        wx.setStorageSync('me', '')
        get('account/sessionId', {}, (data) => {
          wx.setStorageSync('sessionId', data)
        })
        wx.showModal({
          title: '小提示',
          content: '会话已过期，请重新登录',
          confirmColor: '#ffaf0e',
          showCancel: false,
          success: () => {
            getApp().auth(()=>{
              post(cmd, params, callback)
            }, ()=>{})
          }
        })
        return
      }
      if (res.data.code) {
        wx.showModal({
          title: '小提示',
          content: res.data.message,
          confirmColor: '#ffaf0e',
          showCancel: false
        })
        return
      }
      callback(res.data.data)
    }
  }) 
}