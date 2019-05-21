// pages/movie-more/movie-more.js
var {getMovie} = require('../../..//utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl:'',
    totalCount:0,
    totalData:[],
    isEnd:false
  },
  handleGetMovie:function(data){
    wx.hideNavigationBarLoading();
    if(data.length == 0) {
      wx.showToast({
        title: '我是有底线的',
      })
      this.data.isEnd = true;
      return
    }
    
    this.data.totalCount += data.length;
    this.data.totalData = this.data.totalData.concat(data);
    this.setData({
      movies: this.data.totalData 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    var baseUrl = app.GLOBAL_DATA.baseUrl;
    var requestUrl = '';
    var title = '';
    switch(type){
      case 'hot':
        requestUrl = baseUrl + 'v2/movie/in_theaters';
        title = '正在热映';
        break
      case 'coming':
        requestUrl = baseUrl + 'v2/movie/coming_soon';
        title = '即将上映';
        break
      case 'top250':
        requestUrl = baseUrl + 'v2/movie/top250';
        title = 'top250';
        break
       default:
        break              
    }

    this.data.requestUrl = requestUrl;

    wx.setNavigationBarTitle({
      title: title,
    });

    getMovie(this.data.requestUrl,this.handleGetMovie);
  },

 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var _this = this;
    wx.showNavigationBarLoading();
    getMovie(this.data.requestUrl, function (data) {
      _this.setData({
        movies: data
      },function(){
        wx.hideNavigationBarLoading();
      });
      
    });    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.isEnd){
      wx.showToast({
        title: '我是有底线的',
      });
      return
    }
    wx.showNavigationBarLoading()
    var nextUrl = this.data.requestUrl + '?start='+ this.data.totalCount + '&count=20';
    getMovie(nextUrl, this.handleGetMovie);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})