0// pages/songlistDetail/songlistDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    image:"",
    songIndex:-2
  },
  editIndex(e){
    this.setData({
      songIndex: e.detail
    })
    // console.log(e.detail)
  },
  getdata(id) {
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/playlist/detail?id=${id}`).then(res => {
      console.log(res.data)
      if (res.data.code === 200) {
        if (res.data.playlist.subscribedCount > 100000000) {
          res.data.playlist.subscribedCount = (res.data.playlist.subscribedCount / 100000000).toFixed(2) + '亿'
        } else if (res.data.playlist.subscribedCount > 100000) {
          res.data.playlist.subscribedCount = Math.floor(res.data.playlist.subscribedCount / 1000) / 10 + '万'
        }
        this.setData({
          data: res.data,
          image: `url("${res.data.playlist.coverImgUrl}")`
        })
      }
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  back(){
    wx.navigateBack({
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options.id)
    this.getdata(options.id)
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