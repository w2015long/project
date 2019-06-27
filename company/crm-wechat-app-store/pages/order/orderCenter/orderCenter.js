// pages/order/orderCenter/orderCenter.js
const util = require('../../../utils/util.js');
Page({

    data: {
        showInput: false,
        showSearchList: false,
        orderStateCounts: {
            unpaidCounts: 0,
            sendCounts: 0,
            waitSendCounts: 0,
            allocateCounts: 0,
            decoctionCounts: 0,
            packingCounts: 0,
            prescriptWaitSendCounts: 0,
            jdOrderCounts: 0,
            aliOrderCounts: 0,
            yesterdayCounts: 0,
            todayCounts: 0
        }
    },

    startSearch: function (e) {
      util.privateNavigateTo("../orderCenterSearch/orderCenterSearch?param="+e.detail.value);
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const self = this;
        util.doRequest({url: "order/center"}, res => {
            self.setData({orderStateCounts: res.data});
        })
    }
});