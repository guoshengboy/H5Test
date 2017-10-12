// pages/shoppingCart/shoppingCart.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh:false,
    isLogin: 0,
    msg: '您还没有登录，请登录后查看购物车',
    prompt: {
      hidden: !0,
      icon: '/assets/images/shopping_cart.png',
      text: '购物车为空，赶紧去添加吧',
    },
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isLogin: app.globalData.isLogin,
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
    app.HttpService.getShopping({
      'hospital_id': app.globalData.hos_id,
      open_id: app.globalData.open_id
    })
      .then(res => {
        if (!res.success) {
          return
        }
        this.setData({
          'list': res.data,
          'prompt.hidden': res.data.length,
        })
        console.log(this.data)

      })
  },

  clickClear(event) {
    let id = event.currentTarget.dataset.id;
    var index = parseInt(event.currentTarget.dataset.index);

    app.HttpService.clearShopping({
      'hospital_id': app.globalData.hos_id,
      'supplier_id': id,
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        var l = this.data.list
        l.splice(index, 1)
        this.setData({
          list: l,
          'prompt.hidden': l.length,
        })
      })
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
    this.setData({
      hospital_name: wx.getStorageSync('hospital_name')
    })

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
    this.getList()
  },
  clickItem(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    app.WxService.navigateTo('../order/confirm/confirm', {
      id: this.data.list[index].id
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '天下医家+',
      desc: '购物车',
      path: '/page/order/order'
    }
  }
})