import { get } from '../../../util/api'


var app=getApp();
Page({
    data: {
        data:[],//数据
        page:1,//当前页码
        tab: [],
        classes: [],
        catalog: '',
        childCatalog: '',
        total: 0,
        step: 1,
        tips: '',
        index: 0,
        loaded: false
    },
    onShareAppMessage: function (res) {
        return {
          title: '图库',
          path: '/pages/pic/list/list',
          success: function(res) {
            // 转发成功
          },
          fail: function(res) {
            // 转发失败
          }
        }
      },
    onShow: function() {
        //初始化数据
        // var self=this;
      get('hssy/findCatalogByState', {
        channel: 1 
      }, res => {
        res.list.forEach(e => {
          e.basic.title = e.basic.title.substr(0, 4)
        })
        this.setData({
          classes: res.list,
          tab: res.list.map(e => true)
        })
      })
      
      this.getData()
      
    },
    getData: function() {
        console.log('=====', this.data.childCatalog)
      get('hssy/frontFindAlbumByState', {
        childCatalog: this.data.childCatalog,
        catalog:this.data.catalog,
        page: this.data.page,
        size: 10
      }, res => {
        this.setData({
          data: this.data.data.concat(res.list),
          total: res.total,
          loaded: true
        })

      })
    },
    // 选项卡
    filterTab:function(e){
       const data = this.data.classes.map(e => true)
       //var  data=[true,true,true,true]
      
        
        const catalog = e.currentTarget.dataset.catalog;
        const index = e.currentTarget.dataset.index;

        if(index == -1){
          this.setData({
            page: 1,
            data: [],
            tab: this.data.classes.map(e => true),
            catalog: '',
            childCatalog: ''
        });
        //数据筛选
        this.getData();
          return
        }

        data[index] =! this.data.tab[index];
        this.setData({
            tab:data,
            index: index,
            catalog:catalog
        })
    },
    //筛选项点击操作
    filter:function(e){
        const text = e.currentTarget.dataset.text
        this.setData({
            page: 1,
            data: [],
            tab: this.data.classes.map(e => true),
            childCatalog: text
        });
        //数据筛选
        this.getData();
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
    this.getData()
  }  
})