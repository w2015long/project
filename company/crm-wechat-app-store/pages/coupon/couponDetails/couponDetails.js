const util = require('../../../utils/util.js');
Page({

  data: {
    currentTab: "support", // support 支持，nonsupport 不支持
    checkedType: 'all',
    coupon: [],
    curClass: '', // 页面滚动
    supportProduct: "", // 仅支持商品
    nonsupportProduct: "", // 不支持商品
    supportProductNum: 0,
    nonsupportProductNum: 0,
  },


  /**
   * 切换tab
   */
  clicktab: function(e) {
    const self = this;
    this.setData({
      currentTab: e.target.dataset.idx,
    })
  },

  /**
   *  页面滚动
   */
  onPageScroll(e) {
    console.log(e.scrollTop)
    console.log(this.data.curClass)
    if (e.scrollTop >= 250 && !this.data.curClass) {
      this.setData({
        curClass: 'item_fix'
      })
    } else if (e.scrollTop <= 250 && this.data.curClass) {
      this.setData({
        curClass: ''
      })
    }
  },

  /**
   * 请求后台数据
   */
  loadCouponDetailsData: function(couponId) {
    const self = this;
    util.doRequest({
      url: 'coupon/findCouponDetails?couponId=' + couponId,
      method: 'GET',
    }, (res) => {
      let data = res.data;
      let sup = "";
      let non = "";
      let supNum = 0;
      let nonNum = 0;
      if (data.applyProductType == 'SPECIFIED_PRODUCTS') {
        sup = "仅支持商品（" + data.protocolList.length + ")";
        non = "不支持商品（0）";
        supNum = data.protocolList.length;
      } else if (data.applyProductType == 'EXCLUDE_PRODUCTS') {
        sup = "仅支持商品（0）";
        non = "不支持商品（" + data.protocolList.length + ")"
        nonNum = data.protocolList.length;
      }

      self.setData({
        coupon: data,
        supportProduct: sup,
        nonsupportProduct: non,
        supportProductNum: supNum,
        nonsupportProductNum: nonNum,
      })

    }, (fail) => {
      wx.showModal({
        title: "温馨提示",
        content: fail.data.errMsg,
        showCancel: false,
        confirmText:"返回",
        success:function(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1,
            })
          } 
        }
      });
    })
  },

  /**
   * 初始化页面
   */
  onLoad: function(e) {
    const self = this;
    self.loadCouponDetailsData(e.couponId);
  }
})