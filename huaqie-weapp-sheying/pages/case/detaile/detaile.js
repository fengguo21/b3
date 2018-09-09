import { get } from '../../../util/api'


var app=getApp();
var $=require('../../../js/util.js');
Page( {
    data: {},
    onLoad: function(options) {
        //初始化数据
        this.getData(options.feedId);
    },
    getData: function (feedId) {
      get('hssy/findCaseById', {
        feedId: feedId
      }, res => {
        this.setData({
          data: res
        })
      })
    },
    onShareAppMessage: function (res) {
        return {
          title: '案例详情',
          path: '/pages/case/detaile/detaile?feedId='+this.data.data.feedId,
          success: function(res) {
            // 转发成功
          },
          fail: function(res) {
            // 转发失败
          }
        }
      },
    yuyue:function(){
        app.yuyue();
    },
    phone:function(){
    wx.makePhoneCall({
      phoneNumber: '051785978219' //仅为示例，并非真实的电话号码
    })
  },
    //跳转设计师详情
    goToDesigner:function(){
        app.globalData.designerId=this.data.data.designerid
        wx.navigateTo({
          url: '../../designer/designer'
        });
    },
    // 跳转大图预览页面
    picDetaile:function(e){
        var data=[];
        $.each(this.data.data.photo_list,function(i,d){
            data.push({
                des:d.photo_des,
                imgfile_l:d.photo_url_l
            })
        });
        app.globalData.picData={
            data:data,
            current:e.currentTarget.dataset.index
        }
        console.log(e.currentTarget.dataset.index)
        wx.navigateTo({
          url: '../../pic/detaile/detaile'
        });
    }
})