// pages/edit/edit.js
import area from "../../lib/area.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    brithday:null,
    area:{},
    brithdayShow :false,
    sexShow:false,
    areaShow:false,
    brithdayTime: null,
    minDate: null,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },
  amend(){
    this.data.user.profile.birthday = this.data.brithdayTime.getTime()
    console.log(this.data.user)
    this.setData({
      user: this.data.user
    })
    wx.setStorageSync("user", this.data.user)
  },
  formatTime(date){
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}/${month}/${month}`
  },
  onClose(){
    this.setData({
      brithdayShow: false,
      sexShow: false,
      areaShow: false
    })
  },
  editArea(){
    this.setData({
      areaShow: true
    })
  },
  areaConfirm(val){
    this.data.user.profile.province=val.detail.values[0].code
    this.data.user.profile.city = val.detail.values[1].code
    this.setData({
      areaShow: false,
      user: this.data.user
    })
  },
  areaCancel(){
    this.setData({
      areaShow: false
    })
  },
  editSignature(e){
    this.data.user.profile.signature = e.detail.value
    this.setData({
      user: this.data.user
    })
    console.log(this.data.user)
  },
  editNickname(e){
    this.data.user.profile.nickname = e.detail.value
    this.setData({
      user: this.data.user
    })
  },
  editBrithday(){
    this.setData({
      brithdayShow: true
    })
  },
  brithdayConfirm(val){
    this.setData({
      brithdayShow: false,
      brithdayTime: new Date(val.detail),
      brithday: this.formatTime(new Date(val.detail))
    })
  },
  brithdayCancel(){
    this.setData({
      brithdayShow: false
    })
  },
  editSex(){
    this.setData({
      sexShow: true
    })
  },
  checkSex(e){
    this.data.user.profile.gender = e.currentTarget.dataset.item * 1
    this.setData({
      sexShow:false,
      user: this.data.user
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: wx.getStorageSync("user"),
      brithdayTime: new Date(wx.getStorageSync("user").profile.birthday),
      brithday: this.formatTime(new Date(wx.getStorageSync("user").profile.birthday)),
      area:area,
      minDate: new Date("1900", "0", "1").getTime(),
    })
    // console.log(this.data.minDate)
    // console.log(this.data.user)
    // console.log(this.data.brithday)
    // console.log(this.data.area)
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