// pages/singer/singer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:[
      { name: "入驻歌手", cat: "5001" },
      { name: "华语男歌手", cat: "1001" },
      { name: "华语女歌手", cat: "1002" },
      { name: "华语组合/乐队", cat: "1003" },
      { name: "欧美男歌手", cat: "2001" },
      { name: "欧美女歌手", cat: "2002" },
      { name: "欧美组合/乐队", cat: "2003" },
      { name: "日本男歌手", cat: "6001" },
      { name: "日本女歌手", cat: "6002" },
      { name: "日本组合/乐队", cat: "6003" },
      { name: "韩国男歌手", cat: "7001" },
      { name: "韩国女歌手", cat: "7002" },
      { name: "韩国组合/乐队", cat: "7003" },
      { name: "其他男歌手", cat: "4001" },
      { name: "其他女歌手", cat: "4002" },
      { name: "其他组合/乐队", cat: "4003" },
    ],
    active:0,
    alphabet: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    nowAlphabet:"",//小分类
    start: 0,//数据开始位置
    cat: "5001",//大分类
    list:[],//获取数据
    length:30,//获取条数
    limit:30//每页条数
  },
  onChange(e){
    // console.log(e,1)
    this.setData({
      cat: e.detail.name,
      nowAlphabet:"",
      list: [],
      start: 0,
    })
    // console.log(this.data.cat, 2)
    this.getData()
  },
  checkletter(e){
    this.setData({
      nowAlphabet: e.currentTarget.dataset.item,
      list: [],
      start: 0,
    })
    this.getData()
  },
  getData(){
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.fly.get(`/artist/list?cat=${this.data.cat}&initial=${this.data.nowAlphabet}&offset=${this.data.start}&limit=${this.data.limit}`).then(res => {
      // console.log(res,1)
      if (res.data.code === 200) {
        this.setData({
          list: this.data.list.concat(res.data.artists),
          length: res.data.artists.length
        })
      }
      // console.log(this.data.list, 1)
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
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
    if (this.data.length = this.data.limit) {
      this.setData({
        start: this.data.limit * 1 + this.data.start * 1
      })
      this.getData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})