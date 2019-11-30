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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    order: "1",
    // list: null,
    // songIndex: null,
    showlist:null,
    value: 25,
    all: null,
    now: null,
    dataUrl: null,
    pauseLock: false,
    backgroundAudio: null,
    gradientColor: {
      '0%': '#a80006',
      '100%': '#f81e06'
    }
  },
  ready() {
    this.setData({
      order: wx.getStorageSync("order")
    })
    this.getData(),
    console.log(this.data.songIndex)
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
      console.log(this.data.showlist)
      // console.log(this.data.songIndex)
    }
  },
  changeSong() {

  },
  editOrder(e) {
    this.setData({
      order: e.currentTarget.dataset.item
    })
    wx.setStorageSync("order", e.currentTarget.dataset.item)
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
    if (this.data.backgroundAudio) {
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
        progress: this.data.backgroundAudio.currentTime / this.data.backgroundAudio.duration * 100
      })
      if (this.data.all === this.data.now) {
        if (this.data.order === "3") {
          this.getdata(this.data.songlist[this.data.index].id)
        } else {
          this.nextSong()
        }
      }
    })
  },
})