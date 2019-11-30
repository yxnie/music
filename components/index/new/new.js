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
    lock: true
  },
  ready() {
    this.getData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getData() {
      app.globalData.fly.get("/album/newest").then(res => {
        // console.log(res,1)
        if (res.data.code === 200) {
          this.setData({
            newDisc: res.data.albums.slice(0,6),
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getNewSong() {
      app.globalData.fly.get("/top/song?type=0").then(res => {
        if (res.data.code === 200) {
          this.setData({
            newSong: res.data.data.slice(0,6),
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