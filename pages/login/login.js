// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
    phoneLock: false,
    emailLock: false,
    passwordLock: false
  },
  onChange(value) {
    console.log(value)
  },
  goRegister() {
    wx.navigateTo({
      url: "/pages/register/register"
    })
  },
  getPhone(e) {
    this.setData({
      phoneLock: false
    })
    if (!(/^1[3456789]\d{9}$/.test(e.detail.value))) {
      this.setData({
        phoneLock: true
      })
      return false;
    } 
    this.setData({
      phone: e.detail.value,
    })
  },
  getEmail(e) {
    this.setData({
      emailLock: false
    })
    if (!/^[\w._]+@(163)\.com(\r\n|\r|\n)?$/.test(e.detail.value)) {
      this.setData({
        emailLock: true
      })
      return false;
    }
    this.setData({
      phone: e.detail.value
    })
  },
  getPassword(e) {
    this.setData({
      passwordLock: false
    })
    if (!/^.{6,20}$/i.test(e.detail.value)){
      this.setData({
        passwordLock: true
      })
      return false;
    }
    this.setData({
      password: e.detail.value
    })
  },
  phoneLogin() {
    if (this.data.phone && this.data.password && !this.data.phoneLock && !this.data.passwordLock){
      app.globalData.fly.get(`/login/cellphone?phone=${this.data.phone}&password=${this.data.password}`).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.getInfo(res.data.profile.userId)
        }
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: err.engine.response.message,
        })
      })
    }else {
      wx.showToast({
        title: '请确认信息无误',
      })
    }
  },
  emailLogin() {
    if (this.data.phone && this.data.password && !this.data.emailLock && !this.data.passwordLock){
      app.globalData.fly.get(`/login?email=${this.data.phone}&password=${this.data.password}`).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.getInfo(res.data.profile.userId)
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showToast({
        title: '请确认信息无误',
      })
    }
  },
  getInfo(uid) {
    app.globalData.fly.get(`/user/detail?uid=${uid}`).then(res => {
      console.log(res, 1)
      if (res.data.code === 200) {
        wx.setStorageSync("user", res.data)
        wx.switchTab({
          url: '/pages/my/my'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})