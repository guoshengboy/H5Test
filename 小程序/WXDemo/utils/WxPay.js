import es6 from '../assets/plugins/es6-promise'
import __config from '../etc/config'
import crypto from '../assets/plugins/crypto-js'
/**
 * 微信小程序支付封装
 */
class WxPay {
  constructor() {
  }

  // 获取prepay_id
  getXMLNodeValue(node_name, xml) {
    console.log(xml.toString())
    var tmp = xml.split("<" + node_name + ">")
    var _tmp = tmp[1].split("</" + node_name + ">")
    var tmp = _tmp[0].split('[')
    var tmp1 = tmp[2].split(']')
    return tmp1
  }
  // 时间戳产生函数  
  createTimeStamp() {
    return parseInt(new Date().getTime() / 1000) + ''
  }
  // 随机字符串产生函数  
  createNonceStr() {
    return Math.random().toString(36).substr(2, 15)
  }
  // object-->string
  raw(args) {
    var keys = Object.keys(args)
    keys = keys.sort()
    var newArgs = {}
    keys.forEach(function (key) {
      newArgs[key] = args[key]
    })
    var string = ''
    for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k]
    }
    string = string.substr(1)
    return string
  }

  // 支付md5加密获取sign
  paysignjs(appid, nonceStr, packageStr, signType, timeStamp) {
    var ret = {
      appId: appid,
      nonceStr: nonceStr,
      'package': packageStr,
      signType: signType,
      timeStamp: timeStamp
    }
    var string = this.raw(ret)
    string = string + '&key=' + __config.payKey
    var sign = crypto.MD5(crypto.enc.Utf8.parse(string)).toString()
    return sign.toUpperCase()
  }

  // 统一下单接口加密获取sign
  paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
    var ret = {
      appid: appid,
      attach: attach,
      body: body,
      mch_id: mch_id,
      nonce_str: nonce_str,
      notify_url: notify_url,
      openid: openid,
      out_trade_no: out_trade_no,
      spbill_create_ip: spbill_create_ip,
      total_fee: total_fee,
      trade_type: trade_type
    }
    var string = this.raw(ret)
    string = string + '&key=' + __config.payKey
    var sign = crypto.MD5(crypto.enc.Utf8.parse(string)).toString()
    return sign.toUpperCase()
  }
  // 下单接口
  order(order_sn, attach, body, openid, total_fee, notify_url) {
    var appid = __config.appId
    var mch_id = __config.mchId
    var nonce_str = this.createNonceStr()
    var timeStamp = this.createTimeStamp()
    var url = "https://api.mch.weixin.qq.com/pay/unifiedorder"
    var formData = "<xml>"
    formData += "<appid>" + appid + "</appid>" //appid  
    formData += "<attach>" + attach + "</attach>" //附加数据  
    formData += "<body>" + body + "</body>"
    formData += "<mch_id>" + mch_id + "</mch_id>" //商户号  
    formData += "<nonce_str>" + nonce_str + "</nonce_str>" //随机字符串，不长于32位。  
    formData += "<notify_url>" + notify_url + "</notify_url>"
    formData += "<openid>" + openid + "</openid>"
    formData += "<out_trade_no>" + order_sn + "</out_trade_no>"
    formData += "<spbill_create_ip>127.0.0.1</spbill_create_ip>"
    formData += "<total_fee>" + total_fee + "</total_fee>"
    formData += "<trade_type>JSAPI</trade_type>"//=>JSAPI
    formData += "<sign>" + this.paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, order_sn, '127.0.0.1', total_fee, 'JSAPI') + "</sign>"//=>JSAPI
    formData += "</xml>"
    console.log(formData)
    var self = this
    return new es6.Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'POST',
        data: formData,
        fail: function (err) {
          wx.showToast({ title: '支付失败:' + err })
          reject(err)
        },
        success: function (res) {
          if (res.statusCode == 200) {
            console.log(res)
            var return_code = self.getXMLNodeValue('return_code', res.data)
            if (return_code.indexOf('SUCCESS') !== -1){
              var prepay_id = self.getXMLNodeValue('prepay_id', res.data)
              //签名  
              var _paySignjs = self.paysignjs(appid, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp)
              wx.requestPayment({
                timeStamp: timeStamp,
                nonceStr: nonce_str,
                signType: "MD5",
                'package': tmp1[0],
                paySign: _paySignjs,
                fail: function (aaa) {
                  wx.showToast({ title: '支付失败:' + aaa.errMsg })
                  reject(aaa)
                },
                success: function () {
                  wx.showToast({ title: '支付成功' })
                  resolve(res)
                }
              })
            }else{
              wx.showToast({ title: '支付失败:' + self.getXMLNodeValue('return_msg', res.data) })
              reject(res)
            }
            
          } else {
            reject(res)
          }
        }
      })
    })
  }
}

export default WxPay








// function wxpay(app, money, orderId, redirectUrl) {
//   wx.request({
//     url: 'https://api.it120.cc/' + app.globalData.subDomain + '/pay/wxapp/get-pay-data',
//     data: {
//       token: app.globalData.token,
//       money: money,
//       remark: "支付订单 ：" + orderId,
//       payName: "在线支付",
//       nextAction: { type: 0, id: orderId }
//     },
//     //method:'POST',
//     success: function (res) {
//       console.log('api result:');
//       console.log(res.data);
//       if (res.data.code == 0) {
//         // 发起支付
//         wx.requestPayment({
//           'timeStamp': res.data.data.timeStamp,
//           'nonceStr': res.data.data.nonceStr,
//           'package': 'prepay_id=' + res.data.data.prepayId,
//           'signType': 'MD5',
//           'paySign': res.data.data.sign,
//           fail: function (aaa) {
//             wx.showToast({ title: '支付失败:' + aaa })
//           },
//           success: function () {
//             wx.showToast({ title: '支付成功' })
//             wx.reLaunch({
//               url: redirectUrl
//             });
//           }
//         })
//       } else {
//         wx.showToast({ title: '服务器忙' + res.data.code })
//       }
//     }
//   })
// }

//微信小程序支付封装,暂支持md5加密，不支持sha1
/**
***create order by jianchep 2016/11/22     
 **/
// var config = require('../config/weapp.js')
// var request = require("request")
// var crypto = require('crypto')
// var key = config.key
// module.exports = {
//   // 获取prepay_id
//   getXMLNodeValue: function (node_name, xml) {
//     var tmp = xml.split("<" + node_name + ">")
//     var _tmp = tmp[1].split("</" + node_name + ">")
//     return _tmp[0]
//   },
//   // object-->string
//   raw: function (args) {
//     var keys = Object.keys(args)
//     keys = keys.sort()
//     var newArgs = {}
//     keys.forEach(function (key) {
//       newArgs[key] = args[key]
//     })
//     var string = ''
//     for (var k in newArgs) {
//       string += '&' + k + '=' + newArgs[k]
//     }
//     string = string.substr(1)
//     return string
//   },
//   // 随机字符串产生函数  
//   createNonceStr: function () {
//     return Math.random().toString(36).substr(2, 15)
//   },
//   // 时间戳产生函数  
//   createTimeStamp: function () {
//     return parseInt(new Date().getTime() / 1000) + ''
//   },
//   // 支付md5加密获取sign
//   paysignjs: function (appid, nonceStr, packagestr, signType, timeStamp) {
//     var ret = {
//       appId: appid,
//       nonceStr: nonceStr,
//       package: packagestr,
//       signType: signType,
//       timeStamp: timeStamp
//     }
//     var string = this.raw(ret)
//     string = string + '&key=' + key
//     var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex')
//     return sign.toUpperCase()
//   },
//   // 统一下单接口加密获取sign
//   paysignjsapi: function (appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
//     var ret = {
//       appid: appid,
//       attach: attach,
//       body: body,
//       mch_id: mch_id,
//       nonce_str: nonce_str,
//       notify_url: notify_url,
//       openid: openid,
//       out_trade_no: out_trade_no,
//       spbill_create_ip: spbill_create_ip,
//       total_fee: total_fee,
//       trade_type: trade_type
//     }
//     var string = this.raw(ret)
//     string = string + '&key=' + key
//     var crypto = require('crypto')
//     var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex')
//     return sign.toUpperCase()
//   },
//   // 下单接口
//   order: function (attach, body, mch_id, openid, total_fee, notify_url) {
//     var bookingNo = 'davdian' + this.createNonceStr() + this.createTimeStamp()
//     var deferred = Q.defer()
//     var appid = config.appId
//     var nonce_str = this.createNonceStr()
//     var timeStamp = this.createTimeStamp()
//     var url = "https://api.mch.weixin.qq.com/pay/unifiedorder"
//     var formData = "<xml>"
//     formData += "<appid>" + appid + "</appid>" //appid  
//     formData += "<attach>" + attach + "</attach>" //附加数据  
//     formData += "<body>" + body + "</body>"
//     formData += "<mch_id>" + mch_id + "</mch_id>" //商户号  
//     formData += "<nonce_str>" + nonce_str + "</nonce_str>" //随机字符串，不长于32位。  
//     formData += "<notify_url>" + notify_url + "</notify_url>"
//     formData += "<openid>" + openid + "</openid>"
//     formData += "<out_trade_no>" + bookingNo + "</out_trade_no>"
//     formData += "<spbill_create_ip>127.0.0.1</spbill_create_ip>"
//     formData += "<total_fee>" + total_fee + "</total_fee>"
//     formData += "<trade_type>JSAPI</trade_type>"
//     formData += "<sign>" + this.paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, bookingNo, '61.50.221.43', total_fee, 'JSAPI') + "</sign>"
//     formData += "</xml>"
//     var self = this
//     request({
//       url: url,
//       method: 'POST',
//       body: formData
//     }, function (err, response, body) {
//       if (!err && response.statusCode == 200) {
//         var prepay_id = self.getXMLNodeValue('prepay_id', body.toString("utf-8"))
//         var tmp = prepay_id.split('[')
//         var tmp1 = tmp[2].split(']')
//         //签名  
//         var _paySignjs = self.paysignjs(appid, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp)
//         var args = {
//           appId: appid,
//           timeStamp: timeStamp,
//           nonceStr: nonce_str,
//           signType: "MD5",
//           package: tmp1[0],
//           paySign: _paySignjs
//         }
//         deferred.resolve(args)
//       } else {
//         console.log(body)
//       }
//     })
//     return deferred.promise
//   }
// }

// module.exports = {
//   wxpay: wxpay
// }