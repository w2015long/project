// pages/article/article.js
var {articles} = require('../../data/db.js')
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

    /*
    this.setData({articles:articles},function(){
      console.log('in',this.data)
    }.bind(this));
    console.log('out' ,this.data);
    */

    this.setData({ articles: articles})
    //console.log('article:onLoad')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log('article:onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log('article:onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //console.log('article:onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //console.log('article:onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //console.log('article:onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //console.log('article:onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    //console.log('article:onShareAppMessage')
  },
  // 跳转到详情页
  tapArticleItem: function (ev) {
    // console.log(ev.currentTarget)
    var articleId = ev.currentTarget.dataset.articleId;
    // console.log(articleId)
    wx.navigateTo({
      url: './article-detail/article-detail?articleId=' + articleId,
    })
   
  }  
})