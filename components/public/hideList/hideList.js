// components/public/hideList/hideList.js
Component({
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
    // console.log(this.data.list)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    editOrder(){

    },
    onClose(){
      this.triggerEvent('myevent', false) 
    }
  }
})
