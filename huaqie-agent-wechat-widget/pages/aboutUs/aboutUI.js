Page({
  data: {
    markers: [{
      iconPath: "../../images/location.png",
      id: 0,
      latitude: 31.058720,
      longitude: 121.243810,
      width:13,
      height:16,
      title:"松江万达三号楼(去这里)",
      
      
    }],
    polyline: [{
      points: [{
        longitude: 121.243810,
        latitude: 31.058720
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    
  },

  
  
  regionchange(e) {
    console.log(e.type)
  },
  ggggg:function(){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
       
        wx.openLocation({
          latitude: 31.058720,
          longitude: 121.243810,
          title:"松江万达三号楼",
          name:"松江万达三号楼",
          scale: 28
        })
      }
    })
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})