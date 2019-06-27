const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResult: [],
    param:'',
    blank:" ",
    skipUrl:'' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    const searchParam = options.param;
    self.setData({ param: searchParam});
    util.doRequest({
      url: "order/centerSearch",
      data: {
        searchFields: searchParam
      }
    }, res => {
      this.setData({searchResult: res.data});
    })
  },

  doSearch: function (e) {
    util.doRequest({
      url: "order/centerSearch",
      data: {
        searchFields: e.detail.value
      }
    }, res => {
      this.setData({searchResult: res.data});
    })
  }

  
});