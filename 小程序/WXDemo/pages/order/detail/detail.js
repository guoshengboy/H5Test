// pages/order/detail/detail.js
var qr = require('../../../utils/CreateQr.js');
var util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bean: {},
    expand: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'bean.order_sn': decodeURIComponent(options.order_sn),
    })
    this.getData()

  },

  getData() {
    app.HttpService.getOrderDetail(this.data.bean.order_sn, {
      open_id: app.globalData.open_id
    }).then(res => {
      if (!res.success) {
        return
      }
      var params = res.data;
      var date = new Date()
      var addtime = parseInt(params.addtime) * 1000
      date.setTime(addtime)
      this.setData({
        bean: params,
        logo: params.supplier.logo,
        hospital_name: params.hospital_name,
        supplier_name: params.supplier_name,
        createTime: date.toLocaleString()
      })
      if (params.pay_time > 0) {
        var payDate = new Date()
        payDate.setTime(parseInt(params.pay_time) * 1000)
        this.setData({
          payTime: payDate.toLocaleString()
        })
      }
      if (params.finish_time > 0) {
        var finishDate = new Date()
        finishDate.setTime(parseInt(params.finish_time) * 1000)
        var time = finishDate.toLocaleString()
        if (params.flow_status == '0') {
          this.setData({
            cancelTime: time
          })
        } else {
          this.setData({
            finishTime: time
          })
        }
      }

      if (params.flow_status == '2' && params.is_lobby == 1) {
        qr.createQrCode(params.order_sn, 'qrCanvas')
      }
      if (params.flow_status == '1') {
        this.countTime()
      }
    })
  },
  countTime() {
    var addtime = parseInt(this.data.bean.addtime) * 1000
    //倒计时15分钟
    var endtime = addtime + 15 * 60 * 1000
    var nowDate = new Date();
    nowDate.setTime(endtime)
    this.setData({
      time: nowDate.toLocaleString()
    })
    // var now = nowDate.getTime();
    // var leftTime = endtime - now
    // if (leftTime > 0) {
    //   this.setData({
    //     time: Math.floor(leftTime / 1000 / 60 % 60) + ":" + Math.floor(leftTime / 1000 % 60)
    //   })
    //   setTimeout(this.countTime, 1000);
    // } else {
    //   this.setData({
    //     time: '00:00'
    //   })
    // }
  },
  cancelOrder() {
    app.WxService.showModal({
      title: '是否需要取消订单',
    })
      .then(data => {
        if (data.confirm == 1) {
          app.HttpService.cancelOrder({
            open_id: app.globalData.open_id,
            order_sn: this.data.bean.order_sn
          }).then(res => {
            if (!res.success) {
              return
            }
            this.getData()
          })
        }
      })
  },
  finishOrder: function (e) {
    app.WxService.showModal({
      title: '是否确认完成订单',
    })
      .then(data => {
        if (data.confirm == 1) {
          app.HttpService.finishOrder({
            open_id: app.globalData.open_id,
            order_sn: this.data.bean.order_sn
          }).then(res => {
            if (res.success) {
              this.onPullDownRefresh()
            }
          })
        }
      })
  },
  expandData() {
    this.setData({
      expand: !this.data.expand
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})