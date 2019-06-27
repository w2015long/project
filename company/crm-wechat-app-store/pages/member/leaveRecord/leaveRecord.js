const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reasonsArray: [""],
        index: 0,
        reasonsList: [],
        isDeal: "Y"
    },

    onLoad: function (option) {
        this.setData({customerVisitRecordId: option.customerVisitRecordId});
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        const self = this;
        util.doRequest({url: "member/transactionFailedCause"}, res => {
            self.setData({reasonsList: res.data});
            if (self.data.reasonsList.length > 0) {
                let reasons = [];
                self.data.reasonsList.map((reason, index) => {
                    reasons.push(reason.transactionFailedCause);
                });
                self.setData({reasonsArray: reasons});
            }
        });
    },

    /**
     * 是否交易
     * @param e
     */
    switchChange: function (e) {
        this.setData({isDeal: e.detail.value ? "Y" : "N"});
    },

    /**
     * 交易失败原因
     * @param e
     */
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },

    /**
     * 表单提交
     */
    formSubmit: function (e) {
        const self = this;
        if (!e.detail.value.buyReason) {
            util.showToast("请填写购买目的", "none");
            return;
        }
        util.doRequest({
            url: "member/customerLeave",
            method: "POST",
            data: {
                isDeal: self.data.isDeal,
                visitCause: e.detail.value.buyReason,
                loseCause: self.data.isDeal === "Y" ? null : self.data.reasonsArray[self.data.index],
                customerVisitRecordId: self.data.customerVisitRecordId
            }
        }, res => {
            wx.switchTab({
                url: '/pages/member/visitRecord/visitRecord',
                success: function () {
                    util.showToast("记录成功");
                }
            })
        })
    }

});