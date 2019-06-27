const util = require('../../../../utils/util.js');
Page({

  /**
   * 初始数据
   */
  data: {
    orderId: '',
    content: [],
    show: false,
    showAlertView: false
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    let self = this;
    const orderObj = wx.getStorageSync("orderObj");
    self.setData({
      content: orderObj,

    })
  },

  sellerMark: function (e) {
    const self = this;
    let isshow = !this.data.show;
    this.setData({
      showAlertView: true,
      show: isshow
    })
  },
  opreateMedchine: function (e) {
    const self = this;
    util.showModal(null, "确定完成包装吗？", () => {
      util.doRequest({
        url: 'prescriptionOrder/prescriptionOrderPacking',
        data: {
          "packRemark": this.data.packRemark,//商家备注
          "prescriptionOrderId": this.data.content.prescriptionOrderId //订单id
        },
        method: 'GET'
      }, res => {
        /**
         * 更新上一页的数据
         */
        let pages = getCurrentPages();

        if (pages.length > 1) {
          //上一个页面实例对象
          let prePage = pages[pages.length - 2];
          prePage.returnData(2)
        }
        wx.navigateBack();//返回上一页
        util.showToast("成功 完成包装!");
      })
    }, null);
  },
   endInput: function (e) {
    this.setData({
      showAlertView: false,
      show: false
    })
  },
 
  

  inputChange: function (e) {
    this.setData({
      packRemark: e.detail.value
    });
  },
})
