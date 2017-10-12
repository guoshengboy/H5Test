// pages/service/refund/refund.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_sn: options.order_sn,
      money_paid: options.money_paid
    })

  },

  input(e) {
    this.data.money = e.detail.value
    this.setData({
      canCofirm: this.data.money.length
    })
  },
  confirm() {
    var max = parseFloat(this.data.money_paid)
    var money = parseFloat(this.data.money)
    if (money < 0.01 || money > max) {
      wx.showToast({
        title: '输入金额不正确',
        icon: 'loading',
        duration: 5000,
        mask: !0,
      })
      return
    }
    app.WxService.showModal({
      title: '您申请的￥' + this.data.money + '元退款\n申请提交后请耐心等待工作人员核对',
      showCancel: 1,
    })
      .then(data => {
        if (data.confirm) {
          app.HttpService.createRefund({
            user_id: app.globalData.userInfo.user_id,
            order_sn: this.data.order_sn,
            refund_fee: this.data.money
          })
            .then(data => {
              if (!data.success) {
                return
              }
              var index = parseInt(e.currentTarget.dataset.index);
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              prevPage.setData({
                refresh: true
              })
              app.WxService.navigateTo('../refund-success/refund-success')
            })
        }
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})