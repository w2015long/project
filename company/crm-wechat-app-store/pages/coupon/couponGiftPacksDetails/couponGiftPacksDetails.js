const util = require('../../../utils/util.js');
Page({
  data: {
    isShow: false,
    showBtn: false,
    packsData: [],
    codeWebUrl: "", // 二维码网络url
    sharePacksUrl: "", // 分享优惠券礼包的路径
    couponGiftPacksId: null, // 优惠券礼包Id
  },

  /**
   * 跳转到优惠券支持/不支持页面
   */
  findCouponProduct: function(e) {
    const self = this;
    let couponId = e.target.dataset.couponId;
    wx.navigateTo({
      url: '../couponDetails/couponDetails?couponId=' + couponId,
    })
  },

  /**
   * 打开派发弹窗
   */
  showPoppus: function() {
    util.doRequest({
      url: 'couponGiftPacks/findByShareCouponGiftPacks?couponGiftPacksId=' + this.data.couponGiftPacksId,
      method: 'GET',
    }, (res) => {
      this.setData({
        shareCouponUrl: res.data,
        isShow: true,
      })
    });

  },
  /**
   * 关闭派发弹窗
   */
  hiddenPopus: function() {
    this.setData({
      isShow: false,
    })
  },

  /**
   * 生成二维码
   */
  generateCode: function() {
    const self = this;

    util.doRequest({
      url: 'wxapi/getTemporaryQRCode?sceneStr=' + self.data.couponGiftPacksId,
      method: 'GET',
    }, (res) => {
      self.setData({
        codeWebUrl: res.data,
        showBtn: true,
      })
    })
  },

  /**
   *  复制到剪贴板
   */
  copylink: function() {
    const self = this;
    wx.setClipboardData({
      data: self.data.shareCouponUrl,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            self.setData({
              isShow: false
            }, () => {
              util.showToast("链接复制成功");
            })
          }
        })
      }
    })
  },

  /**
   * 关闭二维码弹窗
   */
  closeBtn: function() {
    this.setData({
      showBtn: false,
    })
  },


  /**
   * 加载优惠券礼包详情
   */
  loadGiftPacksName: function(couponGiftPacksId) {
    const self = this;
    util.doRequest({
      url: 'couponGiftPacks/findCouponGiftPacksDetails?couponGiftPacksId=' + couponGiftPacksId,
      method: 'GET',
    }, res => {
      self.setData({
        packsData: res.data,
        couponGiftPacksId: couponGiftPacksId,
      })
    }, fail => {
      wx.showToast({
        title: fail.data.errMsg,
        icon: 'none',
        duration: 1000
      });
      setTimeout(() => {
        wx.redirectTo({
          url: "../couponSendStamps/couponSendStamps",
        })
      }, 1500)

    })
  },


  onLoad: function(e) {
    const self = this;
    self.loadGiftPacksName(e.couponGiftPacksId);
  }

})