// pages/launch/launch.js

var app = getApp();
var baseJS = require("../../Base/JS/base.js");

Page({
  //跳转tabbar
  skipTabBar: function (num) {
    var index = num.currentTarget.id;
    var index1 = num.target.dataset.id;
    if (index == 1){
      wx.switchTab({
        url: '../Home/home/home',
      })
    }else if(index1==2){
    wx.navigateTo({
      url: '../index/index',
    })
    }
  },


  changeName: function(){
    this.setData({
      name: (this.data.name + app.developer)
  })
  },

  /**
   * 页面的初始数据
   */
  data: {
  name: baseJS.aaa,
  dataArray: ['列表数组', 'a', 'b', 'c', 'd'],
  nameA: {firstName: '曹', lastName: '国盛'},
  nameB: {firstName: '沈', lastName: '巍' },
  nameC: {firstName: '张', lastName: '华南' },
  name1: 'hello',
  name2: 'world',
  objectArray: [
    { id: 5, unique: 'unique_5' },
    { id: 4, unique: 'unique_4' },
    { id: 3, unique: 'unique_3' },
    { id: 2, unique: 'unique_2' },
    { id: 1, unique: 'unique_1' },
    { id: 0, unique: 'unique_0' },
  ],
  numberArray: [1, 2, 3, 4]
  },

  switch: function (e) {
    const length = this.data.objectArray.length
    for (let i = 0; i < length; ++i) {
      const x = Math.floor(Math.random() * length)
      const y = Math.floor(Math.random() * length)
      const temp = this.data.objectArray[x]
      this.data.objectArray[x] = this.data.objectArray[y]
      this.data.objectArray[y] = temp
    }
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addToFront: function (e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{ id: length, unique: 'unique_' + length }].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addNumberToFront: function (e) {
    this.data.numberArray = [this.data.numberArray.length + 1].concat(this.data.numberArray)
    this.setData({
      numberArray: this.data.numberArray
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})