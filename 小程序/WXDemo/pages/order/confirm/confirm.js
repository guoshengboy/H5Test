// pages/order/confirm/confirm.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh: false, //resume时是否重新刷新数据
    address: null,
    array: [
      '定点自取'
    ],
    timeArray: [],
    eatType: -1,
    selectTime: -1,
    hosIndex: -1,
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      supplier_id: options.id,
      hospital_name: wx.getStorageSync('hospital_name'),
      hos_id: app.globalData.hos_id,
    })
    this.getData()
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
    if (this.data.address.bed.length) {
      this.setData({
        array: [
          '商品配送',
          '定点自取',
        ]
      })
    } else {
      this.setData({
        array: [
          '定点自取'
        ]
      })
    }
  },
  getData() {
    app.HttpService.getOrderMsg({
      hospital_id: this.data.hos_id,
      supplier_id: this.data.supplier_id,
      open_id: app.globalData.open_id,
    }).then(res => {
      if (!res.success) {
        return
      }
      var timeArray = new Array
      for (var i in res.data.hospitalConfig.book_new_distribution_time.list) {
        timeArray.push(res.data.hospitalConfig.book_new_distribution_time.week_name + res.data.hospitalConfig.book_new_distribution_time.list[i])
      }
      this.setData({
        hospitalConfig: res.data.hospitalConfig,
        supplier: res.data.supplier,
        logo: res.data.supplier.logo,
        supplier_name: res.data.supplier.supplier_name,
        timeArray: timeArray
      })
    })
  },

  bindPickerChange(e) {
    console.log(e)
    var index = parseInt(e.detail.value);
    this.setData({
      eatType: index
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
  bindTimePickerChange(e) {
    console.log(e)
    var index = parseInt(e.detail.value);
    this.setData({
      selectTime: index
    })
  },
  remarkChange(e) {
    this.data.remark = e.detail.value
  },

  clickAddress() {
    app.WxService.navigateTo('../../address/select/select')
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
    var is_lobby = this.data.eatType
    if (this.data.array.length == 1){
      is_lobby = 1
    }
    var params = {
      open_id: app.globalData.open_id,
      pay_type: 2,
      hospital_id: this.data.hos_id,
      supplier_id: this.data.supplier_id,
      addrbook_id: this.data.address.id,
      is_lobby: is_lobby,
      invite_place: this.data.address.invite_place,
      delivery_time: this.data.hospitalConfig.book_new_distribution_time.week_time + this.data.hospitalConfig.book_new_distribution_time.list[this.data.selectTime],
      remark: this.data.remark
    }
    if (this.data.hospitalConfig.hospital_subordinate.length) {
      params.hospital_block_id = this.data.hospitalConfig.hospital_subordinate[this.data.hosIndex].id
    }
    app.HttpService.createOrder(params).then(res => {
      if (res.success) {
        app.WxService.redirectTo('../detail/detail', {
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
    if (this.data.eatType == -1) {
      return '请选择方式'
    }
    if (this.data.selectTime == -1) {
      return '请选择时间'
    }
    return ''
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