// components/index/search/search.js
const app = getApp()
let util = require("../../../utils/util")
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
    hotList: [],
    inputValue: "",
    suggest: [],
    show: false,
    length: 30, //获取条数
    limit: 30, //每页条数
    start: 0, //数据开始位置
    keyword: "",
    type: 1018,
    bar: [{
        name: "综合",
        type: 1018,
        title: "",
        count: "count"
      },
      {
        name: "单曲",
        type: 1,
        title: "songs",
        count: "songCount"
      },
      {
        name: "视频",
        type: 1014,
        title: "videos",
        count: "videoCount"
      },
      {
        name: "歌手",
        type: 100,
        title: "artists",
        count: "artistCount"
      },
      {
        name: "专辑",
        type: 10,
        title: "albums",
        count: "albumCount"
      },
      {
        name: "歌单",
        type: 1000,
        title: "playlists",
        count: "playlistCount"
      },
      {
        name: "电台",
        type: 1009,
        title: "djRadios",
        count: "djRadioCount"
      },
      {
        name: "用户",
        type: 1002,
        title: "userprofiles",
        count: "userprofileCount"
      },
      {
        name: "MV",
        type: 1004,
        title: "mvs",
        count: "mvCount"
      }
    ],
    data: {},
    dataList:[],
    count:0,
    hotLock:true,
    nameId:null,
    history:[],
    errLock:true
  },
  ready() {
    if (wx.getStorageSync("user")) {
      this.data.nameId = `${
        wx.getStorageSync("user").userPoint.userId
        }.SearchHistory`;
    } else {
      this.data.nameId = "visitor.SearchHistory";
    }
    if (wx.getStorageSync(this.data.nameId)){
      this.setData({
        history:wx.getStorageSync(this.data.nameId)
      })
    }
    this.getData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    removeHistory(){
      this.setData({
        history: []
      })
      wx.removeStorageSync(this.data.nameId)
    },
    search(e) {
      // console.log(e.detail.value.trim())
      if (e.detail.value.trim()) {
        this.setData({
          inputValue: e.detail.value
        });
        app.globalData.fly.get(`/search/suggest?keywords=${e.detail.value.trim()}&type=mobile`).then(res => {
          if (res.data.result.allMatch) {
            this.setData({
              suggest: res.data.result.allMatch
            })
          }
          this.setData({
            show: true
          });
          // console.log(res.data.result)
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.setData({
          show: false
        });
      }
    },
    backHot(){
      this.setData({
        hotLock: true,
        inputValue:""
      });
    },
    back() {
      this.triggerEvent('editSearchLock', false)
    },
    checkType(e) {
      // console.log(e.currentTarget.dataset.type)
      this.setData({
        type: e.currentTarget.dataset.type,
        length: 30,
        start: 0,
        dataList: []
      });
      if (this.data.errLock){
        this.goSearch()
      }
    },
    scrollToLower() {
      if (this.data.length<this.data.count) {
        if (this.data.length === this.data.limit) {
          this.setData({
            start: this.data.limit * 1 + this.data.start * 1
          })
          this.goSearch()
        }
      }
    },
    goSearch() {
      wx.showLoading({
        title: '加载中',
      })
      if (this.data.inputValue===""){
        this.setData({
          inputValue:this.data.keyword
        })
      }
      if (this.data.history.indexOf(this.data.inputValue) < 0) {
        this.data.history.unshift(this.data.inputValue);
        wx.setStorageSync(this.data.nameId, this.data.history); //搜索历史存入storage
      } else {
        this.data.history.map((item, index) => {
          if (item === this.data.inputValue) {
            let one = this.data.history.splice(index, 1)
            this.data.history.splice(index, 1)
            this.data.history.unshift(one[0])
            wx.setStorageSync(this.data.nameId, this.data.history); //搜索历史存入storage
          }
        })
      }
      this.setData({
        show: false,
        hotLock: false,
        history: this.data.history,
        errLock: true
      });
      app.globalData.fly.get(`/search?keywords=${this.data.inputValue}&type=${this.data.type}&limit=${this.data.limit}&offset=${this.data.start}`).then(res => {
        if (this.data.type === 1018) {
          res.data.result.playList.playLists.map(item => {
            item.playCount = util.editCount(item.playCount)
          })
          res.data.result.video.videos.map(item => {
            item.durationms = util.editTime(item.durationms)
            item.playTime = util.editCount(item.playTime)
          })
          res.data.result.album.albums.map(item => {
            item.publishTime = util.myFormatTime(new Date(item.publishTime))
          })
          this.setData({
            data: res.data.result
          })
        }else {
          this.data.bar.map(item => {
            if (item.type === this.data.type) {
              if (this.data.type === 1014){
                res.data.result[item.title].map(item => {
                  item.durationms = util.editTime(item.durationms)
                  item.playTime = util.editCount(item.playTime)
                })
              }
              if (this.data.type === 1004) {
                res.data.result[item.title].map(item => {
                  item.durationms = util.editTime(item.duration)
                  item.playTime = util.editCount(item.playCount)
                })
              }
              if (this.data.type === 1000) {
                res.data.result[item.title].map(item => {
                  item.playCount = util.editCount(item.playCount)
                })
              }
              if (this.data.type === 10) {
                res.data.result[item.title].map(item => {
                  item.publishTime = util.myFormatTime(new Date(item.publishTime))
                })
              }
              this.setData({
                dataList: this.data.dataList.concat(res.data.result[item.title]),
                length: res.data.result[item.title].length,
                count: res.data.result[item.count]
              })
            }
          })
        }
        wx.hideLoading()
        // console.log(this.data.dataList)
        // console.log(res.data.result)
      }).catch(err => {
        wx.hideLoading()
        // console.log(err)
        this.setData({
          errLock: false
        })
      })
    },
    checkSuggest(e) {
      // console.log(e.currentTarget.dataset.item)
      this.setData({
        inputValue: e.currentTarget.dataset.item
      });
      this.goSearch()
    },
    onClickHide() {
      this.setData({
        show: false
      });
    },
    getData() {
      app.globalData.fly.get("/banner?type=2").then(res => {
        let imgUrl = Math.floor(Math.random() * res.data.banners.length)
        this.setData({
          imgUrl: res.data.banners[imgUrl]
        })
      }).catch(err => {
        console.log(err)
      })
      app.globalData.fly.get("/search/hot/detail").then(res => {
        this.setData({
          hotList: res.data.data
        })
        // console.log(res.data.data)
      }).catch(err => {
        console.log(err)
      })
      app.globalData.fly.get("/search/default").then(res => {
        this.setData({
          keyword: res.data.data.realkeyword
        })
        // console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
})