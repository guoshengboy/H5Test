// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canLogin: 0,
    form: {
      mobile: '',
      code: ''
    },
    codeSecond: '获取验证码',
    secode: 60,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.WxValidate = app.WxValidate({
      mobile: {
        required: true,
        tel: true,
      },
      code: {
        required: true,
        number: true,
        maxlength: 6,
      },
    }, {
        mobile: {
          required: '请输入手机号',
        },
        code: {
          required: '请输入验证码',
        },
      })
  },

  submitForm: function (e) {
    var params = e.detail.value
    console.log(params)
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      app.WxService.showModal({
        title: '友情提示',
        content: `${error.param} : ${error.msg}`,
        showCancel: !1,
      })
      return false
    }
    app.HttpService.login({
      'mobile': this.data.form.mobile,
      'v_code': this.data.form.code
    })
      .then(res => {
        if (res.success) {
          app.globalData.isLogin = 1;
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            isLogin: 1,
            refresh: true
          })
          app.WxService.navigateBack()
        }
      })
  },

  mobileChange: function (e) {
    this.data.form.mobile = e.detail.value
    this.checkInput()
  },

  codeChange: function (e) {
    this.data.form.code = e.detail.value
    this.checkInput()
  },

  checkInput() {
    var obj = this.data.form.mobile.length && this.data.form.code.length
    this.setData({
      canLogin: obj
    })
  },

  getCode() {
    if (this.data.secode != 60) {
      return;
    }
    if (!this.data.form.mobile.length) {
      return;
    }
    app.HttpService.registerCode({
      'mobile': this.data.form.mobile,
      'expired': 120
    })
      .then(res => {
        if (res.success) {
          this.getCodeSuccess()
        }
      })
  },

  getCodeSuccess() {
    this.data.secode--
    this.setData({
      codeSecond: this.data.secode + ' S',
      secode: this.data.secode
    })
    let t = setInterval(() => {
      if (this.data.secode < 1) {
        clearInterval(t);
        this.setData({
          codeSecond: '重新获取',
          secode: 60
        })
      } else {
        this.data.secode--
        this.setData({
          codeSecond: this.data.secode + ' S',
          secode: this.data.secode
        })
      }
    }, 1000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})