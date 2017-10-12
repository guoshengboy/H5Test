// pages/address/modify/modify.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    floorsIndex: -1,
    areaIndex: -1,
    radio: [
      {
        name: '先生',
        value: 1,
      },
      {
        name: '女士',
        value: 2,
      },
    ],
    form: {
      username: '',
      mobile: '',
      building_name: '',
      bed: '',
      floors: '',
      ward_id: -1,
      gender: 0,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id != undefined) {
      wx.setNavigationBarTitle({ title: '修改地址' })
      var params = {
        id: decodeURIComponent(options.id),
        gender: parseInt(decodeURIComponent(options.gender)),
        username: decodeURIComponent(options.username),
        mobile: decodeURIComponent(options.mobile),
        ward_id: decodeURIComponent(options.ward_id),
        floors: decodeURIComponent(options.floors),
        building_name: decodeURIComponent(options.building_name),
        bed: decodeURIComponent(options.bed),
        recv_addr: decodeURIComponent(options.recv_addr),
      }
      const radio = this.data.radio
      radio.forEach(n => n.checked = n.value == params.gender)

      this.setData({
        radio: radio,
        form: params,
        hospital_name: decodeURIComponent(options.hospital_name),
        hos_id: decodeURIComponent(options.hospital_id)
      })
      this.checkInput()
    } else {
      this.setData({
        hospital_name: wx.getStorageSync('hospital_name'),
        hos_id: app.globalData.hos_id
      })
    }
    this.getWardList()
    this.WxValidate = app.WxValidate({
      username: {
        required: true,
        minlength: 1,
        maxlength: 10,
      },
      mobile: {
        required: true,
        tel: true,
      },
      building_name: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
    }, {
        username: {
          required: '请输入姓名',
        },
        mobile: {
          required: '请输入联系电话',
        },
        building_name: {
          required: '请输入楼名',
        },
      })
  },
  getWardList() {
    app.HttpService.getWardList({
      "hospital_id": this.data.hos_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        var areaArray = res.data.ward
        var floorsArray = res.data.floor
        this.setData({
          areaArray: areaArray,
          floorsArray: floorsArray,
        })
        if ('id' in this.data.form) {
          var areaIndex = -1
          var ward_id = parseInt(this.data.form.ward_id)
          for (var i in areaArray) {
            if (areaArray[i].id == ward_id) {
              areaIndex = i
              this.setData({
                areaIndex: areaIndex
              })
              break
            }
          }
          var floorsIndex = -1
          for (var i in floorsArray) {
            if (floorsArray[i] == this.data.form.floors) {
              floorsIndex = i
              this.setData({
                floorsIndex: floorsIndex
              })
              break
            }
          }
        }
        console.log(this.data)
      })
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const params = e.detail.value
    const value = e.detail.value
    const radio = this.data.radio
    radio.forEach(n => n.checked = n.value == value)
    this.setData({
      radio: radio,
      'form.gender': value,
    })
    this.checkInput()
  },
  usernameChange: function (e) {
    this.data.form.username = e.detail.value
    this.checkInput()
  },
  mobileChange: function (e) {
    this.data.form.mobile = e.detail.value
    this.checkInput()
  },
  building_nameChange: function (e) {
    this.data.form.building_name = e.detail.value
    this.checkInput()
  },
  bedChange: function (e) {
    this.data.form.bed = e.detail.value
    this.checkInput()
  },
  recv_addrChange: function (e) {
    this.data.form.recv_addr = e.detail.value
    this.checkInput()
  },
  wardChange: function (e) {
    console.log(e)
    var index = parseInt(e.detail.value);
    this.setData({
      areaIndex: index,
      'form.ward_id': this.data.areaArray[index].id
    })
    this.checkInput()
  },
  floorsChange: function (e) {
    var index = parseInt(e.detail.value)
    this.data.form.floors = this.data.floorsArray[index]
    this.setData({
      floorsIndex: index
    })
    this.checkInput()
  },

  checkInput() {
    var bean = this.data.form
    var obj = bean.mobile.length && bean.username.length && bean.building_name.length  && bean.floors.length && bean.ward_id != -1 && bean.gender != 0
    //&& bean.bed.length
    this.setData({
      canSave: obj
    })
    console.log(this.data)
  },

  submitForm(e) {
    var params = e.detail.value
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      app.WxService.showModal({
        title: '友情提示',
        content: `${error.param} : ${error.msg}`,
        showCancel: !1,
      })
      return false
    }
    if ('id' in this.data.form) {
      this.editAddress(this.success)
    } else {
      this.saveAddress(this.success)
    }
  },
  editAddress(cb) {
    var params = this.data.form
    params.open_id = app.globalData.open_id
    app.HttpService.editAddress(this.data.form.id, params).then(res => {
      if (res.success) {
        cb()
      }
    })
  },
  saveAddress(cb) {
    var params = this.data.form
    params.open_id = app.globalData.open_id
    params.hospital_id = this.data.hos_id
    app.HttpService.saveAddress(params).then(res => {
      if (res.success) {
        cb()
      }
    })
  },
  success() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      refresh: true
    })
    wx.navigateBack()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})