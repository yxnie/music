const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommend:[],
    musicNewPower:[],
    djprogram:[],
    program:[]
  },
  //推荐歌单
  getData() {
    app.globalData.fly.get("/personalized?limit=6").then(res => {
      // console.log(res.data.result)
      if(res.data.code===200){
        res.data.result.map(item => {
          if (item.playCount>100000000){
            item.playCount = (item.playCount / 100000000).toFixed(2)+'亿'
          } else if (item.playCount > 10000) {
            item.playCount = Math.floor(item.playCount / 10000) + '万'
          }
        })
        this.setData({
          recommend: res.data.result
        })
      }
    }).catch(err => {
      console.log(err)
    })
    app.globalData.fly.get("/personalized/newsong").then(res => {
      // console.log(res.data.result)
      if (res.data.code === 200) {
        this.setData({
          musicNewPower: res.data.result.slice(0,6),
        })
      }
    }).catch(err => {
      console.log(err)
    })
    app.globalData.fly.get("/personalized/djprogram").then(res => {
      // console.log(res.data.result,1)
      if (res.data.code === 200) {
        this.setData({
          djprogram: res.data.result,
        })
      }
    }).catch(err => {
      console.log(err)
    })
    app.globalData.fly.get("/program/recommend").then(res => {
      // console.log(res.data.programs,2)
      if (res.data.code === 200) {
        this.setData({
          program: res.data.programs.slice(0, 6),
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})