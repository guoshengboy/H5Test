// pages/order/serviceConfirm/serviceConfirm.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textnum: 0,
    hosIndex: -1,
    remark: '',
    address: null,
    startDate: '',
    endDate: '',
    total: '0.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      supplier_id: options.supplier_id,
      menu_id: options.menu_id,
      hospital_name: wx.getStorageSync('hospital_name'),
      hos_id: app.globalData.hos_id,
    })
    this.getData()
  },

  getData() {
    app.HttpService.getServiceOrderMsg({
      hospital_id: this.data.hos_id,
      supplier_id: this.data.supplier_id,
      menu_id: this.data.menu_id,
      // open_id: app.globalData.open_id,
    }).then(res => {
      if (!res.success) {
        return
      }
      this.setData({
        hospitalConfig: res.data.hospitalConfig,
        canteen_menu: res.data.canteen_menu
      })
    })
  },
  hosChange(e) {
    var index = parseInt(e.detail.value);
    var obj = this.data.hospitalConfig.hospital_subordinate[index]
    this.setData({
      hospital_block_id: obj.id,
      hosIndex: index
    })
  },
  remarkChange(e) {
    this.data.remark = e.detail.value
    this.setData({
      textnum: this.data.remark.length
    })
  },
  clickAddress() {
    app.WxService.navigateTo('../../address/select/select')
  },
  startChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
    this.calTotal()
  },
  endChange: function (e) {
    this.setData({
      endDate: e.detail.value
    })
    this.calTotal()
  },
  calTotal() {
    if (this.data.startDate.length <= 0 || this.data.endDate.length <= 0) {
      return
    }
    var num = app.Tools.howDaysInTwoDate(this.data.startDate, this.data.endDate) + 1;
    this.setData({
      total: this.data.canteen_menu.menu_price * num
    })
  },

  createOrder() {
    var toast = this.checkInput()
    if (toast.length) {
      wx.showToast({
        title: toast,
        icon: 'loading',
        duration: 5000,
        mask: !0,
      })
      return
    }
    var params = {
      open_id: app.globalData.open_id,
      pay_type: 2,
      hospital_id: this.data.hos_id,
      supplier_id: this.data.supplier_id,
      menu_id: this.data.menu_id,
      addrbook_id: this.data.address.id,
      server_start_time: this.data.startDate,
      server_end_time: this.data.endDate,
      remark: this.data.remark,
      amount: this.data.total,
    }
    if (this.data.hospitalConfig.hospital_subordinate.length) {
      params.hospital_block_id = this.data.hospitalConfig.hospital_subordinate[this.data.hosIndex].id
    }
    app.HttpService.serviceCreate(params).then(res => {
      if (res.success) {
        app.WxService.redirectTo('../service-detail/service-detail', {
          order_sn: res.data.order_sn
        })
      }
    })

  },
  checkInput() {
    if (this.data.hospitalConfig.hospital_subordinate.length) {
      if (this.data.hosIndex == -1) {
        return '请选择医院院区'
      }
    }
    if (this.data.address == null) {
      return '选择收货地址'
    }
    if (this.data.startDate.length == 0) {
      return '请选择入院时间'
    }
    if (this.data.startDate.length == 0) {
      return '请选择出院时间'
    }
    return ''
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})