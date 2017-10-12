// pages/personal/changeName/changeName.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      name: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'form.name': app.globalData.userInfo.nickName
    })
  },
  nameChange(e) {
    this.data.form.name = e.detail.value
    this.setData({
      canSubmit: this.data.form.name.length
    })
  },
  clear() {
    this.setData({
      'form.name': ''
    })
  },
  submitForm: function (e) {
    app.HttpService.nickname({
      'nickname': this.data.form.name,
      open_id: app.globalData.open_id
    })
      .then(res => {
        if (res.success) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            name: this.data.form.name,
          })
          app.globalData.userInfo.nickName = this.data.form.name
          app.WxService.navigateBack()
        }
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})