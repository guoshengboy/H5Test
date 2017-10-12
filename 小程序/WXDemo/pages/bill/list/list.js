// pages/bill/list/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: {
      hidden: !0,
      icon: '../../../assets/images/order_empty.png',
    },
    list: {
      current_page: 1,
      last_page: 3,
      total: 30,
      data: []
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  getList: function () {
    // var list = new Array
    // for (var i = 0; i < 10; i++) {
    //   var bean = {
    //     name: '大灶',
    //     status: i % 4,
    //     money: '2.00',
    //     money_paid: '68.00',
    //     time: '2017-07-07 12:21',
    //     order_sn: '13878364563586285',
    //   }
    //   list.push(bean)
    // }
    // this.setData({
    //   'list.data': this.data.list.current_page == 1 ? list : [...this.data.list.data, list],
    //   // 'list.last_page': res.data.last_page,
    //   // 'list.total': res.data.total,
    //   // 'prompt.hidden': res.data.total,
    // })
    app.HttpService.billList({
      per_page: 10,
      page: this.data.list.current_page,
      open_id: app.globalData.open_id,
    }).then(res => {
      if (!res.success) {
        return
      }
      this.setData({
        'list.data': this.data.list.current_page == 1 ? res.data.data : [...this.data.list.data, ...res.data.data],
        'list.last_page': res.data.last_page,
        'list.total': res.data.total,
        'prompt.hidden': res.data.total,
      })
      this.data.list.current_page++
    })
  },
  clickItem: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    app.WxService.navigateTo('../detail/detail', {
      id: this.data.list.data[index].id
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.list.current_page = 1
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.list.current_page >= this.data.list.last_page) return
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})