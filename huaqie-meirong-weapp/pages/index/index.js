

//获取应用实例

var app = getApp();
var common = require("../../utils/api.js");



Page({
  // 页面初始数据
  data: {
    services: [],
    oservices: {},
    crew: [],
    items1: [],
    items2: [],
    obj: {},
    classname:['title1','title2','title3','title4','title5','title6'],
   
    ren:[]


  },
  onHide: function () {
    console.log(909090111, this.data.oservices)
  },
  onShow: function () {
    var that=this
    common.get('hyb/frontFindService', {
    }, res => {
      console.log(333,res)
      this.setData({
        services: res,
      })
      common.get('people/frontFindRoleByState', {
        page: 1,
        size: 20
      }, res => {
        console.log(321,res)

        for(var s=0;s<this.data.services.length;s++){
          this.data.ren.push(this.data.services[s].basic.title)
        }
        console.log('---------',this.data.ren)

        for (var j = 0; j < this.data.services.length; j++) {
          var obj = this.data.oservices;
          var ser = this.data.ren[j];
          obj[ser] = []
          obj[ser].push(ser)
         
          for (var i = 0; i < res.list.length; i++) {
            

            if (res.list[i].role.services&&res.list[i].role.services.indexOf(this.data.services[j].basic.title) >= 0) {
              obj[ser].push(res.list[i])
            }
          }
          this.setData({
            oservices: obj
          })
          
          
          console.log(this.data.oservices,999)
          
        }

      })

    })
  },







  onShareAppMessage: function (res) {

    return {
      title: '预约',
      path: "pages/index/index",

    }
  },
  scan:function(){
    wx.scanCode({
      success: (res) => {
        console.log(222222,res)
        wx.navigateTo({
          url: "/"+res.path,
        })
        console.log(res)
      }
    })
  },

  // 跳转至详情页
  toDetail: function (event) {
    var name = event.currentTarget.dataset.name
    var work = event.currentTarget.dataset.work
    var img = event.currentTarget.dataset.img
    var id = event.currentTarget.dataset.id
    var service = event.currentTarget.dataset.service
    var prebooktimes = event.currentTarget.dataset.prebooktimes|0


    wx.navigateTo({
      url: '../detail/detail?name=' + name + '&work=' + work + '&img=' + img + '&id=' + id + '&service=' + service+'&&prebooktimes='+prebooktimes
    })
  },
})