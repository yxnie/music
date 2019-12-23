// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
    code: "",
    nickname: "",
    lock: false,
    phoneLock: false,
    passwordLock: false,
    codeLock: false,
    nicknameLock: false,
    getCodeLock: false
  },
  register() {
    if (this.data.phone && this.data.password && this.data.code && this.data.nickname && !this.data.lock && !this.data.phoneLock && !this.data.passwordLock && !this.data.codeLock && !this.data.nicknameLock && !this.data.getCodeLock) {
      app.globalData.fly.get(`/register/cellphone?phone=${this.data.phone}&password=${this.data.password}&captcha=${this.data.code}&nickname=${this.data.nickname}`).then(res => {
        console.log(res)
        if (res.data.status === 200) {} else if (res.data.status === 505) {
          wx.showToast({
            title: res.engine.response.msg,
          })
        }
      }).catch(err => {
        console.log(err)
        if (err.status === 505) {
          wx.showToast({
            title: err.engine.response.msg,
          })
        }
      })
    } else {
      wx.showToast({
        title: '请确认信息无误',
        icon: 'none'
      })
    }
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
      phone: e.detail.value
    })
    // const query = wx.createSelectorQuery()
    // query.selectAll('.input').boundingClientRect()
    // query.exec((res) => {
    //   console.log(res[0][1])
    //   res[0][1].focus()
    // })
  },
  getPassword(e) {
    this.setData({
      passwordLock: false
    })
    if (!/^.{6,20}$/i.test(e.detail.value)) {
      this.setData({
        passwordLock: true
      })
      return false;
    }
    this.setData({
      password: e.detail.value
    })
  },
  inputCode(e) {
    this.setData({
      codeLock: false
    })
    if (!e.detail.value) {
      this.setData({
        codeLock: true
      })
      return false;
    }
    this.setData({
      code: e.detail.value,
      lock: false
    })
    this.verifyCode()
  },
  getNickname(e) {
    this.setData({
      nicknameLock: false
    })
    if (!e.detail.value) {
      this.setData({
        nicknameLock: true
      })
      return false;
    }
    this.setData({
      nickname: e.detail.value
    })
  },
  verifyPhone() {
    if (!this.data.phoneLock) {
      if (this.data.phone) {
        app.globalData.fly.get(`/cellphone/existence/check?phone=${this.data.phone}`).then(res => {
          console.log(res)
          if (res.data.exist === 1) {
            wx.showToast({
              title: '该号码已被注册',
              icon: 'none'
            })
          } else {
            this.getCode()
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        wx.showToast({
          title: '请填写正确的手机号码',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none'
      })
    }
  },
  getCode() {
    app.globalData.fly.get(`/captcha/sent?phone=${this.data.phone}`).then(res => {
      console.log(res)
      if (res.data.code === 200) {
        wx.showToast({
          title: '短信已发送',
        })
        this.setData({
          getCodeLock: true
        })
      }
    }).catch(err => {
      console.log(err)
      if (err.status === 400) {
        wx.showToast({
          title: "手机号码不规范",
          icon: 'none'
        })
      }
    })
  },
  verifyCode() {
    if (this.data.getCodeLock) {
      app.globalData.fly.get(`/captcha/verify?phone=${this.data.phone}&captcha=${this.data.code}`).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.setData({
            lock: true
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  goLogin() {
    wx.navigateTo({
      url: "/pages/login/login"
    })
  },
  // queryMultipleNodes() {
  //   const query = wx.createSelectorQuery()
  //   query.selectAll('.input').boundingClientRect()
  //   query.exec((res) => {
  //     // console.log(res)
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.queryMultipleNodes()
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