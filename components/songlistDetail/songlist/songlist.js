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
  /**
   * 组件的方法列表
   */
  methods: {
    play(e){
      // console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.index)
      wx.setStorageSync('songlist', this.data.data.playlist.tracks)
      wx.setStorageSync('index', e.currentTarget.dataset.index)
      this.triggerEvent('editIndex', e.currentTarget.dataset.index) 
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
