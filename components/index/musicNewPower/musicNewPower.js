// components/index/musicNewPower/musicNewPower.js
import create from '../../../utils/create'
import store from '../../../store/index'
const app = getApp()
create.Component(store,{
  /**
   * 组件的属性列表
   */
  properties: {
    musicNewPower:{
      type:Array,
      value:()=>[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    songlock: false, //判断歌曲是否已在歌单
    songIndex: null, //判断歌曲是所在位置
    id: null
  },
  ready() {
    if (wx.getStorageSync("songlist")) {
      this.data.id = wx.getStorageSync("songlist")[wx.getStorageSync("index")].id
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    play(e) {
      this.data.songlock = false
      app.globalData.fly.get(`/song/detail?ids=${e.currentTarget.dataset.item.id}`).then(res => {
        if (res.data.code === 200) {
          if (this.store.data.singlist) {
            this.store.data.singlist.map((item, index) => {
              if (item.id === e.currentTarget.dataset.item.id) {
                this.data.songlock = true
                this.data.songIndex = index
              }
            })
            if (this.data.songlock) {
              wx.setStorageSync("index", this.data.songIndex)
              this.store.data.index = this.data.songIndex
            } else {
              this.store.data.singlist.splice(this.store.data.index, 0, res.data.songs[0])
              wx.setStorageSync("songlist", this.store.data.singlist)
            }
          } else {
            this.store.data.singlist = res.data.songs
            this.store.data.index = 0
            wx.setStorageSync("songlist", res.data.songs)
            wx.setStorageSync("index", 0)
          }
          if (this.data.id === e.currentTarget.dataset.item.id) {
            wx.navigateTo({
              url: `/pages/song/song`
            })
          } else {
            this.setData({
              id: e.currentTarget.dataset.item.id
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
  }
})
