const API = 'https://g2.huaqie.com/cloud/'
const APP_ID = '59b2421cf8b1042a557cd8e3'

/*
const getSessionId = (callback) => {
  wx.request({
    url: API+'account/sessionId',
    data: {},
    success: res => {
      callback(res.data.data)
    }
  })
}
*/

export const get = (cmd, params, callback) => {
  params.sessionId = wx.getStorageSync('sessionId') || 'undefined'
  params.appId = APP_ID
  wx.request({
    url: API + cmd,
    data: params,
    success: (res) => {
      console.log('res', res.data)
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
    url: API + cmd,
    data: params,
    method: 'POST',
    success: (res) => {
      if (res.data.code) {
        wx.showModal({
          title: '小提示',
          content: res.data.message,
          confirmColor: '#e85787',
          showCancel: false
        })
        return
      }
      callback(res.data.data)
    }
  })
}