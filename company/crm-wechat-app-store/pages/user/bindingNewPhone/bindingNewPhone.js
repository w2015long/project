const commonReg = require('../../../utils/commonReg.js');
const util = require('../../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        second: 120,
        sendState:"notSend",// 未发送 ,其他状态sending:发送中,hadSended;已发送
        isShowPhoneWrongTip: false,
        isShowVerificationCodeWrongTip: false
    },

    /**
     * 绑定号码
     */
    bindingMobile: function () {
        const self = this;
        if (!self.checkMobile()) {
            self.setData({isShowPhoneWrongTip: true});
            return;
        }
        let phoneReg = new RegExp(commonReg.REG_MOBILE_PHONE);
        if (!phoneReg.exec(self.data.mobile)) {
            self.setData({isShowPhoneWrongTip: true});
            return;
        }
        if (!self.data.sendVerificationCode) {
            self.setData({isShowVerificationCodeWrongTip: true});
            return;
        }

        util.doRequest(
            {
                url: "user/bindingUserNewMobile?mobile=" + self.data.mobile + "&validateCode=" + self.data.sendVerificationCode,
                method: "POST"
            }, (res) => {
                util.showToast("更改成功成功");
                wx.redirectTo({url: '../setting/setting'})
            })
    },

    /**
     * 检查手机
     * @returns {boolean}
     */
    checkMobile: function () {
        const self = this;
        if (!self.data.mobile) {
            self.setData({isShowPhoneWrongTip: true});
            return false;
        }
        return true;
    },

    /**
     * 发送验证码
     */
    sendVerificationCode: function () {
        const self = this;
        if (!self.checkMobile()) {
            self.setData({isShowPhoneWrongTip: true});
            return;
        }
        let phoneReg = new RegExp(commonReg.REG_MOBILE_PHONE);
        if (!phoneReg.exec(self.data.mobile)) {
            self.setData({isShowPhoneWrongTip: true});
            return;
        }
        util.doRequest({
                url: "user/login/sendValidateCodeForNewMobile?mobile=" + self.data.mobile
            }, res => {
                this.setData({
                    sendState: "sending",
                    sendVerificationCode: "",
                    second: res.data
                });
                util.showToast("验证码发送成功");
            },
             );
        this.timer();
    },
    //定时
    timer: function () {
        let promise = new Promise((resolve, reject) => {
            let setTimer = setInterval(
                () => {
                    this.setData({
                        second: this.data.second - 1
                    });
                    if (this.data.second <= 0) {
                        this.setData({
                            second: 10,
                            sendState: "hadSended",
                        });
                        resolve(setTimer)
                    }
                }
                , 1000)
        });
        promise.then((setTimer) => {
            clearInterval(setTimer)
        })
    },
    /**
     * 手机号码获得焦点时清除错误
     */
    hideWrongPhoneTip: function () {
        this.setData({isShowPhoneWrongTip: false});
    },

    /**
     * 更新手机号码输入框的值
     * @param e
     */
    updateMoibleValue: function (e) {
        const self = this;
        self.setData({mobile: e.detail.value})
    },

    /**
     * 更新验证码的值
     */
    updateVerificationCodeValue: function (e) {
        const self = this;
        self.setData({sendVerificationCode: e.detail.value,isShowPhoneWrongTip: false,isShowVerificationCodeWrongTip:false})
        console.log( e.detail.value);
    }


});