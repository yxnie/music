// components/index/banner/banner.js
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
    imgUrls: [],
    indicatorDots: true,//导航点
    autoplay: true,
    circular: true, //衔接滑动
    interval: 5000,
    duration: 1000,
  },
  ready(){
    this.getData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getData(){
      app.globalData.fly.get("/banner?type=2").then(res => {
        this.setData({
          imgUrls:res.data.banners
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
})
