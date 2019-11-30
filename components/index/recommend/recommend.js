// components/index/recommend/recommend.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommend: {
      type: Array,
      value: () => []
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
    goSonglistDetail(e) {
      // console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: `/pages/songlistDetail/songlistDetail?id=${e.currentTarget.dataset.id}`
      })
    },
  }
})