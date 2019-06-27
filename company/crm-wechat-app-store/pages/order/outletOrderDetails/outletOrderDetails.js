const util = require('../../../utils/util.js');
const app = getApp();
Page({
  data: {
    orderId: '',
    content: [],
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    const self = this;
    self.setData({
      orderId: options.orderId,
    })
    self.loadPageActivity(self.data.orderId);
  },
  /**
   * 加载
   */
  loadPageActivity: function (orderId) {
    let self = this;
    util.doRequest({
      url: "order/outletOrderDetails",
      method: "GET",
      data: {
        orderId: orderId
      }
    },
      (res) => {
        self.setData({
            content: res.data
        }, );
      });


  }, 

})
