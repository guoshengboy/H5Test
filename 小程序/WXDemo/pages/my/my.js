// pages/my/my.js
import __config from '../../etc/config'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: 0,
    msg: '您还没有登录，请登录后查看我的信息'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.setData({
      isLogin: app.globalData.isLogin,
      user: app.globalData.userInfo
    })
  },

  login() {
    if (this.data.isLogin) {
      return
    }
    app.WxService.navigateTo('../login/login')
  },
  clickAddress: function () {
    if (!this.data.isLogin) {
      app.WxService.navigateTo('../login/login')
      return
    }
    app.WxService.navigateTo('../address/list/list')
  },
  clickBill: function () {
    if (!this.data.isLogin) {
      app.WxService.navigateTo('../login/login')
      return
    }
    app.WxService.navigateTo('../bill/list/list')
  },
  clickPersonal() {
    if (!this.data.isLogin) {
      app.WxService.navigateTo('../login/login')
      return
    }
    app.WxService.navigateTo('../personal/personal/personal')
  },
  clickUse() {
    app.WxService.scanCode()
      .then(data => {
        console.log(data)
        if (data.result.indexOf(__config.onlineReceipt) != -1) {
          var strings = data.result.split('/')
          app.WxService.navigateTo('../service/receive/receive', {
            code: strings[strings.length - 1]
          })
        }
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '天下医家+',
      desc: '我的',
      path: '/page/my/my'
    }
  }
})