Page({

  /**
   * 组件的初始数据
   */
  data: {
    commodity: "",                          
  },
  /**
    * 页面加载设置当前状态
    */
  onLoad: function (options) {
    const self = this;
    self.setData({
      commodity: wx.getStorageSync("commodity"),
    })
    wx.removeStorageSync("commodity");
  },
  formSubmit: function (e) {
    const notes = e.detail.value.notes;
    const usageAndDosage = e.detail.value.usageAndDosage;
    const self = this;
    const commodity = self.data.commodity;//上一页的商品数据
    self.setData({
      ['commodity.notes']: notes,
      ['commodity.usageAndDosage']: usageAndDosage,
    });

    /**
         * 更新上一页的数据
         */
    let pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      let prePage = pages[pages.length - 2];
      prePage.commodityRefresh(commodity);
      wx.navigateBack();
    }
  },
  
})