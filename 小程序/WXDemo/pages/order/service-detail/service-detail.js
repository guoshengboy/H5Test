// pages/order/service-detail/service-detail.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh: false,
    bean: {},
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
      this.setData({
        bean: params,
      })
      this.setData({
        createTime: this.formatTime(params.addtime)
      })
      this.setData({
        startTime: this.formatDate(params.server_start_time)
      })
      this.setData({
        endTime: this.formatDate(params.server_end_time)
      })
      if (params.pay_time > 0) {
        this.setData({
          payTime: this.formatTime(params.pay_time)
        })
      }
      if (params.finish_time > 0) {
        var finishDate = new Date()
        finishDate.setTime(parseInt(params.finish_time) * 1000)
        var time = finishDate.toLocaleString()
        if (params.flow_status == '0') {
          this.setData({
            cancelTime: this.formatTime(params.finish_time)
          })
        } else {
          this.setData({
            finishTime: this.formatTime(params.finish_time)
          })
        }
      }

      if (params.refund.confirm_time > 0) {
        this.setData({
          refundTime: this.formatTime(params.refund.confirm_time)
        })
      }

      if (params.flow_status == '2' && params.is_lobby == 1) {
        qr.createQrCode(params.order_sn, 'qrCanvas')
      }
      if (params.flow_status == '1') {
        this.countTime()
      }
    })
  },
  formatTime(time) {
    var finishDate = new Date()
    finishDate.setTime(parseInt(time) * 1000)
    return finishDate.toLocaleString()
  },
  formatDate(time) {
    var finishDate = new Date()
    finishDate.setTime(parseInt(time) * 1000)
    return finishDate.toLocaleDateString()
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
  cancelRefund: function (e) {
    app.WxService.showModal({
      title: '是否取消退款\n取消退款后您仍可以再次申请',
    })
      .then(data => {
        if (data.confirm == 1) {
          app.HttpService.cancelRefund({
            user_id: app.globalData.userInfo.user_id,
            order_sn: this.data.bean.order_sn
          }).then(res => {
            if (res.success) {
              this.onPullDownRefresh()
            }
          })
        }
      })
  },
  refund() {
    app.WxService.navigateTo('../../service/refund/refund', {
      order_sn: this.data.bean.order_sn,
      money_paid: this.data.bean.money_paid
    })
  },
  viewRefund() {
    app.WxService.navigateTo('../../service/refund-success/refund-success', {
      money_paid: this.data.bean.refund.refund_fee
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
    this.onPullDownRefresh()
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