//app.js
import WxValidate from 'utils/WxValidate'
// import HttpResource from 'utils/HttpResource'
import HttpService from 'utils/HttpService'
import WxService from 'utils/WxService'
import Config from 'etc/config'
import WxPay from 'utils/WxPay'
import Tools from 'utils/Tools'

App({
  onLaunch: function () {
    // this.getUserInfo()
  },
  // getUser() {
  //   this.HttpService.getUser().then(res => {
  //     this.globalData.userInfo = res
  //     this.globalData.open_id = res.open_id
  //     console.log(this.globalData)
  //   })
  // },
  getUserInfo: function (cb) {
    let code
    return this.WxService.login()
      .then(data => {
        console.log(data)
        code = data.code
        return this.WxService.getUserInfo()
      })
      .then(data => {
        // return this.WxService.request({
        //   url: 'https://wxxcx.chenwang.xyz/wxxcx',
        //   data: {
        //     encryptedData: data.encryptedData,
        //     iv: data.iv,
        //     // rawData: data.rawData,
        //     // signature: data.signature,
        //     code: code
        //   }
        // })
        return this.HttpService.wechatLogin({
          encryptedData: data.encryptedData,
          iv: data.iv,
          code: code,
        })
      })
      .then(data => {
        this.WxService.setStorageSync('token', data.token)
        this.globalData.userInfo = data
        this.globalData.isLogin = parseInt(data.user_id)
        this.globalData.open_id = data.openId
        console.log(this.globalData)
        wx.switchTab({
          url: '/pages/index/index',
        })
        // this.WxService.switchTab('/pages/index/index')
      },err => {
        console.log(err)
      })
  },
  globalData: {
    userInfo: null,
    isLogin: 1,
    hos_id: 0,
    open_id: ''
  },
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  // HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
  HttpService: new HttpService,
  WxService: new WxService,
  Config: Config,
  Tools: new Tools,
  WxPay: new WxPay
})