Page({
  data: {
    // markers: [{
    //   iconPath: "../../images/arrow.png",
    //   id: 0,
    //   latitude: 33.497490,
    //   longitude: 119.144470,
    //   width: 50,
    //   height: 50
    // }],
    // polyline: [{
    //   points: [{
    //     longitude: 119.144470,
    //     latitude: 33.497490
    //   }, {
    //     longitude: 119.144470,
    //     latitude: 33.497490
    //   }],
    //   color: "#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
    // controls: [{
    //   id: 1,
    //   iconPath: '../../images/pic.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]

    markers: [{
      iconPath: "../../images/location.png",
      id: 0,
      latitude: 33.497490,
      longitude: 119.144470,
      width: 13,
      height: 16,
      title: "喜多婚纱摄影",


    }],
    polyline: [{
      points: [{
        longitude: 119.144470,
        latitude: 33.497490
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],

  },
  ggggg: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude

        wx.openLocation({
          latitude: 33.497490,
          longitude: 119.144470,
          title: "喜多婚纱摄影",
          name: "喜多婚纱摄影",
          scale: 28
        })
      }
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  // onReady() {
  //   wx.getLocation({
  //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
  //     success: function (res) {
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       console.log(latitude, longitude)
  //       wx.openLocation({
  //         latitude: latitude,
  //         longitude: longitude,
  //         scale: 28
  //       })
  //     }
  //   })
  // }
})
