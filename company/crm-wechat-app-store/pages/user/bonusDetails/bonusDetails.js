const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userAccountTransLog : {},  //员工账户交易记录
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //店员奖金账单 与 门店奖金账单 是分别两张表 所以这里区分两个入口，后台接口也不一样，单页面使用的字段需要维护成一致
        if(options.bounsDetails === 'bounsDetails'){//店员奖金账单详情
            this.loadDounsDetailsData(options.transLogId);
        }else if(options.bounsDetails === 'shopBonusPool'){//门店奖金账单详情
            this.loadShopBonusPoolData(options.shopAccountTransLogId);
        }

    },


    /**
     * 店员奖金账单详情
     */
    loadDounsDetailsData: function (transLogId) {
        const self = this;
        util.doRequest({
            url: 'myBonus/findOneBillingDetails?transLogId='+transLogId,
            method: 'GET',
        }, res => {
            let userAccountTransLog = res.data;
            userAccountTransLog.amountDouble = userAccountTransLog.amountDouble.toFixed(2);
            userAccountTransLog.afterAmountDouble = userAccountTransLog.afterAmountDouble.toFixed(2);
            self.setData({
                userAccountTransLog : userAccountTransLog
            });
            console.log(self.data.userAccountTransLog);
        })

    },


    /**
     * 门店奖金账单详情
     */
    loadShopBonusPoolData: function (shopAccountTransLogId) {
        const self = this;
        util.doRequest({
            url: 'shop/findOneShopBonusPoolDetails?shopAccountTransLogId='+shopAccountTransLogId,
            method: 'GET',
        }, res => {
            let userAccountTransLog = res.data;
            userAccountTransLog.amountDouble = userAccountTransLog.amountDouble.toFixed(2);
            userAccountTransLog.afterAmountDouble = userAccountTransLog.afterAmountDouble.toFixed(2);
            self.setData({
                userAccountTransLog : userAccountTransLog
            });
            console.log(self.data.userAccountTransLog);
        })

    },




});