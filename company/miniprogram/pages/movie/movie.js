// pages/movie/movie.js

import { getMovie} from '../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var baseUrl = app.GLOBAL_DATA.baseUrl;
    var hotUrl = baseUrl + 'v2/movie/in_theaters?start=0&count=3';
    var comingUrl = baseUrl + 'v2/movie/coming_soon?start=0&count=3';
    var top250Url = baseUrl + 'v2/movie/top250?start=0&count=3';
    getMovie(hotUrl, function (data){
        this.setData({
          hotData: data,
          hotTag:'正在热映',
          hotType:'hot'
        })
    }.bind(this));
    
    getMovie(comingUrl, function (data) {
      this.setData({
        comingData: data,
        comingTag: '即将上映',
        comingType:'coming'
      })
    }.bind(this));  
    getMovie(top250Url, function (data) {
      this.setData({
        top250Data: data,
        top250Tag:'豆瓣Top250',
        top250Type:'top250'
      }) 
    }.bind(this));      
  },
  bandleMore: function(ev){
    // console.log(ev.currentTarget.dataset.type);
    var type = ev.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/movie/movie-more/movie-more?type=' + type,
    })
  }
})