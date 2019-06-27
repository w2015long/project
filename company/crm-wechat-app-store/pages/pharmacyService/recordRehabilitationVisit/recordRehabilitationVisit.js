const util = require('../../../utils/util.js');
Page({
    data: {
        isShowModal: true,               //是否显示模态框
        estimateContent: '',            //输入框内容
        orderId: 0,                    //订单Id
        tabType: '',                   //用来记录上一页的tab类型
        orderInformation: []           //订单数据
    },

    /**
     * 页面加载时执行
     */
    onLoad: function (options) {
        const self = this;
        self.setData({
            tabType: options.tabType
        });
        self.loadData(options.orderId);
    },

    /**
     * 加载数据
     */
    loadData: function (orderId) {
        const self = this;
        util.doRequest({
            url: "rehabilitationVisit/recordRehabilitationVisit?orderId=" + orderId,
        }, res => {
            self.setData({
                orderId: orderId,
                orderInformation: res.data
            });
        });

    },

    /**
     * 联系客户
     */
    contactClient: function () {
        const self = this;
        wx.makePhoneCall({
            phoneNumber: self.data.orderInformation.mobile
        })
    },

    /**
     * 输入回访内容时触发
     */
    inputContent: function (element) {
        let self = this;
        self.setData({
            isShowModal: element.detail.value.length > 0 ? false : true,
            estimateContent: element.detail.value
        });
    },


    /**
     * 点击保存按钮触发
     */
    saveButtom: function () {
        const self = this;
        util.doRequest({
            url: "rehabilitationVisit/saveRehabilitationVisit",
            method: 'POST',
            data: {
                "orderId": self.data.orderId,
                "trackingContent": self.data.estimateContent
            },
        }, res => {
            wx.showModal({
                title: '记录成功',
                content: '药学记录回访成功',
                confirmText: '返回',
                showCancel: false,
                success: function () {
                    /**
                     * 更新上一页的数据
                     */
                    let pages = getCurrentPages();

                    if (pages.length > 1) {
                        //上一个页面实例对象
                        let prePage = pages[pages.length - 2];
                        prePage.returnData(self.data.tabType);
                    }
                    wx.navigateBack();//返回上一页
                }
            })
        });


    },


});