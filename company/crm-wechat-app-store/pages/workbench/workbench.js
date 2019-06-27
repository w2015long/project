const util = require('../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        yesterdaySaleAmount: 0,
        yesterdayVisits: 0,
        balanceDouble: 0,
        assistantInfo: {
            iconFileId: "",
            realName: "",
            shopName: "",
            employeeCode: "",
          
        },
      userFild:'../../../media/images/default-img.png',
        weChatOrderNotShippedNumber : 0
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const self = this;
        util.doRequest({url: "user/findAssistantInfo"}, (res) => {
            self.setData(
              {assistantInfo: res.data,
                balanceDouble: res.data.balanceDouble.toFixed(2),
                  shopBalanceDouble : res.data.shopBalanceDouble.toFixed(2),
              },
              );
        });
       self.getShopWeChatOrderNotShippedNumber();
    },

    /**
     * 获取门店微订单的未发货的数量
     */
    getShopWeChatOrderNotShippedNumber :function(){
        const self = this;
        util.doRequest({url: "shop/getShopWeChatOrderNotShippedNumber"}, (res) => {
            self.setData({
                weChatOrderNotShippedNumber:res.data
                },
            );
        });
    },

    /**
     * 扫条形码
     */
    scanBarCode: function () {
        const self = this;
        wx.scanCode({
            success: (res) => {
                let barCode =  res.result;

                // 判断条形码前缀类型
                if(barCode.indexOf("CV") === 0){
                    //  跳转到优惠券核销页面
                    util.privateNavigateTo("/pages/coupon/couponVerification/couponVerification?couponCode=" +barCode);
                }else if(barCode.indexOf("CV") === -1){
                    // 后台查询并跳转到发货页面
                    util.doRequest({
                        url: "order/weChatOrdersSearchBySelfExtractNum",
                        data: {selfExtractNum: barCode}
                    }, data => {
                        if (data.data) {
                            util.privateNavigateTo("/pages/order/o2oOrder/o2oOrderSend/o2oOrderSend?orderId=" + data.data);
                        } else {
                            util.showConfirm("提示", "抱歉，门店下查无此待发货订单！");
                        }
                    })
                }
            }
        })
    }
});