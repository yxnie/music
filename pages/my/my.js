// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:null,
    user:{},
    nickname:""
  },
  edit(){
    wx.navigateTo({
      url: "/pages/edit/edit"
    })
  },
  goLogin(){
    wx.navigateTo({
      url: "/pages/login/login"
    })
  },
  getInfo(){
    app.globalData.fly.get(`/user/detail?uid=${this.data.uid}`).then(res => {
      // console.log(res)
      if (res.status === 200) {
        this.setData({
          user: res.data
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  signIn(){
    app.globalData.fly.get(`/daily_signin`).then(res => {
      console.log(res, 1)
      // if (res.status === 200) {
      //   this.setData({
      //     user: res.data
      //   })
      // }
    }).catch(err => {
      console.log(err)
    })
  },
  logOut(){
    wx.navigateTo({
      url: "/pages/login/login"
    })
  },
  // getlist(){
    //   app.globalData.fly.get(`/user/playlist?uid=${this.data.id}`).then(res => {
    //     console.log(res.data,2)
    //     console.log(res.data.playlist[0].id, 2)
    //     if (res.data.code === 200) {
    //       this.getSong(res.data.playlist[0].id)
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    // getSong(id){
    //   app.globalData.fly.get(`/playlist/detail?id=${id}`).then(res => {
    //     console.log(res.data, 2)
    //     if (res.data.code === 200) {
    //       // this.setData({
    //       //   dataUrl: res.data.data[0],
    //       //   lock: true
    //       // })
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync("user").userPoint.userId)
    this.setData({
      uid: wx.getStorageSync("user").userPoint.userId,
      nickname: wx.getStorageSync("user").profile.nickname
    })
    this.getInfo()
    // this.getlist()
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