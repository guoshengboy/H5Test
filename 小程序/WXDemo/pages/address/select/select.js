// pages/address/select/select.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh: false, //resume时是否重新刷新数据
    prompt: {
      hidden: !0,
      icon: '../../../assets/images/loc.png',
      title: '暂无可派送有效地址',
      text: '点击右下角新建添加',
    },
    range: [],
    out: [],
    type: 1,
    type2: 2,
    canShow: 0,
    showOut: 0,
    rangEmpty: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  getList() {
    app.HttpService.pickAddress({
      open_id: app.globalData.open_id,
      hospital_id: app.globalData.hos_id
    }).then(res => {
      if (res.success) {
        for (var i in res.data.available) {
          res.data.available[i].type = 1;
        }
        for (var i in res.data.unavailable) {
          res.data.unavailable[i].type = 2;
        }
        var rangEmpty = 1
        if (res.data.unavailable.length && (res.data.available.length == 0)) {
          rangEmpty = 0
        }
        this.setData({
          range: res.data.available,
          out: res.data.unavailable,
          'prompt.hidden': res.data.available.length || res.data.unavailable.length,
          rangEmpty: rangEmpty,
          canShow: res.data.unavailable.length,
        })
        console.log(this.data)
      }
    })
  },
  selectAddress(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var obj = this.data.range[index]
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      refresh: true,
      address: obj
    })
    wx.navigateBack()
  },
  pickUp() {
    this.setData({
      showOut: 0
    })
  },
  open() {
    this.setData({
      showOut: 1
    })
  },
  addAddress() {
    app.WxService.navigateTo('../modify/modify')
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    if (!this.data.refresh) {
      return
    }
    this.setData({
      refresh: false,
    })
    this.getList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})