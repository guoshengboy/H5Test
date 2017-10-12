// pages/hospitalList/hospitalList.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.WxService.getLocation()
      .then(data => {
        this.getList({
          'flng': data.longitude,
          'flat': data.latitude
        })
      },
      err => {
        this.getList({})
      })
  },
  
  getList: function (params) {
    app.HttpService.hospital(params)
    .then(res => {
      console.log(res)
      this.setData({
        list: res.data
      })
    })
  },

  navigateTo: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      hospital_name: this.data.list[index].hospital_name,
      hos_id: this.data.list[index].id,
      refresh: true
    })
    app.globalData.hos_id = this.data.list[index].id
    app.WxService.navigateBack()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})