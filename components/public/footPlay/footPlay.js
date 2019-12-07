// components/public/footPlay/footPlay.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: () => [],
    },
    songIndex: {
      type: Number,
      value: -2,
    },
  },
  // observers:{

  // },
  /**
   * 组件的初始数据
   */
  data: {
    showlist: null,
    value: 25,
    dataUrl: null,
    pauseLock: false,
    backgroundAudio: null,
    gradientColor: {
      '0%': '#a80006',
      '100%': '#f81e06'
    },
    show: false,
    play: false,
    songIndexs: null
  },
  ready() {
    this.setData({
      order: wx.getStorageSync("order")
    })
    this.getData()
    // console.log(this.data.songIndex)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getData() {
      this.setData({
        showlist: wx.getStorageSync("songlist"),
        songIndexs: wx.getStorageSync("index")
      })
      // console.log(this.data.showlist)
      // console.log(this.data.songIndex)
    },
    playSong() {
      this.data.play = !this.data.play
      this.setData({
        play: this.data.play
      })
      console.log(this.data.play)
      if (this.data.play) {
        console.log(2)
        if (!this.data.backgroundAudio) {
          if (this.data.songIndex > -1) {
            this.getUrl(this.data.list[this.data.songIndex].id)
          } else {
            this.getUrl(this.data.showlist[this.data.songIndexs].id)
          }
        } else {
          this.data.backgroundAudio.play()
        }
      } else {
        this.data.backgroundAudio.pause()
      }
    },
    goSong() {
      wx.navigateTo({
        url: `/pages/song/song`
      })
    },
    changeSong(e) {
      console.log(e.detail.current)
      if (this.data.play) {
        if (this.data.songIndex > -1) {
          this.setData({
            songIndex: e.detail.current
          })
          wx.setStorageSync("index", e.detail.current)
          wx.setStorageSync("songlist", this.data.list)
          this.getUrl(this.data.list[this.data.songIndex].id)
        } else {
          this.setData({
            songIndexs: e.detail.current
          })
          wx.setStorageSync("index", e.detail.current)
          this.getUrl(this.data.showlist[this.data.songIndexs].id)
        }
      }
    },
    editShow(e) {
      // console.log(e,1)
      this.setData({
        show: e.detail
      })
    },
    editorder(e) {
      // console.log(e,2)
      this.setData({
        order: e.detail
      })
    },
    editOrder(e) {
      this.setData({
        order: e.currentTarget.dataset.item
      })
      wx.setStorageSync("order", e.currentTarget.dataset.item)
    },
    openShow() {
      this.setData({
        show: true
      })
      console.log(this.data.show)
    },
    getUrl(id) {
      app.globalData.fly.get(`/song/url?id=${id}`).then(res => {
        // console.log(res.data,2)
        if (res.data.code === 200) {
          this.setData({
            dataUrl: res.data.data[0],
          })
          this.backgroundAudioManager()
          // console.log(this.data.dataUrl)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    nextSong() {
      if (this.data.songIndex > -1) {
        if (this.data.order === "2") {
          this.data.songIndex = Math.floor(Math.random() * this.data.list.length)
        } else {
          this.data.songIndex++
            if (this.data.songIndex > this.data.list.length - 1) {
              this.data.songIndex = 0
            }
        }
        this.getdata(this.data.list[this.data.songIndex].id)
        wx.setStorageSync("index", this.data.songIndex)
      } else {
        if (this.data.order === "2") {
          this.data.songIndexs = Math.floor(Math.random() * this.data.showlist.length)
        } else {
          this.data.songIndexs++
            if (this.data.songIndexs > this.data.showlist.length - 1) {
              this.data.songIndexs = 0
            }
        }
        this.getdata(this.data.showlist[this.data.songIndexs].id)
        wx.setStorageSync("index", this.data.songIndexs)
      }
    },
    backgroundAudioManager() {
      if (this.data.backgroundAudio) {
        this.data.backgroundAudio.stop()
      }
      let backgroundAudio = wx.getBackgroundAudioManager()
      backgroundAudio.src = this.data.dataUrl.url
      console.log()
      if (this.data.songIndex > -1) {
        backgroundAudio.title = this.data.list[this.data.songIndex].name
        backgroundAudio.coverImgUrl = this.data.list[this.data.songIndex].al.picUrl
      } else {
        backgroundAudio.title = this.data.showlist[this.data.songIndexs].name
        backgroundAudio.coverImgUrl = this.data.showlist[this.data.songIndexs].al.picUrl
      }

      this.setData({
        backgroundAudio,
      })
      this.data.backgroundAudio.onTimeUpdate(() => {
        this.setData({
          progress: this.data.backgroundAudio.currentTime / this.data.backgroundAudio.duration * 100
        })
      })
      this.data.backgroundAudio.onEnded(() => {
        if (this.data.order === "3") {
          if (this.data.songIndex > -1) {
            this.getUrl(this.data.list[this.data.songIndex].id)
          } else {
            this.getUrl(this.data.showlist[this.data.songIndexs].id)
          }
        } else {
          this.nextSong()
        }
      })
    },
  },
})