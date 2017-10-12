//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    refresh: false, //resume时是否重新刷新数据
    show: 0,//0:请求定位 1：授权失败
    hospital_name: '正在定位中',
    prompt: {
      hidden: !1,
      icon: '../../assets/images/shop_empty.png',
      text: '附件没有正在营业的店铺',
    },
    list: {
      current_page: 1,
      last_page: 1,
      total: 0,
      data: []
    },
    swiper: {
      data: [

      ],
      indicatorDots: true,
      autoplay: true,
    },
    empty: {
      locSuc: 0,
      msg: '无法获取地址\n请打开定位权限然后重试'
    }
  },
  onLoad: function () {
    this.setData({
      isLogin: app.globalData.isLogin,
    })
    app.WxService.getLocation()
      .then(data => {
        this.getHospital(data)
      },
      err => {
        this.setData({
          show: 1
        })
      })
  },
  location: function () {
    app.WxService.getLocation()
      .then(data => {
        this.setData({
          show: 0
        })
        console.log(data)
        this.getHospital(data)
      },
      err => {
        console.log('定位失败' + err)
        app.WxService.openSetting()
          .then(data => {
            console.log(data)
            if (data.authSetting.scope.userLocation) {
              this.location()
            }
          })
      })
  },
  getHospital(data) {
    app.HttpService.lbsHospital({
      'flng': data.longitude,
      'flat': data.latitude
    })
      .then(res => {
        if (!res.success) {
          if (res.code == -28) {
            this.setData({
              show: 1,
              'empty.locSuc': 1,
              'empty.msg': res.msg
            })
          }
          return
        }
        this.setData({
          hos_id: res.data.id,
          hospital_name: res.data.hospital_name,
        })
        app.WxService.setStorageSync('hos_id', this.data.hos_id)
        app.WxService.setStorageSync('hospital_name', this.data.hospital_name)
        app.globalData.hos_id = this.data.hos_id
        this.onPullDownRefresh()
      })
  },
  getList: function () {
    app.HttpService.index({
      'hospital_id': this.data.hos_id,
      per_page: 10,
      page: this.data.list.current_page
    })
      .then(res => {
        if (!res.success) {
          return
        }
        this.setData({
          'list.data': this.data.list.current_page == 1 ? res.data.data : [...this.data.list.data, ...res.data.data],
          'list.last_page': res.data.last_page,
          'list.total': res.data.total,
          'prompt.hidden': res.data.total,
        })
        this.data.list.current_page++
      })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    if (!this.data.refresh) {
      return
    }
    app.WxService.setStorageSync('hos_id', this.data.hos_id)
    app.WxService.setStorageSync('hospital_name', this.data.hospital_name)
    this.setData({
      refresh: false,
      show: 0
    })
    this.onPullDownRefresh()
  },
  pay: function () {
    var order_sn = 'davdian' + app.WxPay.createNonceStr() + app.WxPay.createTimeStamp()
    app.WxPay.order(order_sn, 1, '天下医家+', '123', 1, 'https://ehapi.easyhospital.cn/v2.0.8/order/canteen/wechat')
      .then(data => {
        console.log(data)
      }, err => {
        console.log(err)
      })
  },
  getNews() {
    app.HttpService.indexNews({
      'hospital_id': this.data.hos_id
    })
      .then(res => {
        if (res.success) {
          this.setData({
            'swiper.data': res.data
          })
        }
      })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.data.list.current_page = 1
    this.getList()
    this.getNews()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.list.current_page >= this.data.list.last_page) return
    this.getList()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '天下医家+',
      desc: '首页',
      path: '/page/index/index'
    }
  },
  chooseHospital: function () {
    if (!this.data.isLogin) {
      app.WxService.navigateTo('../hospitalList/hospitalList')
      return
    }
    app.WxService.showModal({
      title: '切换地址将清空购物车',
      // content: '切换地址将清空购物车',
    })
      .then(data => {
        if (data.confirm == 1) {
          app.HttpService.clearShopping({
            'hospital_id': app.globalData.hos_id,
            "open_id": app.globalData.open_id,
          })
            .then(res => {
              app.WxService.navigateTo('../hospitalList/hospitalList')
            })
        }
      })
  },
  clickItem: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    app.WxService.navigateTo('/pages/menu/list/list', {
      id: this.data.list.data[index].id,
      name: this.data.hospital_name + this.data.list.data[index].supplier_name,
      logo: this.data.list.data[index].logo,
      'type': this.data.list.data[index].type
    })
  }
})
