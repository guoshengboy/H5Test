// pages/menu/detail/detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dish: {
      selectNum: 0,
      menu_price: '0.00'
    },
    settlement: {
      total_number: 0,
      amount: '0.00',
      list: [],
      hidden: 1,
      isService: 0,
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isService: parseInt(options.type),
      isLogin: app.globalData.isLogin,
      supplier_id: decodeURIComponent(options.supplier_id),
      hos_id: decodeURIComponent(options.hos_id),
      dish: {
        id: decodeURIComponent(options.id),
        menu_original: decodeURIComponent(options.menu_original),
        menu_name: decodeURIComponent(options.menu_name),
        desc: decodeURIComponent(options.desc),
        menu_price: decodeURIComponent(options.menu_price),
        selectNum: decodeURIComponent(options.selectNum)
      },
    })
    this.getShopping()
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        })
      },
    })
  },
  getShopping() {
    if (!this.data.isLogin) {
      return
    }
    app.HttpService.getShopping({
      'hospital_id': this.data.hos_id,
      "open_id": app.globalData.open_id,
      'supplier_id': this.data.supplier_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        if (res.data.length == 0) {
          return
        }
        var select = res.data[0].shop_cart
        var dish = this.data.dish
        for (var i in select) {
          if (select[i].product_id == dish.id) {
            dish.selectNum = select[i].number
          }

        }
        this.setData({
          'settlement.list': select,
          dish: dish
        })
        this.calculation()
      })
  },
  reset() {
    this.animation.rotate(0, 0)
      .scale(1)
      .translate(0, 0)
      .skew(0, 0)
      .step({ duration: 0 })
    this.setData({ animation: this.animation.export() })
  },

  addDish(event) {
    if (!this.data.isLogin) {
      app.WxService.navigateTo('/pages/login/login')
      return
    }
    var bean = this.data.dish
    app.HttpService.postShopping({
      'hospital_id': this.data.hos_id,
      'product_id': bean.id,
      'number': 1,
      'supplier_id': this.data.supplier_id,
      'type': 1,
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        var select = this.data.settlement.list
        var selectIndex = -1
        for (var i in select) {
          if (select[i].product_id == bean.id) {
            selectIndex = i
            break
          }
        }
        if (selectIndex == -1) {
          var select = this.data.settlement.list
          select.push(res.data)
        } else {
          select[selectIndex].number = res.data.number
        }
        bean.selectNum = res.data.number;
        this.setData({
          dish: bean,
          'settlement.list': select,
        })
        this.calculation()
        this.backRefresh()
        // this.animation
        //   .width(20)
        //   .height(32)
        //   .translate(-this.data.windowWidth * 0.9, this.data.windowHeight)
        //   .step()
        // this.setData({ animation: this.animation.export() })
        // var that = this
        // setTimeout(function () {
        //   that.reset()
        // }, 1000);
        // console.log(this.data)
      })
  },
  deleteDish(event) {
    var bean = this.data.dish;
    if (bean.selectNum == 0) {
      return
    }
    app.HttpService.postShopping({
      'hospital_id': this.data.hos_id,
      'product_id': bean.id,
      'number': -1,
      'supplier_id': this.data.supplier_id,
      'type': 1,
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        var select = this.data.settlement.list
        var selectIndex = -1
        for (var i in select) {
          if (select[i].product_id == bean.id) {
            selectIndex = i
            break
          }
        }
        if (res.data instanceof Array) {
          /*{
            "data": [],
            "code": "1",
            "msg": "操作成功",
            "time": 1496885997
          } */
          select.splice(selectIndex, 1)
          bean.selectNum = 0
        } else {
          select[selectIndex].number = res.data.number
          bean.selectNum = res.data.number
        }

        this.setData({
          dish: bean,
          'settlement.list': select,
        })
        this.calculation()
        this.backRefresh()
      })
  },
  calculation: function () {
    var obj = {
      total: 0,
      num: 0
    }
    var select = this.data.settlement.list
    for (var i in select) {
      var price = select[i].menu_price;
      obj.total += price * select[i].number;
      obj.num += select[i].number;
    }
    if (obj.num == 0) {
      this.setData({
        'settlement.hidden': 1
      })
    }
    this.setData({
      'settlement.total_number': obj.num,
      'settlement.amount': obj.total.toFixed(2)
    })
  },
  backRefresh() {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      refresh: true
    })
  },
  settlement: function () {
    app.WxService.navigateTo('../../order/confirm/confirm', {
      id: this.data.supplier_id
    })
  },
  serviceSettlement: function () {
    if (!this.data.isLogin) {
      app.WxService.navigateTo('/pages/login/login')
      return
    }
    app.WxService.navigateTo('../../order/serviceConfirm/serviceConfirm', {
      supplier_id: this.data.supplier_id,
      menu_id: this.data.dish.id
    })
  },

  clearShoppingCart() {
    app.HttpService.clearShopping({
      'hospital_id': this.data.hos_id,
      'supplier_id': this.data.supplier_id,
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        this.setData({
          'dish.selectNum': 0,
          'settlement.list': [],
          'settlement.total_number': 0,
          'settlement.amount': '0.00',
          'settlement.hidden': 1
        })
        this.backRefresh()
      })
  },
  addDishCart(event) {
    let id = event.currentTarget.dataset.id;
    var index = parseInt(event.currentTarget.dataset.index);
    var select = this.data.settlement.list;

    var bean = select[index];

    app.HttpService.postShopping({
      'hospital_id': this.data.hos_id,
      'product_id': bean.product_id,
      'number': 1,
      'supplier_id': this.data.supplier_id,
      'type': 1,
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        var dish = this.data.dish
        if (dish.id == bean.product_id) {
          dish.selectNum = res.data.number;
        }
        select[index].number = res.data.number
        this.setData({
          dish: dish,
          'settlement.list': select,
        })
        this.calculation()
        this.backRefresh()
      })
  },
  deleteDishCart(event) {
    let id = event.currentTarget.dataset.id;
    var index = parseInt(event.currentTarget.dataset.index);
    var select = this.data.settlement.list;
    var bean = select[index];
    if (bean.number == 0) {
      return
    }
    app.HttpService.postShopping({
      'hospital_id': this.data.hos_id,
      'product_id': bean.product_id,
      'number': -1,
      'supplier_id': this.data.supplier_id,
      'type': 1,
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        var dish = this.data.dish
        if (dish.id == bean.product_id) {
          dish.selectNum = res.data.number;
        }
        if (res.data instanceof Array) {
          /*{
            "data": [],
            "code": "1",
            "msg": "操作成功",
            "time": 1496885997
          } */
          select.splice(index, 1)
          if (dish.id == bean.product_id) {
            dish.selectNum = 0;
          }
        } else {
          select[index].number = res.data.number
          if (dish.id == bean.product_id) {
            dish.selectNum = res.data.number;
          }
        }

        this.setData({
          list: list,
          'settlement.list': select,
        })
        this.calculation()
        this.backRefresh()
      })
  },
  popup() {
    if (this.data.settlement.list.length == 0) {
      return
    }
    this.setData({
      'settlement.hidden': !this.data.settlement.hidden
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
    this.getShopping()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})