const util = require('../../../utils/util.js');
Page({
    data: {
        morning: '早上',
        afternoon: '中午',
        night: '晚上',
        times: null,
        selectTimeIndex: -1,
        show: false,
        showTime: false,
        beginDate: '2018-07-28',
        beginDateDay: '周一',
        endDate: '2017-08-18',
        endDateDay: '周一',
        time: '12:01',
        medicationReminder: {},
        remark: ""
    },

    /**
     * 页面加载设置当前状态
     */
    onLoad: function (options) {
        const self = this;
        let date = new Date();
        let dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        self.setData({
            beginDate: date.getFullYear() + '-' + (date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1).toString()) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()),
            endDate: date.getFullYear() + '-' + (date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1).toString()) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()),
            beginDateDay: dayNames[date.getDay()],
            endDateDay: dayNames[date.getDay()],
        });
        // 获取订单id
        self.findByOrderIdAndMemberId(options.orderId, options.memberId);
    },
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },
    bindMultiPickerChange: function (e) {
        this.setData({
            multiIndex: e.detail.value
        })
    },
    bindMultiPickerColumnChange: function (e) {
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };


    },
    bindDateChange: function (e) {
        let dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let daySelect = new Date(e.detail.value).getDay();
        if (e.currentTarget.dataset.pickid == 0) {

            let beginDateDay = dayNames[daySelect];
            this.setData({
                beginDate: e.detail.value,
                beginDateDay: beginDateDay
            })
        } else {
            let date1 = new Date(this.data.beginDate).getTime();
            let date2 = new Date(this.data.endDate).getTime();
            if (date1 > date2) {
                return;
            }
            let day = dayNames[daySelect];
            this.setData({
                endDate: e.detail.value,
                endDateDay: day
            })
        }

    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    selectDate: function (e) {
        let i = e.currentTarget.dataset.tag;

        this.setData({
            showTime: true,
            selectTimeIndex: i,
        })
    },
    bindTimeChange: function (e) {
        if (e.currentTarget.dataset.pid == 0) {
            this.setData({
                morning: e.detail.value
            })
        } else if (e.currentTarget.dataset.pid == 1) {
            this.setData({
                afternoon: e.detail.value
            })
        } else if (e.currentTarget.dataset.pid == 2) {
            this.setData({
                night: e.detail.value
            })
        }
    },
    resetTime: function () {
        this.setData({
            morning: '早上',
            afternoon: '中午',
            night: '晚上',
        })
    },
    remarkFun: function (e) {
        const self = this;
        self.setData({remark: e.detail.value})
    },
    senderPush: function () {
        const self = this;
        let morning = self.data.morning;
        let afternoon = self.data.afternoon;
        let night = self.data.night;
        if (morning === "早上" || afternoon === "中午" || night === "晚上") {
            util.showConfirm("提示", "请完善用药提醒时间!");
            return;
        }

        //推送保存
        const medicationReminder = self.data.medicationReminder;
        util.doRequest({
            url: "medicationReminder/addMedicationSubscribe",
            data: {
                "orderId": medicationReminder.orderId,
                "memberId": medicationReminder.memberId,
                "memberName": medicationReminder.memberName,
                "timeFrame": morning + "、" + afternoon + "、" + night,
                "beginDate": self.data.beginDate,
                "endDate": self.data.endDate,
                "remark": self.data.remark,
            },
            method: 'POST'
        }, res => {
            wx.showModal({
                title: '设置成功',
                content: '用药提醒推送成功',
                confirmText: '返回',
                success: function (res) {
                    wx.navigateTo({
                        url: '../medicationReminder/medicationReminder',
                    })
                }
            })
        });

    },
    findByOrderIdAndMemberId: function (orderId, memberId) {
        const self = this;
        util.doRequest({
            url: "medicationReminder/findByOrderIdAndMemberId",
            data: {
                "orderId": orderId,
                "memberId": memberId
            },
            method: 'GET'
        }, res => {
            const remark = '亲爱的' + res.data.memberName + '，以下是您购买药品的使用与禁忌说明，请注意合理的健康饮补充睡眠，祝您身体健康。';
            self.setData({medicationReminder: res.data, remark: remark})
        })
    }

});