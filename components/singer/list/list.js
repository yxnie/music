// components/singer/list/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
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
    goSingerDetail(e){
      // console.log(e.currentTarget.dataset.item.id)
      wx.navigateTo({
        url: `/pages/singerDetail/singerDetail?id=${e.currentTarget.dataset.item.id}`
      })
    }
  }
})
