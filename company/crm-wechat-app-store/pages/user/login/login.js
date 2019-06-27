const commonReg = require('../../../utils/commonReg.js');
const util = require('../../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isSendVerificationCode: false,
        isShowPhoneWrongTip: false,
        isShowVerificationCodeWrongTip: false,
        seconds:0,          //秒数
        initButtonTitle:'获取验证码',
        tempButtonTitle:'',
    },

    onLoad: function () {
        let self = this;
        self.setData({
            tempButtonTitle : self.data.initButtonTitle,
        });
    },

    /**
     * 登录
     */
    login: function () {
        const self = this;
        if (!self.checkMobile()) {
            self.setData({isShowPhoneWrongTip: true});
            return;
        }
        if (!self.data.sendVerificationCode) {
            self.setData({isShowVerificationCodeWrongTip: true});
            return;
        }

        wx.login({
            success: function (res) {
                if (res.code) {
                    util.doRequest(
                        {
                            url: "user/login?mobile=" + self.data.mobile + "&validateCode=" + self.data.sendVerificationCode + "&code=" + res.code,
                            method: "POST"
                        }, (res) => {
                            wx.setStorageSync(util.token, res.data);
                            wx.switchTab({
                                url: "../../workbench/workbench",
                                success:function () {
                                    util.showToast("登录成功");
                                }
                            });
                        },(res) => {
                            if(res.data.errCode === 'SMS_VALIDATE_ERROR'){
                                util.showToast("验证码错误！");
                            }
                        })
                }
            }
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

        if(self.data.tempButtonTitle != self.data.initButtonTitle){
            return;
        }

        let phoneReg = new RegExp(commonReg.REG_MOBILE_PHONE);
        if (!phoneReg.exec(self.data.mobile)) {
            self.setData({isShowPhoneWrongTip: true});
            return;
        }
        util.doRequest({
            url: "user/login/sendNormalValidateCode?mobile=" + self.data.mobile
        }, (res) => {
            self.setData({
                seconds: res.data == null ? 0 : res.data,
            },()=>{
                util.showToast("验证码发送成功");
                self.countdown();
            });
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
        self.setData({sendVerificationCode: e.detail.value})
    },
    /**
     * 发送短信验证码倒计时
     */
    countdown : function(){
        let self = this;
        let seconds = self.data.seconds;
        let setTimer = setInterval(()=>{
            let flag = seconds > 0;
            self.setData({
                seconds:flag ? --seconds : 0,
                isSendVerificationCode:flag,
                tempButtonTitle:flag ? '剩余'+ seconds +'秒' : self.data.initButtonTitle ,
            },()=>{
                if(!flag){
                    clearInterval(setTimer);
                }
            });
        },1000);
    },

});