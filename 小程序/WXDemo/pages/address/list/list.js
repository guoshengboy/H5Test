// pages/address/list/list.js
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
    list: [],
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  getList() {
    app.HttpService.getAddressList({
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        for (var i in res.data) {
          res.data[i].type = 0;
        }
        this.setData({
          list: res.data,
          'prompt.hidden': res.data.length,
        })
      })
  },
  addAddress() {
    app.WxService.navigateTo('../modify/modify')
  },
  modifyAddress(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var obj = this.data.list[index]
    app.WxService.navigateTo('../modify/modify', obj)
  },
  deleteAddress(event) {
    let id = event.currentTarget.dataset.id;
    var index = parseInt(event.currentTarget.dataset.index);
    app.HttpService.deleteAddress(id)
      .then(res => {
        if (!res.success) {
          return
        }
        var list = this.data.list
        list.splice(index,1)
        this.setData({
          list: list,
          'prompt.hidden': list.length,
        })
      })
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