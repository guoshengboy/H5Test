// pages/personal/changeMobile/changeMobile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canSubmit: 0,
    codeSecond: '获取验证码',
    secode: 60,
    form: {
      mobile: '',
      code: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      canSubmit: obj
    })
  },
  getCode() {
    if (this.data.secode != 60) {
      return;
    }
    this.data.secode--
    this.setData({
      codeSecond: this.data.secode + ' S',
      secode: this.data.secode
    })
    let t = setInterval(() => {
      if (this.secode < 1) {
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