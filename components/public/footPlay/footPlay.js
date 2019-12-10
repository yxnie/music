// components/public/footPlay/footPlay.js
import create from '../../../utils/create'
import store from '../../../store/index'
const app = getApp()
create.Component(store, {
  // 声明依赖
  use: ['singlist', 'index', 'order', 'play', 'all', 'allTime', 'nowTime', 'progress'], //也支持复杂路径依赖，比如 ['list[0].name']
  /**
   * 组件的属性列表
   */
  properties: {
  },
  // observers:{

  // },
  /**
   * 组件的初始数据
   */
  data: {
    value: 25,
    dataUrl: null,
    gradientColor: {
      '0%': '#a80006',
      '100%': '#f81e06'
    },
    show: false,
    djLock:false
  },
  ready() {
    if (!this.store.data.index) {
      this.store.data.index = wx.getStorageSync("index")
      this.store.data.singlist = wx.getStorageSync("songlist")
      this.store.data.order = wx.getStorageSync("order")
    }
    if (app.globalData.backgroundAudio){
      this.setData({
        play: app.globalData.backgroundAudio.paused
      })
    }
    if (this.store.data.singlist){
      if (this.store.data.singlist[this.store.data.index].radio) {
        this.setData({
          djLock: true
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    playSong() {
      this.store.data.play = !this.store.data.play
      if (this.store.data.play) {
        if (!this.store.data.backgroundAudio) {
          if (this.data.djLock) {
            this.getUrl(this.store.data.singlist[this.store.data.index].mainTrackId)
          } else {
            this.getUrl(this.store.data.singlist[this.store.data.index].id)
          }
        } else {
          app.globalData.backgroundAudio.play()
        }
      } else {
        app.globalData.backgroundAudio.pause()
      }
    },
    goSong() {
      wx.navigateTo({
        url: `/pages/song/song`
      })
    },
    changeSong(e) {
      this.store.data.index = e.detail.current
      wx.setStorageSync("index", e.detail.current)
      if (this.store.data.singlist[this.store.data.index].radio) {
        this.setData({
          djLock: true
        })
      }
      if (this.store.data.play){
        if (this.data.djLock){
          this.getUrl(this.store.data.singlist[this.store.data.index].mainTrackId)
        }else {
          this.getUrl(this.store.data.singlist[this.store.data.index].id)
        }
      }
    },
    editShow(e) {
      this.setData({
        show: e.detail
      })
    },
    openShow() {
      this.setData({
        show: true
      })
    },
    getUrl(id) {
      app.globalData.fly.get(`/song/url?id=${id}`).then(res => {
        // console.log(res.data,2)
        if (res.data.code === 200) {
          this.data.dataUrl = res.data.data[0]
          this.backgroundAudioManager()
        }
      }).catch(err => {
        console.log(err)
      })
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
          djLock: true
        })
        this.getUrl(this.store.data.singlist[this.store.data.index].mainTrackId)
      } else {
        this.getUrl(this.store.data.singlist[this.store.data.index].id)
      }
      wx.setStorageSync("index", this.store.data.index)
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
    backgroundAudioManager() {
      if (app.globalData.backgroundAudio) {
        if (app.globalData.backgroundAudio.src === this.data.dataUrl.url) { } else {
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
          progress: app.globalData.backgroundAudio.currentTime / app.globalData.backgroundAudio.duration * 100
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
  },
})