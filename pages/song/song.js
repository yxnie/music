// pages/song/song.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    url:"",
    dataUrl:{},
    songlist: null,
    index: null,
    backgroundAudio: null,
    allTime: 0,
    nowTime: 0,
    progress: null,
    pauseLock: false,
    all: null,
    order:"1",
    now:null,
    show:false
  },
  editOrder(e){
    this.setData({
      order: e.currentTarget.dataset.item
    })
    wx.setStorageSync("order", e.currentTarget.dataset.item)
  },
  getdata(id) {
    app.globalData.fly.get(`/song/detail?ids=${id}`).then(res => {
      // console.log(res.data,1)
      if (res.data.code === 200) {
        this.setData({
          data: res.data,
        })
        this.getUrl(id)
      }
    }).catch(err => {
      console.log(err)
    })
    
  },
  getUrl(id){
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/song/url?id=${id}`).then(res => {
      // console.log(res.data,2)
      if (res.data.code === 200) {
        this.setData({
          dataUrl: res.data.data[0],
        })
        this.backgroundAudioManager()
        // console.log(this.data.dataUrl)
      }
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  lastSong() {
    if(this.data.order==="2"){
      this.data.index = Math.floor(Math.random() * this.data.songlist.length)
    }else {
      this.data.index--
      if (this.data.index < 0) {
        this.data.index = this.data.songlist.length - 1
      }
    }
    this.getdata(this.data.songlist[this.data.index].id)
    wx.setStorageSync("index", this.data.index)
  },
  nextSong() {
    if (this.data.order === "2") {
      this.data.index = Math.floor(Math.random() * this.data.songlist.length)
    }else {
      this.data.index++
      if (this.data.index > this.data.songlist.length - 1) {
        this.data.index = 0
      }
    }
    this.getdata(this.data.songlist[this.data.index].id)
    wx.setStorageSync("index", this.data.index)
  },
  onChange(event) {
    this.data.backgroundAudio.seek(event.detail / 100 * this.data.all)
    this.setData({
      progress: event.detail
    })
  },
  pause() {
    this.data.backgroundAudio.pause()
    this.setData({
      pauseLock: true
    })
  },
  play() {
    this.data.backgroundAudio.play()
    this.setData({
      pauseLock: false
    })
  },
  backgroundAudioManager() {
    if (this.data.backgroundAudio){
      this.data.backgroundAudio.stop()
    }
    let backgroundAudio = wx.getBackgroundAudioManager()
    backgroundAudio.src = this.data.dataUrl.url
    backgroundAudio.title = this.data.data.songs[0].name
    backgroundAudio.coverImgUrl = this.data.data.songs[0].al.picUrl
    this.setData({
      backgroundAudio,
    })
    this.data.backgroundAudio.onTimeUpdate(() => {
      this.setData({
        all: this.data.backgroundAudio.duration,
        now: this.data.backgroundAudio.currentTime,
        nowTime: this.editTime(this.data.backgroundAudio.currentTime),
        allTime: this.editTime(this.data.backgroundAudio.duration),
        progress: this.data.backgroundAudio.currentTime / this.data.backgroundAudio.duration * 100
      })
      if (this.data.all === this.data.now){
        if (this.data.order === "3"){
          this.getdata(this.data.songlist[this.data.index].id)
        }else {
          this.nextSong()
        }
      }
    })
  },
  editShow(e){
    console.log(e)
    this.setData({
      show: e.detail.val
    })
  },
  openShow(){
    this.setData({
      show: true
    })
  },
  editTime(time) {
    let t = Math.round(time)
    if (t / 60 < 10) {
      if (t % 60 > 10) {
        return `0${Math.floor(t / 60)} : ${t % 60}`
      } else {
        return `0${Math.floor(t / 60)} : 0${t % 60}`
      }
    } else {
      if (t % 60 > 10) {
        return `${Math.floor(t / 60)} : ${t % 60}`
      } else {
        return `${Math.floor(t / 60)} : 0${t % 60}`
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      songlist: wx.getStorageSync("songlist"),
      index: wx.getStorageSync("index")
    })
    console.log(this.data.songlist, this.data.index)
    this.getdata(this.data.songlist[this.data.index].id)
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