const app = getApp();
const util = require('../../../../utils/util.js');

Page({
	data: {
        winHeight: app.globalData.windowHeight,
        winWidth: app.globalData.windowWidth,

		jdOrderDetails : {},
        orderBuyerPayableMoneyDouble:0,
        orderReceivableFreightDouble:0,
        orderDiscountMoneyDouble:0,
        platformPointsDeductionMoneyDouble:0,
        productPrice:0
	},

    onLoad: function (options) {
        let self = this;
        self.getSearchParmas(options.jdO2oOrderId);
    },

    /**
     * 获取筛选的查询参数
     */
    getSearchParmas: function (jdO2oOrderId) {
        let self = this;
        util.doRequest({
            url: "jdO2oOrder/findJdOrderDetail",
            data: { "jdO2oOrderId": jdO2oOrderId }
        },res=>{
            let orderBuyerPayableMoneyDouble = res.data.orderBuyerPayableMoneyDouble === null ? 0.00 : res.data.orderBuyerPayableMoneyDouble.toFixed(2);
            let orderReceivableFreightDouble = res.data.orderReceivableFreightDouble === null ? 0.00 : res.data.orderReceivableFreightDouble.toFixed(2);
            let orderDiscountMoneyDouble = res.data.orderDiscountMoneyDouble === null ? 0.00 : res.data.orderDiscountMoneyDouble.toFixed(2);
            let productPrice = res.data.productPrice === null ? 0.00 : res.data.productPrice.toFixed(2);
            let platformPointsDeductionMoneyDouble = res.platformPointsDeductionMoneyDouble ===null?0.00: res.data.productPrice.toFixed(2);
            self.setData({
                jdOrderDetails: res.data,
                orderBuyerPayableMoneyDouble: orderBuyerPayableMoneyDouble,
                orderReceivableFreightDouble: orderReceivableFreightDouble,
                orderDiscountMoneyDouble: orderDiscountMoneyDouble,
                platformPointsDeductionMoneyDouble:platformPointsDeductionMoneyDouble,
                productPrice:productPrice
            })
        })
    },
});
