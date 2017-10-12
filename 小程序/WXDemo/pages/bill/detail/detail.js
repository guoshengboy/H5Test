// pages/bill/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bean: {
      name: '大灶',
      status: 1,
      money: '2.00',
      money_paid: '68.00',
      time: '2017-07-07 12:21',
      order_sn: '13878364563586285',
      type: '哈哈哈',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getData()
  },
  getData: function () {
    app.HttpService.getBillDetail(id, {
      open_id: app.globalData.open_id,
    }).then(res => {
      if (!res.success) {
        return
      }
      this.setData({
        bean: data
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})