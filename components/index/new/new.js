// components/index/new/new.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    newDisc: [],
    newSong: null,
    lock: true,
    songlock: false, //判断歌曲是否已在歌单
    songIndex: null //判断歌曲是所在位置
  },
  ready() {
    this.getData()
    this.getNewSong()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goSonglist(e) {
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: `/pages/albumDetail/albumDetail?id=${e.currentTarget.dataset.id}`
      })
    },
    play(e) {
      this.data.songlock = false
      if (wx.getStorageSync("songlist")) {
        let arr = wx.getStorageSync("songlist")
        console.log(e.currentTarget.dataset.item.id)
        arr.map((item, index) => {
          if (item.id === e.currentTarget.dataset.item.id) {
            this.data.songlock = true
            this.data.songIndex = index
          }
        })
        console.log(this.data.songlock, this.data.songIndex)
        if (this.data.songlock) {
          wx.setStorageSync("index", this.data.songIndex)
        } else {
          let index = wx.getStorageSync("index")
          arr.splice(index,0, e.currentTarget.dataset.item)
          // arr.unshift(e.currentTarget.dataset.item)
          console.log(arr)
          wx.setStorageSync("songlist", arr)
          wx.setStorageSync("index", index)
        }
      } else {
        wx.setStorageSync("songlist", e.currentTarget.dataset.item)
        wx.setStorageSync("index", 0)
      }
      wx.navigateTo({
        url: `/pages/song/song`
      })
    },
    getData() {
      app.globalData.fly.get("/album/newest").then(res => {
        // console.log(res, 1)
        if (res.data.code === 200) {
          this.setData({
            newDisc: res.data.albums.slice(0, 6),
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getNewSong() {
      app.globalData.fly.get("/top/song?type=0").then(res => {
        // console.log(res)
        if (res.data.code === 200) {
          this.setData({
            newSong: res.data.data.slice(0, 6),
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkDisc() {
      this.setData({
        lock: true
      })
    },
    checkSong() {
      if (!this.data.newSong) {
        this.getNewSong()
      }
      this.setData({
        lock: false
      })
    }
  },
})