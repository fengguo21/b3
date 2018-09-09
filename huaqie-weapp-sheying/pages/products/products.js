import { get } from '../../util/api'

Page({
    data: {
       products: [],
       tips: '',
       page: 1,
       total: 0,
       step: 1,
    },
    onShareAppMessage: function (res) {
        return {
          title: '活动',
          path: '/pages/products/products',
          success: function(res) {
            // 转发成功
          },
          fail: function(res) {
            // 转发失败
          }
        }
      },
    onReady: function() {
        //初始化数据
        get('product/findByState', {
            page: 1,
            size: 10
        }, res => {
            console.log('=======', res)
            this.setData({
                products: res.list
            })
        })
    },
    
    alert:function(t){
        wx.showModal({
            title:"系统提示",
            content:t,
            showCancel: false,
            confirmColor: '#000'
        });
    },
    onReachBottom() {
      if (this.data.page * 10 >= this.data.total) {
        console.log('到底了')
        this.setData({
          tips: '---- 我是有底线的 ----'
        })
        return
      }

      this.setData({
        tips: '加载中...'
      })

      this.setData({
        page: (this.data.page + 1)
      })
      this.getOrders()
    }
})

