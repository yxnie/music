// pages/song/song.js
import create from '../../utils/create'
import store from '../../store/index'
const app = getApp()
create.Page(store, {
  // 声明依赖
  use: ['singlist', 'index', 'order', 'play', 'all', 'allTime', 'nowTime','progress'], //也支持复杂路径依赖，比如 ['list[0].name']
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    url: "",
    dataUrl: {},
    backgroundAudio: null,
    all: null,
    allTime: 0,
    nowTime: 0,
    progress: null,
    now: null,
    show: false,
    djLock: false
  },
  getdata(id) {
    app.globalData.fly.get(`/song/detail?ids=${id}`).then(res => {
      // console.log(res.data,1)
      if (res.data.code === 200) {
        this.setData({
          data: res.data,
          djLock: false
        })
        this.getUrl(id)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getUrl(id) {
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
      }
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  lastSong() {
    if (this.store.data.order === "2") {
      this.store.data.index = Math.floor(Math.random() * this.store.data.singlist.length)
    } else {
      this.store.data.index--
        if (this.store.data.index < 0) {
          this.store.data.index = this.store.data.singlist.length - 1
        }
    }
    if (this.store.data.singlist[this.store.data.index].radio) {
      this.setData({
        data: this.store.data.singlist[this.store.data.index],
        djLock: true
      })
      this.getUrl(this.store.data.singlist[this.store.data.index].mainTrackId)
    } else {
      this.getdata(this.store.data.singlist[this.store.data.index].id)
    }
    wx.setStorageSync("index", this.store.data.index)
  },
  nextSong() {
    if (this.store.data.order === "2") {
      this.store.data.index = Math.floor(Math.random() * this.store.data.singlist.length)
    } else {
      this.store.data.index++
        if (this.store.data.index > this.store.data.singlist.length - 1) {
          this.store.data.index = 0
        }
    }
    if (this.store.data.singlist[this.store.data.index].radio) {
      this.setData({
        data: this.store.data.singlist[this.store.data.index],
        djLock: true
      })
      this.getUrl(this.store.data.singlist[this.store.data.index].mainTrackId)
    } else {
      this.getdata(this.store.data.singlist[this.store.data.index].id)
    }
    wx.setStorageSync("index", this.store.data.index)
  },
  onChange(event) {
    app.globalData.backgroundAudio.seek(event.detail / 100 * this.store.data.all)
    // this.store.data.progress = event.detail
    this.setData({
      progress: event.detail
    })
  },
  pause() {
    app.globalData.backgroundAudio.pause()
    this.store.data.play = false
  },
  play() {
    app.globalData.backgroundAudio.play()
    this.store.data.play = true
  },
  backgroundAudioManager() {
    if (app.globalData.backgroundAudio) {
      if (app.globalData.backgroundAudio.src === this.data.dataUrl.url) {} else {
        this.store.data.play = true
        app.globalData.backgroundAudio.stop()
        app.globalData.backgroundAudio.src = this.data.dataUrl.url
        app.globalData.backgroundAudio.title = this.store.data.singlist[this.store.data.index].name
        if (this.data.djLock) {
          app.globalData.backgroundAudio.coverImgUrl = this.store.data.singlist[this.store.data.index].coverUrl
        } else {
          app.globalData.backgroundAudio.coverImgUrl = this.store.data.singlist[this.store.data.index].al.picUrl
        }
      }
    } else {
      app.globalData.backgroundAudio.src = this.data.dataUrl.url
      app.globalData.backgroundAudio.title = this.store.data.singlist[this.store.data.index].name
      if (this.data.djLock) {
        app.globalData.backgroundAudio.coverImgUrl = this.store.data.singlist[this.store.data.index].coverUrl
      } else {
        app.globalData.backgroundAudio.coverImgUrl = this.store.data.singlist[this.store.data.index].al.picUrl
      }
      
    }
    app.globalData.backgroundAudio.onTimeUpdate(() => {
      // this.store.data.all = app.globalData.backgroundAudio.duration
      // this.store.data.nowTime = this.editTime(app.globalData.backgroundAudio.currentTime)
      // this.store.data.allTime = this.editTime(app.globalData.backgroundAudio.duration)
      // this.store.data.progress = app.globalData.backgroundAudio.currentTime / app.globalData.backgroundAudio.duration * 100
      this.setData({
      all : app.globalData.backgroundAudio.duration,
      nowTime : this.editTime(app.globalData.backgroundAudio.currentTime),
      allTime : this.editTime(app.globalData.backgroundAudio.duration),
      progress : app.globalData.backgroundAudio.currentTime / app.globalData.backgroundAudio.duration * 100
      })
    })
    app.globalData.backgroundAudio.onEnded(() => {
      if (this.data.order === "3") {
        if (this.data.djLock) {
          this.getUrl(this.store.data.singlist[this.store.data.index].mainTrackId)
        } else {
          this.getdata(this.store.data.singlist[this.store.data.index].id)
        }
      } else {
        this.nextSong()
      }
    })
  },
  editOrder(e) {
    this.store.data.order = e.currentTarget.dataset.item
    wx.setStorageSync("order", e.currentTarget.dataset.item)
  },
  editShow(e) {
    this.setData({
      show: e.detail.val
    })
  },
  openShow() {
    this.setData({
      show: true
    })
  },
  editTime(time) {
    let t = Math.round(time)
    if (t / 60 < 10) {
      if (t % 60 > 9) {
        return `0${Math.floor(t / 60)} : ${t % 60}`
      } else {
        return `0${Math.floor(t / 60)} : 0${t % 60}`
      }
    } else {
      if (t % 60 > 9) {
        return `${Math.floor(t / 60)} : ${t % 60}`
      } else {
        return `${Math.floor(t / 60)} : 0${t % 60}`
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!this.store.data.index) {
      this.store.data.index = wx.getStorageSync("index")
      this.store.data.singlist = wx.getStorageSync("songlist")
      this.store.data.order = wx.getStorageSync("order")
    }
    if (app.globalData.backgroundAudio) {
      this.setData({
        pauseLock: app.globalData.backgroundAudio.paused
      })
    }
    if (this.store.data.singlist[this.store.data.index].radio) {
      this.setData({
        data: this.store.data.singlist[this.store.data.index],
        djLock: true
      })
      this.getUrl(this.store.data.singlist[this.store.data.index].mainTrackId)
    } else {
      this.getdata(this.store.data.singlist[this.store.data.index].id)
    }
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