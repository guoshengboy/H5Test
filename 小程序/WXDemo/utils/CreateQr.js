var QR = require("../assets/plugins/qrcode.js");

//适配不同屏幕大小的canvas
function setCanvasSize() {
  var size = {};
  try {
    var res = wx.getSystemInfoSync();
    var scale = 750 / 460;//不同屏幕下canvas的适配比例；设计稿是750宽
    var width = res.windowWidth / scale;
    var height = width;//canvas画布为正方形
    size.w = width;
    size.h = height;
  } catch (e) {
    // Do something when catch error
    console.log("获取设备信息失败" + e);
  }
  console.log(size);
  return size;
}

function createQrCode(url, canvasId) {
  var size = setCanvasSize();
  //调用插件中的draw方法，绘制二维码图片
  QR.qrApi.draw(url, canvasId, size.w, size.h);
}

module.exports = {
  createQrCode: createQrCode
}


// //获取临时缓存照片路径，存入data中
// function canvasToTempImage() {
//   var that = this;
//   wx.canvasToTempFilePath({
//     canvasId: 'mycanvas',
//     success: function (res) {
//       var tempFilePath = res.tempFilePath;
//       console.log("********" + tempFilePath);
//       that.setData({
//         imagePath: tempFilePath,
//       });
//     },
//     fail: function (res) {
//       console.log(res);
//     }
//   });
// }
