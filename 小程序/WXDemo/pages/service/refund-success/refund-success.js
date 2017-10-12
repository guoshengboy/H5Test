// pages/service/refund-success/refund-success.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.money != undefined && options.money.length != 0){
      this.setData({
        money: options.money
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  confirm() {
    app.WxService.navigateBack()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})