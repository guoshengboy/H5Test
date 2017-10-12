import ServiceBase from 'ServiceBase'
var app = getApp();

class Service extends ServiceBase {
  constructor() {
    super()
    this.$$prefix = ''
    this.$$path = {
      // wechatSignUp: '/user/wechat/sign/up',
      // wechatSignIn: '/user/wechat/sign/in',
      wechatLogin: 'wxxcx',
      menuList: 'wxxcx/canteenmenu',
      hospital: 'wxxcx/hospital',
      lbsHospital: 'wxxcx/lbs/hospital',
      indexNews: 'wxxcx/index/news',
      registerCode: 'wxxcx/sms/register',
      login: 'wxxcx/login',
      index: 'wxxcx/index',
      getShopping: 'wxxcx/shopping',
      clearShopping: 'wxxcx/shopping/destroyall',
      getAddressList: 'wxxcx/user/addrbook',
      getWardList: 'wxxcx/dictionary',
      nickname: 'wxxcx/user/nickname',
      getOrderMsg: 'wxxcx/order/create',
      pickAddress: 'wxxcx/user/addrbook/pick',
      createOrder: 'wxxcx/order',
      finishOrder: 'wxxcx/order/finish',
      getUser: 'wxxcx/user',
      getToken: 'oauth/token',
      createRefund: 'wxxcx/service/order/refund/create',
      getServiceOrderMsg: 'wxxcx/service/order/create',
      serviceCreate: 'wxxcx/service/order',
      refund: 'wxxcx/service/order/refund',
      receiptCode: 'wxxcx/receiptcode',
      bill: 'wxxcx/bill',
    }
  }
  /*登录*/
  wechatLogin(params) {
    return this.getRequest(this.$$path.wechatLogin, params)
  }
  /*获取token*/
  getToken(params) {
    return this.postRequest(this.$$path.getToken, params)
  }
  /*菜单列表*/
  menuList(params) {
    return this.getRequest(this.$$path.menuList, params)
  }
  /*医院列表*/
  hospital(params) {
    return this.getRequest(this.$$path.hospital, params)
  }
  /*最近医院*/
  lbsHospital(params) {
    return this.getRequest(this.$$path.lbsHospital, params)
  }
  /*首页活动*/
  indexNews(params) {
    return this.getRequest(this.$$path.indexNews, params)
  }
  /*登录验证码*/
  registerCode(params) {
    return this.postRequest(this.$$path.registerCode, params)
  }
  /*登录*/
  login(params) {
    return this.postRequest(this.$$path.login, params)
  }
  /*首页列表*/
  index(params) {
    return this.getRequest(this.$$path.index, params)
  }
  /*获取购物车*/
  getShopping(params) {
    return this.getRequest(this.$$path.getShopping, params)
  }
  /*增加购物车*/
  postShopping(params) {
    return this.postRequest(this.$$path.getShopping, params)
  }
  /*修改购物车*/
  patchShopping(id) {
    return this.patchRequest(`${this.$$path.getShopping}/${id}`)
  }
  /*删除购物车*/
  deleteShopping(params) {
    return this.deleteRequest(this.$$path.getShopping, params)
  }
  /*清空购物车*/
  clearShopping(params) {
    return this.postRequest(this.$$path.clearShopping, params)
  }
  /*获取地址列表*/
  getAddressList(params) {
    return this.getRequest(this.$$path.getAddressList, params)
  }
  /*新增地址*/
  saveAddress(params) {
    return this.postRequest(this.$$path.getAddressList, params)
  }
  /*修改地址*/
  editAddress(id, params) {
    return this.patchRequest(`${this.$$path.getAddressList}/${id}`, params)
  }
  /*删除地址*/
  deleteAddress(id) {
    return this.deleteRequest(`${this.$$path.getAddressList}/${id}`)
  }
  /*病区列表*/
  getWardList(params) {
    return this.getRequest(this.$$path.getWardList, params)
  }
  /*修改姓名*/
  nickname(params) {
    return this.putRequest(this.$$path.nickname, params)
  }
  /*选择地址*/
  pickAddress(params) {
    return this.getRequest(this.$$path.pickAddress, params)
  }
  /*获取订单列表*/
  getOrderList(params) {
    return this.getRequest(this.$$path.createOrder, params)
  }
  /*获取确认订单信息*/
  getOrderMsg(params) {
    return this.getRequest(this.$$path.getOrderMsg, params)
  }
  /*创建订单*/
  createOrder(params) {
    return this.postRequest(this.$$path.createOrder, params)
  }
  /*获取订单详情*/
  getOrderDetail(id, params) {
    return this.getRequest(`${this.$$path.createOrder}/${id}`, params)
  }
  /*取消订单*/
  cancelOrder(params) {
    return this.putRequest(this.$$path.createOrder, params)
  }
  /*完成订单*/
  finishOrder(params) {
    return this.putRequest(this.$$path.finishOrder, params)
  }
  /*获取用户信息*/
  getUser() {
    return this.getRequest(this.$$path.getUser)
  }
  /*创建服务退款订单*/
  createRefund(params) {
    return this.postRequest(this.$$path.createRefund, params)
  }
  /*创建服务订单 获取数据接口*/
  getServiceOrderMsg(params) {
    return this.getRequest(this.$$path.getServiceOrderMsg, params)
  }
  /*服务创建订单*/
  serviceCreate(params) {
    return this.postRequest(this.$$path.serviceCreate, params)
  }
  /*取消退款*/
  cancelRefund(params) {
    return this.putRequest(this.$$path.refund, params)
  }
  /*线上收款*/
  receiptCode(params) {
    return this.getRequest(this.$$path.receiptCode, params)
  }
  /*账单列表*/
  billList(params) {
    return this.getRequest(this.$$path.bill, params)
  }
  /*获取账单详情*/
  getBillDetail(id, params) {
    return this.getRequest(`${this.$$path.bill}/${id}`, params)
  }




  /*
   * 增加基本请求参数
   */
  requestParams(bean) {
    bean.app_version = "2.0.6";
    bean.debug_key = "1fRuszAqr644xCG7tZ43JyDHK4Ha4sTs";
    // var json = JSON.stringify(bean);
    // var params = new Object();
    // params.sign = getSign(json);
    // params.data = json;
    // params.req_type = "litte_app";
    if (app && app.globalData && app.globalData.userInfo) {
      bean.user_id = app.globalData.userInfo.userId;
      bean.hospital_id = app.globalData.userInfo.hospitalId;
      bean.eh_single = app.globalData.userInfo.eh_single;
    }
    return bean;
  }

}

export default Service