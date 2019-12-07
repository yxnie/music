// components/index/foot/foot.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
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
    goDj(e){
      // console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: `/pages/djProgram/djProgram?id=${e.currentTarget.dataset.id}&rid=${e.currentTarget.dataset.rid}`
      })
    }
  }
})
