const app = getApp();
const util = require('../../../utils/util.js');

Page({
  data: {
    winHeight: app.globalData.windowHeight,
    winWidth: app.globalData.windowWidth,

    aliOrderDetails: {},
    productAliPrice:0,
    deliveryPay:0,
    totalPay:0
  },

  onLoad: function (options) {
    let self = this;
    self.getSearchParmas(options.aliO2oOrderId);
  },

  /**
   * 获取筛选的查询参数
   */
  getSearchParmas: function (aliO2oOrderId) {
    let self = this;
    util.doRequest({
        url: "aliOrder/findAliOrderDetail",
        data: { "aliO2oOrderId": aliO2oOrderId }
    },res=>{
      let productAliPrice = res.data.productAliPrice === null ? 0.00 : res.data.productAliPrice.toFixed(2);
      let deliveryPay = res.data.deliveryPayDouble === null ? 0.00 : res.data.deliveryPayDouble.toFixed(2);
      let totalPay = res.data.totalPayDouble === null ? 0.00 : res.data.totalPayDouble.toFixed(2);
      self.setData({
          aliOrderDetails: res.data,
          productAliPrice: productAliPrice,
          deliveryPay: deliveryPay,
          totalPay: totalPay
      })
    })
  },
});
