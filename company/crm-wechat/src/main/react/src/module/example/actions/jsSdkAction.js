/**
 * @author Administrator
 * @date 2018/3/24
 */
import $ from 'jquery'

export function initJsSdk() {
    const currentUrl = encodeURIComponent(window.location.href.split('#')[0]);
    const url = '/wxapi/getJSSDKConfig?url='+currentUrl;
    window.jsonFetch(
        url,
        {},
        config => {
            configJsSdk(config)
        }
    );
}

function configJsSdk(config) {
    window.wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.appId, // 必填，公众号的唯一标识
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.nonceStr, // 必填，生成签名的随机串
        signature: config.signature,// 必填，签名
        jsApiList: [//必填，需要使用的JS接口列表,用到哪个就填哪个
            'checkJsApi',            // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
            'onMenuShareTimeline',        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            'onMenuShareAppMessage',        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            'onMenuShareQQ',        // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
            'onMenuShareWeibo',        // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            'onMenuShareQZone',        // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
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
        ]
    });

    window.wx.ready(function () {
        alert('window.wx.ready');
        // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
        document.querySelector('#checkJsApi').onclick = function () {
            window.wx.checkJsApi({
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'onVoicePlayEnd',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ],
                success: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        };

        // 2. 分享接口
        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        document.querySelector('#onMenuShareAppMessage').onclick = function () {
            window.wx.onMenuShareAppMessage({
                title: '互联网之子',
                desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
                link: 'http://v.etaoyao.com/#/example1',
                imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                trigger: function (res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    alert('用户点击发送给朋友');
                },
                success: function (res) {
                    alert('已分享');
                },
                cancel: function (res) {
                    alert('已取消');
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
            alert('已注册获取“发送给朋友”状态事件');
        };

        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        document.querySelector('#onMenuShareTimeline').onclick = function () {
            window.wx.onMenuShareTimeline({
                title: '互联网之子',
                link: 'http://v.etaoyao.com/#/example1',
                imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                trigger: function (res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                    alert('已分享');
                },
                cancel: function (res) {
                    alert('已取消');
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
            alert('已注册获取“分享到朋友圈”状态事件');
        };

        // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        document.querySelector('#onMenuShareQQ').onclick = function () {
            window.wx.onMenuShareQQ({
                title: '互联网之子',
                desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
                link: 'http://v.etaoyao.com/#/example1',
                imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
                trigger: function (res) {
                    alert('用户点击分享到QQ');
                },
                complete: function (res) {
                    alert(JSON.stringify(res));
                },
                success: function (res) {
                    alert('已分享');
                },
                cancel: function (res) {
                    alert('已取消');
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
            alert('已注册获取“分享到 QQ”状态事件');
        };

        // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
        document.querySelector('#onMenuShareWeibo').onclick = function () {
            window.wx.onMenuShareWeibo({
                title: '互联网之子',
                desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
                link: 'http://v.etaoyao.com/#/example1',
                imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
                trigger: function (res) {
                    alert('用户点击分享到微博');
                },
                complete: function (res) {
                    alert(JSON.stringify(res));
                },
                success: function (res) {
                    alert('已分享');
                },
                cancel: function (res) {
                    alert('已取消');
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
            alert('已注册获取“分享到微博”状态事件');
        };

        // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
        document.querySelector('#onMenuShareQZone').onclick = function () {
            window.wx.onMenuShareQZone({
                title: '互联网之子',
                desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
                link: 'http://v.etaoyao.com/#/example1',
                imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
                trigger: function (res) {
                    alert('用户点击分享到QZone');
                },
                complete: function (res) {
                    alert(JSON.stringify(res));
                },
                success: function (res) {
                    alert('已分享');
                },
                cancel: function (res) {
                    alert('已取消');
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
            alert('已注册获取“分享到QZone”状态事件');
        };


        // 3 智能接口
        var voice = {
            localId: '',
            serverId: ''
        };
        // 3.1 识别音频并返回识别结果
        document.querySelector('#translateVoice').onclick = function () {
            if (!voice.localId) {
                alert('请先使用 startRecord 接口录制一段声音');
                return;
            }
            window.wx.translateVoice({
                localId: voice.localId,
                complete: function (res) {
                    if (res.hasOwnProperty('translateResult')) {
                        alert('识别结果：' + res.translateResult);
                    } else {
                        alert('无法识别');
                    }
                }
            });
        };

        // 4 音频接口
        // 4.2 开始录音
        document.querySelector('#startRecord').onclick = function () {
            window.wx.startRecord({
                cancel: function () {
                    alert('用户拒绝授权录音');
                }
            });
        };

        // 4.3 停止录音
        document.querySelector('#stopRecord').onclick = function () {
            window.wx.stopRecord({
                success: function (res) {
                    voice.localId = res.localId;
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        };

        // 4.4 监听录音自动停止
        window.wx.onVoiceRecordEnd({
            complete: function (res) {
                voice.localId = res.localId;
                alert('录音时间已超过一分钟');
            }
        });

        // 4.5 播放音频
        document.querySelector('#playVoice').onclick = function () {
            if (!voice.localId) {
                alert('请先使用 startRecord 接口录制一段声音');
                return;
            }
            window.wx.playVoice({
                localId: voice.localId
            });
        };

        // 4.6 暂停播放音频
        document.querySelector('#pauseVoice').onclick = function () {
            window.wx.pauseVoice({
                localId: voice.localId
            });
        };

        // 4.7 停止播放音频
        document.querySelector('#stopVoice').onclick = function () {
            window.wx.stopVoice({
                localId: voice.localId
            });
        };

        // 4.8 监听录音播放停止
        window.wx.onVoicePlayEnd({
            complete: function (res) {
                alert('录音（' + res.localId + '）播放结束');
            }
        });

        // 4.8 上传语音
        document.querySelector('#uploadVoice').onclick = function () {
            if (!voice.localId) {
                alert('请先使用 startRecord 接口录制一段声音');
                return;
            }
            window.wx.uploadVoice({
                localId: voice.localId,
                success: function (res) {
                    alert('上传语音成功，serverId 为' + res.serverId);
                    voice.serverId = res.serverId;
                }
            });
        };

        // 4.9 下载语音
        document.querySelector('#downloadVoice').onclick = function () {
            if (!voice.serverId) {
                alert('请先使用 uploadVoice 上传声音');
                return;
            }
            window.wx.downloadVoice({
                serverId: voice.serverId,
                success: function (res) {
                    alert('下载语音成功，localId 为' + res.localId);
                    voice.localId = res.localId;
                }
            });
        };

        // 5 图片接口
        // 5.1 拍照、本地选图
        var images = {
            localId: [],
            serverId: []
        };
        document.querySelector('#chooseImage').onclick = function () {
            window.wx.chooseImage({
                success: function (res) {
                    images.localId = res.localIds;
                    alert('已选择 ' + res.localIds.length + ' 张图片');
                }
            });
        };

        // 5.2 图片预览
        document.querySelector('#previewImage').onclick = function () {
            window.wx.previewImage({
                current: 'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
                urls: [
                    'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg',
                    'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
                    'http://img3.douban.com/view/photo/photo/public/p2152134700.jpg'
                ]
            });
        };

        // 5.3 上传图片
        document.querySelector('#uploadImage').onclick = function () {
            if (images.localId.length === 0) {
                alert('请先使用 chooseImage 接口选择图片');
                return;
            }
            var i = 0, length = images.localId.length;
            images.serverId = [];

            function upload() {
                window.wx.uploadImage({
                    localId: images.localId[i],
                    success: function (res) {
                        i++;
                        //alert('已上传：' + i + '/' + length);
                        images.serverId.push(res.serverId);
                        if (i < length) {
                            upload();
                        }
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            }

            upload();
        };

        // 5.4 下载图片
        document.querySelector('#downloadImage').onclick = function () {
            if (images.serverId.length === 0) {
                alert('请先使用 uploadImage 上传图片');
                return;
            }
            var i = 0, length = images.serverId.length;
            images.localId = [];

            function download() {
                window.wx.downloadImage({
                    serverId: images.serverId[i],
                    success: function (res) {
                        i++;
                        alert('已下载：' + i + '/' + length);
                        images.localId.push(res.localId);
                        if (i < length) {
                            download();
                        }
                    }
                });
            }

            download();
        };

        // 6 设备信息接口
        // 6.1 获取当前网络状态
        document.querySelector('#getNetworkType').onclick = function () {
            window.wx.getNetworkType({
                success: function (res) {
                    alert(res.networkType);
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        };

        // 7 地理位置接口
        // 7.1 查看地理位置
        document.querySelector('#openLocation').onclick = function () {
            window.wx.openLocation({
                latitude: 23.099994,
                longitude: 113.324520,
                name: 'TIT 创意园',
                address: '广州市海珠区新港中路 397 号',
                scale: 14,
                infoUrl: 'http://weixin.qq.com'
            });
        };

        // 7.2 获取当前地理位置
        document.querySelector('#getLocation').onclick = function () {
            window.wx.getLocation({
                type: 'gcj02',
                success: function (res) {
                    alert(JSON.stringify(res));
                },
                cancel: function (res) {
                    alert('用户拒绝授权获取地理位置');
                }
            });
        };

        // 8 界面操作接口
        // 8.1 隐藏右上角菜单
        document.querySelector('#hideOptionMenu').onclick = function () {
            window.wx.hideOptionMenu();
        };

        // 8.2 显示右上角菜单
        document.querySelector('#showOptionMenu').onclick = function () {
            window.wx.showOptionMenu();
        };

        // 8.3 批量隐藏菜单项
        document.querySelector('#hideMenuItems').onclick = function () {
            window.wx.hideMenuItems({
                menuList: [
                    'menuItem:readMode', // 阅读模式
                    'menuItem:share:timeline', // 分享到朋友圈
                    'menuItem:copyUrl' // 复制链接
                ],
                success: function (res) {
                    alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        };

        // 8.4 批量显示菜单项
        document.querySelector('#showMenuItems').onclick = function () {
            window.wx.showMenuItems({
                menuList: [
                    'menuItem:readMode', // 阅读模式
                    'menuItem:share:timeline', // 分享到朋友圈
                    'menuItem:copyUrl' // 复制链接
                ],
                success: function (res) {
                    alert('已显示“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        };

        // 8.5 隐藏所有非基本菜单项
        document.querySelector('#hideAllNonBaseMenuItem').onclick = function () {
            window.wx.hideAllNonBaseMenuItem({
                success: function () {
                    alert('已隐藏所有非基本菜单项');
                }
            });
        };

        // 8.6 显示所有被隐藏的非基本菜单项
        document.querySelector('#showAllNonBaseMenuItem').onclick = function () {
            window.wx.showAllNonBaseMenuItem({
                success: function () {
                    alert('已显示所有非基本菜单项');
                }
            });
        };

        // 8.7 关闭当前窗口
        document.querySelector('#closeWindow').onclick = function () {
            window.wx.closeWindow();
        };

        // 9 微信原生接口
        // 9.1.1 扫描二维码并返回结果
        document.querySelector('#scanQRCode0').onclick = function () {
            window.wx.scanQRCode();
        };
        // 9.1.2 扫描二维码并返回结果
        document.querySelector('#scanQRCode1').onclick = function () {
            window.wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        };

        // 10 微信支付接口
        // 10.1 发起一个支付请求
        document.querySelector('#chooseWXPay').onclick = function () {
            // 注意：此 Demo 使用 2.7 版本支付接口实现，建议使用此接口时参考微信支付相关最新文档。
            window.wx.chooseWXPay({
                timestamp: 1414723227,
                nonceStr: 'noncestr',
                package: 'addition=action_id%3dgaby1234%26limit_pay%3d&bank_type=WX&body=innertest&fee_type=1&input_charset=GBK&notify_url=http%3A%2F%2F120.204.206.246%2Fcgi-bin%2Fmmsupport-bin%2Fnotifypay&out_trade_no=1414723227818375338&partner=1900000109&spbill_create_ip=127.0.0.1&total_fee=1&sign=432B647FE95C7BF73BCD177CEECBEF8D',
                signType: 'SHA1', // 注意：新版支付接口使用 MD5 加密
                paySign: 'bd5b1933cda6e9548862944836a9b52e8c9a2b69'
            });
        };

        // 11.3  跳转微信商品页
        document.querySelector('#openProductSpecificView').onclick = function () {
            window.wx.openProductSpecificView({
                productId: 'pDF3iY_m2M7EQ5EKKKWd95kAxfNw',
                extInfo: '123'
            });
        };

        // 12 微信卡券接口
        // 12.1 添加卡券
        document.querySelector('#addCard').onclick = function () {
            window.wx.addCard({
                cardList: [
                    {
                        cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                        cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"f6628bf94d8e56d56bfa6598e798d5bad54892e5"}'
                    },
                    {
                        cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                        cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"f6628bf94d8e56d56bfa6598e798d5bad54892e5"}'
                    }
                ],
                success: function (res) {
                    alert('已添加卡券：' + JSON.stringify(res.cardList));
                },
                cancel: function (res) {
                    alert(JSON.stringify(res))
                }
            });
        };

        var codes = [];
        // 12.2 选择卡券
        document.querySelector('#chooseCard').onclick = function () {
            window.wx.chooseCard({
                cardSign: '1fdb2640c60e41f8823e9f762e70c531d161ae76',
                timestamp: 1437997723,
                nonceStr: 'k0hGdSXKZEj3Min5',
                success: function (res) {
                    res.cardList = JSON.parse(res.cardList);
                    let encrypt_code = res.cardList[0]['encrypt_code'];
                    alert('已选择卡券：' + JSON.stringify(res.cardList));
                    decryptCode(encrypt_code, function (code) {
                        codes.push(code);
                    });
                },
                cancel: function (res) {
                    alert(JSON.stringify(res))
                }
            });
        };

        // 12.3 查看卡券
        document.querySelector('#openCard').onclick = function () {
            if (codes.length < 1) {
                alert('请先使用 chooseCard 接口选择卡券。');
                return false;
            }
            var cardList = [];
            for (var i = 0; i < codes.length; i++) {
                cardList.push({
                    cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                    code: codes[i]
                });
            }
            window.wx.openCard({
                cardList: cardList,
                cancel: function (res) {
                    alert(JSON.stringify(res))
                }
            });
        };

        var shareData = {
            title: '微信JS-SDK Demo',
            desc: '微信JS-SDK,帮助第三方为用户提供更优质的移动web服务',
            link: 'http://demo.open.weixin.qq.com/jssdk/',
            imgUrl: 'http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRt8Qia4lv7k3M9J1SKqKCImxJCt7j9rHYicKDI45jRPBxdzdyREWnk0ia0N5TMnMfth7SdxtzMvVgXg/0'
        };
        window.wx.onMenuShareAppMessage(shareData);
        window.wx.onMenuShareTimeline(shareData);

        function decryptCode(code, callback) {
            $.getJSON('/jssdk/decrypt_code.php?code=' + encodeURI(code), function (res) {
                if (res.errcode === 0) {
                    codes.push(res.code);
                }
            });
        }
    });

    window.wx.error(function (res) {
        alert('wx.error');
        alert(res.errMsg);
    });
}
