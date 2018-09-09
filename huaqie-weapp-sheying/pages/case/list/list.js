import { get } from '../../../util/api'
import moment from '../../../util/moment'
var app = getApp();
Page({
  data: {
    data: [],//数据
    classes: [],//tab文案
    tab: [],
    page: 1,//当前页码
    catalog: '',
    childCatalog:'',
    page: 1,
    total: 0,
    step: 1,
    tips: '',
    index: 0,
    loaded: false
  },
  onShareAppMessage: function (res) {
    return {
      title: '案例',
      path: '/pages/case/list/list',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShow: function () {
    //初始化数据
    this.getFilter();
    this.getData()
  },
  // 选项卡
  filterTab: function (e) {
    const data = this.data.classes.map(e => true)
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

    data[index] = !this.data.tab[index];

    this.setData({
      tab: data,
      index: index,
      catalog: catalog
    })
  },
  phone:function(){
    wx.makePhoneCall({
      phoneNumber: '051785978219' //仅为示例，并非真实的电话号码
    })
  },
  // 获取筛选项
  getFilter: function (e) {
    get('hssy/findCatalogByState', {
      channel: 0
    }, res => {
      this.setData({
        classes: res.list,
        tab: res.list.map(e => true)
      })
    })
  },
  //筛选项点击操作
  filter: function (e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      page: 1,
      data: [],
      tab: this.data.classes.map(e => true),
      childCatalog: item
    })
    this.getData()
  },
  //加载数据
  getData: function () {
    get('hssy/frontFindCaseByState', {
      catalog: this.data.catalog,
      childCatalog: this.data.childCatalog,
      page: 1,
      size: 10
    }, res => {

      res.list.forEach(e => {
        e.created = moment(e.created).format('YYYY年MM月DD日')
      })
      this.setData({
        data: res.list,
        total: res.total,
        loaded: true
      })
      
    })
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
});