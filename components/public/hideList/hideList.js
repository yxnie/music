// components/public/hideList/hideList.js
import create from '../../../utils/create'
import store from '../../../store/index'
const app = getApp()
create.Component(store,{
  // 声明依赖
  use: ['singlist', 'index', 'order'], //也支持复杂路径依赖，比如 ['list[0].name']
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    editOrder(e){
      this.store.data.order = e.currentTarget.dataset.item
      wx.setStorageSync("order", e.currentTarget.dataset.item)
    },
    onClose(){
      this.triggerEvent('myevent', false) 
    },
    checkOne(e){
      this.store.data.index = e.currentTarget.dataset.index
      wx.setStorageSync("index", e.currentTarget.dataset.index)
      if (this.store.data.singlist[this.store.data.index].radio) {
        this.setData({
          djLock: true
        })
        this.getUrl(this.store.data.singlist[this.store.data.index].mainTrackId)
      } else {
        this.getUrl(this.store.data.singlist[this.store.data.index].id)
      }
    },
    delterOne(e){
      this.store.data.singlist.splice(e.currentTarget.dataset.index,1)
      wx.setStorageSync("songlist", this.store.data.singlist)
    },
    collectAll(){

    },
    delterAll(){
      wx.showModal({
        content: '确认要清空播放列表?',
        success:(res)=> {
          if (res.confirm) {
            this.triggerEvent('myevent', false) 
            this.store.data.singlist = []
            wx.removeStorageSync("songlist")
            wx.setStorageSync("index", 0)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
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
    backgroundAudioManager() {
      if (app.globalData.backgroundAudio) {
        app.globalData.backgroundAudio.stop()
      }
      app.globalData.backgroundAudio.src = this.data.dataUrl.url
      app.globalData.backgroundAudio.title = this.store.data.singlist[this.store.data.index].name
      if (this.data.djLock) {
        app.globalData.backgroundAudio.coverImgUrl = this.store.data.singlist[this.store.data.index].coverUrl
      } else {
        app.globalData.backgroundAudio.coverImgUrl = this.store.data.singlist[this.store.data.index].al.picUrl
      }
      app.globalData.backgroundAudio.onTimeUpdate(() => {
        this.setData({
          progress: Math.round(app.globalData.backgroundAudio.currentTime / app.globalData.backgroundAudio.duration * 100)
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
  }
})
