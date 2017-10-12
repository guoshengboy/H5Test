// pages/menu/list/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh: false, //resume时是否重新刷新数据
    hospital_name: '',
    prompt: {
      hidden: !0,
      icon: '../../../assets/images/rest.png',
      text: '非常抱歉，店铺正在休息',
    },
    list: [],
    settlement: {
      total_number: 0,
      amount: '0.00',
      list: [],
      hidden: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      isLogin: app.globalData.isLogin,
      hospital_name: decodeURIComponent(options.name),
      logo: decodeURIComponent(options.logo),
      hos_id: wx.getStorageSync('hos_id'),
      isService: parseInt(options.type),
    })
    this.getList()
  },

  getShopping() {
    if (!this.data.isLogin) {
      return
    }
    app.HttpService.getShopping({
      'hospital_id': this.data.hos_id,
      "open_id": app.globalData.open_id,
      'supplier_id': this.data.id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        if (res.data.length == 0) {
          return
        }
        var select = res.data[0].shop_cart
        var selList = new Array
        var list = this.data.list
        for (var y in list) {
          var index = -1
          for (var i in select) {
            if (select[i].product_id == list[y].id) {
              index = i
              list[y].selectNum = select[i].number
            }
          }
          if (index != -1) {
            selList.push(select[index])
          }
        }

        this.setData({
          'settlement.list': selList,
          list: list
        })
        this.calculation()
      })
  },

  getList: function () {
    app.HttpService.menuList({
      'hospital_id': this.data.hos_id,
      supplier_id: this.data.id,
    })
      .then(res => {
        console.log(res)
        if (!res.success) {
          return
        }
        this.setData({
          list: res.data.menu_list,
          'prompt.hidden': res.data.menu_list.length,
        })
        this.getShopping()
      })
  },
  addDish(event) {
    if (!this.data.isLogin) {
      app.WxService.navigateTo('/pages/login/login')
      return
    }
    let id = event.currentTarget.dataset.id;
    var index = parseInt(event.currentTarget.dataset.index);
    var list = this.data.list;

    var bean = list[index];

    app.HttpService.postShopping({
      'hospital_id': this.data.hos_id,
      'product_id': bean.id,
      'number': 1,
      'supplier_id': this.data.id,
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
        list[index].selectNum = res.data.number;
        this.setData({
          list: list,
          'settlement.list': select,
        })
        this.calculation()
      })
  },
  deleteDish(event) {
    let id = event.currentTarget.dataset.id;
    var index = parseInt(event.currentTarget.dataset.index);
    var list = this.data.list;

    var bean = list[index];
    if (bean.selectNum == 0) {
      return
    }
    app.HttpService.postShopping({
      'hospital_id': this.data.hos_id,
      'product_id': bean.id,
      'number': -1,
      'supplier_id': this.data.id,
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
          delete list[index].selectNum
        } else {
          select[selectIndex].number = res.data.number
          list[index].selectNum = res.data.number
        }

        this.setData({
          list: list,
          'settlement.list': select,
        })
        this.calculation()
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
  settlement: function () {
    app.WxService.navigateTo('../../order/confirm/confirm', {
      id: this.data.id
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
  clearShoppingCart() {
    app.HttpService.clearShopping({
      'hospital_id': this.data.hos_id,
      'supplier_id': this.data.id,
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        var list = this.data.list
        for (var i in list) {
          delete list[i].selectNum;
        }
        this.setData({
          list: list,
          'settlement.list': [],
          'settlement.total_number': 0,
          'settlement.amount': '0.00',
          'settlement.hidden': 1
        })
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
      'supplier_id': this.data.id,
      'type': 1,
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        var list = this.data.list
        var selectIndex = -1
        for (var i in list) {
          if (list[i].id == bean.product_id) {
            selectIndex = i
            break
          }
        }
        select[index].number = res.data.number
        list[selectIndex].selectNum = res.data.number;
        this.setData({
          list: list,
          'settlement.list': select,
        })
        this.calculation()
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
      'supplier_id': this.data.id,
      'type': 1,
      "open_id": app.globalData.open_id,
    })
      .then(res => {
        if (!res.success) {
          return
        }
        var list = this.data.list
        var selectIndex = -1
        for (var i in select) {
          if (list[i].id == bean.product_id) {
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
          select.splice(index, 1)
          delete list[selectIndex].selectNum
        } else {
          select[index].number = res.data.number
          list[selectIndex].selectNum = res.data.number
        }

        this.setData({
          list: list,
          'settlement.list': select,
        })
        this.calculation()
      })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  clickItem: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var obj = this.data.list[index]
    obj.supplier_id = this.data.id
    obj.hos_id = this.data.hos_id
    obj.type = this.data.isService
    app.WxService.navigateTo('/pages/menu/detail/detail', obj)
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
})