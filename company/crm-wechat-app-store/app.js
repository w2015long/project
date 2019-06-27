const util = require('utils/util.js');

App({
    /**
     * 小程序启动时
     */
    onLaunch: function () {
        let self = this;
        console.log("小程序启动，本地缓存的token：",wx.getStorageSync(util.token));
        self.getUserMsg();//设置用户信息
        self.getPhoneScreenSize();//获取屏幕尺寸
    },

    /**
     * 全局数据
     */
    globalData: {
        //用户信息
        userInfo: null,
        //手机屏幕高度
        windowHeight: null,
        //手机屏幕宽度
        windowWidth: null
    },

    /**
     * 获取手机屏幕尺寸参数
     */
    getPhoneScreenSize: function () {
        let self = this;
        wx.getSystemInfo({
            success: function (res) {
                self.globalData.windowHeight = res.windowHeight;
                self.globalData.windowWidth = res.windowWidth
            }
        });
        console.log(this.globalData);
    },
    
    /**
     * 设置用户信息
     */
    getUserMsg: function () {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo;

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
});