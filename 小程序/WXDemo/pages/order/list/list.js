// pages/order/order.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh: false,
    isLogin: 0,
    msg: '您还没有登录，请登录后查看订单',
    prompt: {
      hidden: !0,
      icon: '../../../assets/images/order_empty.png',
    },
    list: {
      current_page: 1,
      last_page: 1,
      total: 0,
      data: []
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isLogin: app.globalData.isLogin,
      hos_id: app.globalData.hos_id,
    })
    if (this.data.isLogin) {
      this.getList()
    }
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
    this.onPullDownRefresh()
  },

  getList: function () {
    app.HttpService.getOrderList({
      'hospital_id': this.data.hos_id,
      per_page: 10,
      page: this.data.list.current_page,
      sort_name: 'addtime',
      stor_dir: 'desc',
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
    // var str = JSON.stringify(this.data.list.data[index]);
    var str = '../detail/detail'
    if (this.data.list.data[index].canteen_type == 16) {
      str = '../service-detail/service-detail'
    }
    app.WxService.navigateTo(str, {
      order_sn: this.data.list.data[index].order_sn
    })
  },
  finishOrder: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    app.HttpService.finishOrder({
      open_id: app.globalData.open_id,
      order_sn: this.data.list.data[index].order_sn
    }).then(res => {
      if (res.success) {
        this.onPullDownRefresh()
      }
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
    return {
      title: '订单管理',
      desc: '天下医家+',
      path: '/page/order/order'
    }
  }
})