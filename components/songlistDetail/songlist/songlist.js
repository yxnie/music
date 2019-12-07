// components/songlistDetail/songlist/songlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: () => {}
    },
    songIndex: {
      type: Number,
      value: null,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    id:null
  },
  ready(){
    if (wx.getStorageSync('songlist')){
      this.setData({
        id: wx.getStorageSync('songlist')[wx.getStorageSync('index')].id
      })
    }
    // console.log(this.data.id)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    play(e){
      // console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.index)
      if (this.data.data.playlist){
        wx.setStorageSync('songlist', this.data.data.playlist.tracks)
      }
      if (this.data.data.songs){
        wx.setStorageSync('songlist', this.data.data.songs)
      }
      wx.setStorageSync('index', e.currentTarget.dataset.index)
      // this.triggerEvent('editIndex', e.currentTarget.dataset.index) 
      if (this.data.id === e.currentTarget.dataset.id){
        wx.navigateTo({
          url: `/pages/song/song`
        })
      }else {
        this.setData({
          id: e.currentTarget.dataset.id
        })
      }
    }
  }
})
