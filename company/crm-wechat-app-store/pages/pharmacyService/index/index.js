const util = require('../../../utils/util.js');
Page({
  data: {
    returnVisit: 0,                      //健康回访
    remind: 0,                           //用药提醒
    taboo: 0,                           //使用禁忌
  },
  /**
   * 页面加载设置当前状态
   */
  onLoad: function (options) {
    const self = this;
    self.loadData();
  },
  /**
       * 加载数据
       */
  loadData: function () {
    const self = this;
      util.doRequest({
        url: "pharmacyService/pharmacyServiceCounts",
        data: self.data.searchParam
      }, res => {
        self.setData({
          returnVisit: res.data.returnVisit,
          remind: res.data.remind,
          taboo: res.data.taboo
        });
      })
  },
})
