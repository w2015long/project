/**
 * @author chencheng
 * @date 2018/3/29
 * 微信jssdk
 * 备注:此处返回异常会影响体验
 * dataMap={key:value}
 */


export function initJsSdk(readyCallback, errCallback, dataMap = {}) {
    const currentUrl = encodeURIComponent(window.location.href.split('#')[0]);
    const url = '/wxapi/getJSSDKConfig?url=' + currentUrl;
    window.jsonFetch(
        url,
        {},
        config => {
            configJsSdk(config, readyCallback, errCallback, dataMap)
        },
        err => {
            if (typeof errCallback === "function") {
                errCallback(err);
                return false;
            }
            return false;
        }
    );
}

function configJsSdk(config, readyCallback, errCallback, dataMap) {

    window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.appId, // 必填，公众号的唯一标识
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.nonceStr, // 必填，生成签名的随机串
        signature: config.signature,// 必填，签名
        jsApiList: [//必填，需要使用的JS接口列表,用到哪个就填哪个
            'checkJsApi',            // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
            'onMenuShareTimeline',        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口 -- 即将废弃
            'onMenuShareAppMessage',        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口 -- 即将废弃
            'onMenuShareQQ',        // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口 -- 即将废弃
            'onMenuShareWeibo',        // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            'onMenuShareQZone',        // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口 -- 即将废弃
            'translateVoice',        // 3.1 识别音频并返回识别结果
            'startRecord',        // 4.2 开始录音
            'stopRecord',        // 4.3 停止录音
            'onVoiceRecordEnd',        // 4.4 监听录音自动停止
            'playVoice',        // 4.5 播放音频
            'onVoicePlayEnd',        // 4.8 监听录音播放停止
            'pauseVoice',        // 4.6 暂停播放音频
            'stopVoice',        // 4.7 停止播放音频
            'uploadVoice',        // 4.8 上传语音
            'downloadVoice',        // 4.9 下载语音
            'chooseImage',        // 5.1 拍照、本地选图
            'previewImage',        // 5.2 图片预览
            'uploadImage',        // 5.3 上传图片
            'downloadImage',        // 5.4 下载图片
            'getNetworkType',        // 6.1 获取当前网络状态
            'openLocation',        // 7.1 查看地理位置
            'getLocation',        // 7.2 获取当前地理位置
            'hideOptionMenu',        // 8.1 隐藏右上角菜单
            'showOptionMenu',        // 8.2 显示右上角菜单
            'hideMenuItems',        // 8.3 批量隐藏菜单项
            'showMenuItems',        // 8.4 批量显示菜单项
            'hideAllNonBaseMenuItem',        // 8.5 隐藏所有非基本菜单项
            'showAllNonBaseMenuItem',        // 8.6 显示所有被隐藏的非基本菜单项
            'closeWindow',        // 8.7 关闭当前窗口
            'scanQRCode',        // 9 扫描二维码
            'chooseWXPay',        // 10.1 发起一个支付请求
            'openProductSpecificView',        // 11.3  跳转微信商品页
            'addCard',        // 12.1 添加卡券
            'chooseCard',        // 12.2 选择卡券
            'openCard'        // 12.3 查看卡券
            // 'updateAppMessageShareData', // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
            // 'updateTimelineShareData' // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
        ]
    });

    window.wx.ready(function () {
        console.log("wx.ready");
        if (typeof readyCallback === "function") {
            readyCallback();
        }
        console.log(dataMap);
        //自定义“分享给朋友”
        if (dataMap.onMenuShareAppMessage) {
            console.log("分享给朋友");
            window.wx.onMenuShareAppMessage({
                title: dataMap.title, // 分享标题
                desc: dataMap.desc, // 分享描述
                link: dataMap.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: dataMap.imgUrl, // 分享图标
                success: function () {
                    // 设置成功
                    console.log("分享给朋友成功")
                }
            })
        }
        // 自定义“分享到朋友圈”
        if (dataMap.onMenuShareTimeline) {
            console.log("分享到朋友圈");
            window.wx.onMenuShareTimeline({
                title: dataMap.title, // 分享标题
                link: dataMap.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: dataMap.imgUrl, // 分享图标
                success: function () {
                    // 设置成功
                    console.log("分享到朋友圈成功")
                }
            })
        }
        // 自定义 扫一扫 该处用于69码
        if (dataMap.scanAnccCode) {
            console.log("扫一扫");
            window.wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr.split(",")[1]; // 当needResult 为 1 时，扫码返回的结果
                    dataMap.successFun(result);
                }
            })
        }
    });

    window.wx.error(function (res) {
        let showErr = true;
        if (typeof errCallback === "function") {
            if (false === errCallback(res)) {
                showErr = false;
            }
        }
        if (showErr) {
            window.errorAlert(res.errMsg)
        }
    });
}

/**
 * 发起微信支付
 * @param orderType 订单类型:NORMAL-微信订单、PRESCRIPTION-拍单购药
 * @param orderIds 订单ID列表，多个使用英文逗号分隔
 * @param successCallback 支付成功回调
 * @param failCallback 支付失败回调
 * @param cancelCallback 取消支付回调
 */
export function wxPay(orderType, orderIds, successCallback, failCallback, cancelCallback) {
    const url = '/wxpay/initPay?orderType=' + orderType + '&orderIds=' + orderIds;
    window.jsonFetch(
        url,
        {},
        json => {
            window.history.replaceState(null,null,"/#/");
            window.wx.chooseWXPay({
                timestamp: json.timeStamp,
                nonceStr: json.nonceStr,
                package: json.package,
                signType: json.signType,
                paySign: json.paySign,
                success: function (res) {
                    if (typeof successCallback === "function") {
                        successCallback(res);
                    }
                },
                cancel: function (res) {
                    if (typeof cancelCallback === "function") {
                        cancelCallback(res);
                    }
                },
                fail: function (res) {
                    if (typeof failCallback === "function") {
                        failCallback(res);
                    }
                }
            });
        },
        err =>{
            if (typeof failCallback === "function") {
                return failCallback(err);
            }
        }
    );
}



/**
 * 充值demo
 * @param  money 金额
 * @param successCallback 支付成功回调
 * @param failCallback 支付失败回调
 * @param cancelCallback 取消支付回调
 */
export function wxStoreValuePay(money,successCallback, failCallback, cancelCallback) {
    const url = '/wxpay/initStoreValuePay?money=' + money;
    window.jsonFetch(
        url,
        {},
        json => {
            window.history.replaceState(null,null,"/#/");
            window.wx.chooseWXPay({
                timestamp: json.timeStamp,
                nonceStr: json.nonceStr,
                package: json.package,
                signType: json.signType,
                paySign: json.paySign,
                success: function (res) {
                    if (typeof successCallback === "function") {
                        successCallback(res);
                    }
                },
                cancel: function (res) {
                    if (typeof cancelCallback === "function") {
                        cancelCallback(res);
                    }
                },
                fail: function (res) {
                    if (typeof failCallback === "function") {
                        failCallback(res);
                    }
                }
            });
        },
        err =>{
            if (typeof failCallback === "function") {
                return failCallback(err);
            }
        }
    );
}