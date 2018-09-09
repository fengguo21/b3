const API = 'https://g2.huaqie.com/cloud/'
// const APP_ID = '599679b908392a333a4e9e57'
//会员宝
 const APP_ID = '59b11ed9f8b1042a557cd8db'
//雨轩造型
//const APP_ID = '59db2c08f8b1042a557cd91f'
//名媛
 //const APP_ID = '59db48b5f8b1042a557cd927'
 //东方国色美容养生馆
//const APP_ID = '59dc80fcf8b1042a557cd943'
//晴天缘
 //const APP_ID = '59f80621f8b1042a557cd995'
//金莎妮
//const APP_ID = '5a027126f8b1042a557cd9bd'

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
          confirmColor: '#ff8ec6',
          showCancel: false
        })
        return
      }
      callback(res.data.data)
    }
  })
}