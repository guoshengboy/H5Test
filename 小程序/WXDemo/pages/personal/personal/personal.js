// pages/personal/personal.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '13112341234',
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mobile: app.globalData.userInfo.mobile,
      name: app.globalData.userInfo.nickName
    })
  },

  changeMobile() {
    app.WxService.navigateTo('../changeMobile/changeMobile')
  },
  changeName() {
    app.WxService.navigateTo('../changeName/changeName')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})