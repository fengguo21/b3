import { get } from '../../../util/api'

var app=getApp();
Page({
    data: {
        data: [],
        feedId: '',
        index:0,
        current:0,
        indicatorDots: false,
        autoplay: false,
        duration:500,
        flag:true,
        flag2:true //解决swiper 回调执行两次问题
    },
    onShareAppMessage: function (res) {
        return {
          title: '图库详情',
          path: '/pages/pic/detaile/detaile?feedId='+this.data.feedId,
          success: function(res) {
            // 转发成功
          },
          fail: function(res) {
            // 转发失败
          }
        }
      },
    onLoad:function(options){
      get('hssy/findAlbumById', {
        feedId: options.feedId
      }, res => {
        this.setData({
          data: res.basic.images,
          feedId: options.feedId
        })

      })

        this.swiperChange({
            detail:{
                current:this.data.current
            }
        });
    },
    //加载数据
    getData:function(callback){
        var self = this;
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration:10000
        });
        self.setData({
            flag2:false
        });
        wx.request( {
            url:app.api.picList,
            data: {
                page:self.data.page,
                space_id:self.data.house_space,
                style_id:self.data.house_style,
                section_id:self.data.house_section
            },
            header: {
                'Content-Type': 'application/json'
            },
            success: function( res ) {
                var datas=self.data.data.concat(res.data.data),flag=res.data.data.length>=20;
                console.log(res);
                self.setData({
                    data:datas,
                    flag:flag,
                    flag2:true
                });
                wx.hideToast();
            },
            fail:function(){
                console.log('error!!!!!!!!!!!!!!')
            }
        })
    },
    swiperChange: function(e) {
        var index=e.detail.current,self=this;
        // console.log(self.data.flag2)
        self.setData({
            current:index
        });
        if(index>=self.data.data.length-1 && self.data.flag2){
            if(self.data.page){
                if(self.data.flag){
                    self.setData({
                        page:self.data.page+1
                    });
                    self.getData();
                }
            }
        }
    }
})