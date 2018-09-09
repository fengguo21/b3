var address = require('../../../util/city.js')


Page({
  data:{
   array: ['浦东新区', '普陀区', '虹口区', '杨浦区', '长宁区', '静安区', '黄浦区', '徐汇区', '松江区', '宝山区', '嘉定区', '闵行区', '青浦区', '奉贤区', '崇明县' ],
   index: 0,
   addressIndex: 0,


    address:{
      name:'',
      phone:'',
      detail:''
    },
    addr: ['上海市', '上海市', '浦东新区'],
    isDefault: true,



    animationAddressMenu: {},
  addressMenuIsShow: false,
  value: [0, 0, 0],
  provinces: [],
  citys: [],
  areas: [],
  areaInfo:''
  },
  onLoad(options){
    const addressList = wx.getStorageSync('addressList')
    let index = 0
    this.data.array.forEach((e, k) => {
      if(addressList[options.index].summary[2] == e)
        index = k
    })
    
    this.setData({
      address: addressList[options.index],
      index: index,
      addressIndex: options.index,
      areaInfo: addressList[options.index].summary.join(',')
    })

     var id = address.provinces[0].id
  this.setData({
   provinces: address.provinces,
   citys: address.citys[id],
   areas: address.areas[address.citys[id][0].id],
  })
   var animation = wx.createAnimation({
      duration: 500,
        timingFunction: 'ease',
    })

    this.animation = animation
    this.animation.translateY(0 + 'vh').step()
  },
 bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      [`addr[2]`]: this.data.array[e.detail.value]
    })
  },

  formSubmit(){
    console.log(this.data.address);
    var self = this;
    if (self.data.addr.indexOf('')<0 && self.data.address.name && self.data.address.phone && self.data.address.detail){
      wx.getStorage({
        key: 'addressList',
        success(res) {
          self.storeAddress(JSON.parse(JSON.stringify(res.data)));
        },
        fail(){
          self.storeAddress();
        }
      })
    }else{
      wx.showModal({
        title:'小提示',
        content:'请填写完整资料',
        confirmColor: '#ffaf0e',
        showCancel:false
      })
    }
  },
  storeAddress(arr = []){
    let data = this.data;
    let arrs = [];
    if(arr.length>0){
      arr.forEach(item => {
        if (item.isDefault == true && data.isDefault == true) {
          item.isDefault = false;
        }
        arrs.push(item)
      })
    } else {
      arrs = arr;
    }
    arrs.forEach((e, k) => {
      if(k == this.data.addressIndex){
        e.name = data.address.name
        e.phone = data.address.phone
        e.summary = data.addr
        e.detail = data.address.detail
        e.isDefault = data.isDefault
      }
    })
    wx.setStorage({
      key: 'addressList',
      data: arrs,
      success() {
        wx.navigateBack();
      }
    })
  },
  bindName(e){
    this.setData({
      'address.name' : e.detail.value
    })
  },
  bindPhone(e){
    this.setData({
      'address.phone' : e.detail.value
    })
  },
  bindDetail(e){
    this.setData({
      'address.detail' : e.detail.value
    })
  },
  bindRegionChange(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      addr: e.detail.value
    })
  },
 
  switchChange(e){
    this.setData({
      isDefault: e.detail.value
    })
  },

  /////////////////////////////////////////////

showAddress(){
  console.log('==============', this.data.addressMenuIsShow)
  this.setData({
    addressMenuIsShow: true
  })
    this.animation.translateY(0 + 'vh').step()
  this.setData({
   animationAddressMenu: this.animation.export(),
  })
},

  // 点击所在地区弹出选择框
 selectDistrict: function (e) {
  var that = this
  // 如果已经显示，不在执行显示动画
  if (that.data.addressMenuIsShow) {
   return
  }
  // 执行显示动画
  that.startAddressAnimation(true)
 },
 // 执行动画
 startAddressAnimation: function (isShow) {
  console.log(isShow)
  var that = this
  if (isShow) {
   // vh是用来表示尺寸的单位，高度全屏是100vh
   that.animation.translateY(0 + 'vh').step()
  } else {
   that.animation.translateY(40 + 'vh').step()
  }
  that.setData({
   animationAddressMenu: that.animation.export(),
   addressMenuIsShow: isShow,
  })
 },
 // 点击地区选择取消按钮
 cityCancel: function (e) {
  this.startAddressAnimation(false)
 },
 // 点击地区选择确定按钮
 citySure: function (e) {
  var that = this
  var city = that.data.city
  var value = that.data.value
  that.startAddressAnimation(false)
  // 将选择的城市信息显示到输入框
  var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
  that.setData({
   areaInfo: areaInfo,
   addr: [that.data.provinces[value[0]].name, that.data.citys[value[1]].name, that.data.areas[value[2]].name]
  })
  console.log('======', areaInfo)
 },
 // 点击蒙版时取消组件的显示
 hideCitySelected: function (e) {
  console.log(e)
  this.startAddressAnimation(false)
 },
 // 处理省市县联动逻辑
 cityChange: function (e) {
  console.log(e)
  var value = e.detail.value
  var provinces = this.data.provinces
  var citys = this.data.citys
  var areas = this.data.areas
  var provinceNum = value[0]
  var cityNum = value[1]
  var countyNum = value[2]
  // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
  if (this.data.value[0] != provinceNum) {
   var id = provinces[provinceNum].id
   this.setData({
    value: [provinceNum, 0, 0],
    citys: address.citys[id],
    areas: address.areas[address.citys[id][0].id],
   })
  } else if (this.data.value[1] != cityNum) {
   // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
   var id = citys[cityNum].id
   this.setData({
    value: [provinceNum, cityNum, 0],
    areas: address.areas[citys[cityNum].id],
   })
  } else {
   // 滑动选择了区
   this.setData({
    value: [provinceNum, cityNum, countyNum]
   })
  }
  console.log(this.data)
 }
})