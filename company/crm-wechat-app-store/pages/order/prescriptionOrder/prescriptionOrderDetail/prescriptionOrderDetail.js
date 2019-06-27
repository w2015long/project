// pages/test/orders/pat-orders/pat-orderDetail.js
const app = getApp();
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        prescriptionOrder: {},
        items: [],
        orderLog: {},
        member: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const self = this;
        console.log(options);
        self.findPrescriptionOrderDetail(options.prescriptionOrderId);
    },

    findPrescriptionOrderDetail: function (prescriptionOrderId) {
        const self = this;
        util.doRequest({
            url: 'prescriptionOrder/findPrescriptionOrderDetail',
            data: {
                "prescriptionOrderId": prescriptionOrderId
            }
        }, res => {
            console.log(res);
            self.setData({
                items: res.data.prescriptionOrderItemProtocolList,
                orderLog: res.data.prescriptionOrderLogProtocol,
                member: res.data.xcxClerkMemberDetailProtocol,
                prescriptionOrder: res.data.xcxClerkPrescriptionOrderProtocol,
            });
        })
    },

    /**
     * 复制地址到剪切版
     */
    copyAddress: function (e) {
        var self = this;
        if (self.data.prescriptionOrder.receiverAddr) {
            wx.setClipboardData({
                data: self.data.prescriptionOrder.receiverAddr
            });
        }
    },

    /**
     * 拨打电话
     */
    makeCall: function () {
        const self = this;
        if (self.data.member.mobile) {
            wx.makePhoneCall({
                phoneNumber: self.data.member.mobile, //此号码并非真实电话号码，仅用于测试
                success: function () {
                    console.log("拨打电话成功！")
                },
                fail: function () {
                    console.log("拨打电话失败！")
                }
            })
        }
    },
});