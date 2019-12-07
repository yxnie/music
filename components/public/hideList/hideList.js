// components/public/hideList/hideList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    },
    order: {
      type: String,
      value: "1",
    },
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    order:"1",
    list:null,
    songIndex:null
  },
  ready() {
    this.setData({
      list: wx.getStorageSync("songlist"),
      songIndex: wx.getStorageSync("index"),
      order: wx.getStorageSync("order")
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    editOrder(e){
      console.log(e.currentTarget.dataset.item)
      this.setData({
        order: e.currentTarget.dataset.item
      })
      wx.setStorageSync("order", e.currentTarget.dataset.item)
      this.triggerEvent('editorder', e.currentTarget.dataset.item) 
    },
    onClose(){
      this.triggerEvent('myevent', false) 
    },
    checkOne(e){
      this.setData({
        songIndex: e.currentTarget.dataset.index
      })
      wx.setStorageSync("index", e.currentTarget.dataset.index)
    },
    delterOne(){
      this.data.list.splice(e.currentTarget.dataset.index,1)
      this.setData({
        list: this.data.list
      })
      wx.setStorageSync("songlist", this.data.list)
    },
    collectAll(){

    },
    delterAll(){
      wx.removeStorageSync("songlist")
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
          all: this.data.backgroundAudio.duration,
          now: this.data.backgroundAudio.currentTime,
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
  }
})
