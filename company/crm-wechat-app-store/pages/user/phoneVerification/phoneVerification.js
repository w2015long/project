
const {MOBILE_IN_FOUR_NUM} = require('../../../utils/commonReg');
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sendState:"notSend",// 其他状态 sending:发送中,hadSended:已发送
        isAloudSubmit: false,
        second: 10,
        buttonType: 'default',
        phoneNum: '',
        validateCode: '',
        otherInfo: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            mobile: options.mobile,
            mobileLessFormat: options.mobile.replace(MOBILE_IN_FOUR_NUM, '$1****$2')
        })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    sendMsg: function () {
        const self = this;
        util.doRequest({
            url: "user/login/sendNormalValidateCode?mobile=" + self.data.mobile
        }, (successDada) => {
            util.showToast("验证码发送成功");
                this.setData({
                    sendState: "sending",
                    validateCode:"",
                    second:successDada.data
                });
        });
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

    // 验证码
    addCode: function (e) {
        this.setData({
            validateCode: e.detail.value
        });
        this.activeButton();
    },
    // 按钮 状态
    activeButton: function () {
        let {validateCode,mobile,sendState} = this.data;
        if (mobile && validateCode &&validateCode.length === 6 && sendState !=="notSend") {
            this.setData({
                isAloudSubmit: true,
            })
        } else {
            this.setData({
                isAloudSubmit: false,
            })
        }
    },

    /**
     * 提交手机验证码到后台
     */
    submitMobileCode: function () {
        const self = this;
        let {validateCode,mobile,sendState} = this.data;
        if (mobile && validateCode &&validateCode.length === 6 && sendState !=="notSend"){
            util.doRequest(
                {
                    url: "user/checkUserCurrentMobileByValidateCode?validateCode=" + validateCode.trim() ,
                    method: "POST"
                },
                (res) => {
                    util.showToast("验证成功");
                    wx.redirectTo({url: '../bindingNewPhone/bindingNewPhone'})
                },
                (res) => {
                    util.showToast("验证码错误","none");
                    this.setData({
                        isAloudSubmit: false,
                    })
                })
        }


    },
});