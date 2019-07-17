/**
 * @author chencheng
 * @date 2018/3/24
 * 微信jssdk示例
 */
import React, { Component } from 'react';
import '../style/JsSdk.css'
import {initJsSdk} from "../actions/jsSdkAction";

class JsSdk extends Component {

    componentDidMount() {
        initJsSdk();
    }

    render() {
        return (
            <div className='jssdk'>
                <div className="wxapi_container">
                    <div className="lbox_close wxapi_form">
                        <h3 id="menu-basic">基础接口</h3>
                        <span className="desc">判断当前客户端是否支持指定JS接口</span>
                        <button className="btn btn_primary" id="checkJsApi">checkJsApi</button>

                        <h3 id="menu-share">分享接口</h3>
                        <span className="desc">获取“分享到朋友圈”按钮点击状态及自定义分享内容接口</span>
                        <button className="btn btn_primary" id="onMenuShareTimeline">onMenuShareTimeline</button>
                        <span className="desc">获取“分享给朋友”按钮点击状态及自定义分享内容接口</span>
                        <button className="btn btn_primary" id="onMenuShareAppMessage">onMenuShareAppMessage</button>
                        <span className="desc">获取“分享到QQ”按钮点击状态及自定义分享内容接口</span>
                        <button className="btn btn_primary" id="onMenuShareQQ">onMenuShareQQ</button>
                        <span className="desc">获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口</span>
                        <button className="btn btn_primary" id="onMenuShareWeibo">onMenuShareWeibo</button>
                        <span className="desc">获取“分享到QZone”按钮点击状态及自定义分享内容接口</span>
                        <button className="btn btn_primary" id="onMenuShareQZone">onMenuShareQZone</button>

                        <h3 id="menu-image">图像接口</h3>
                        <span className="desc">拍照或从手机相册中选图接口</span>
                        <button className="btn btn_primary" id="chooseImage">chooseImage</button>
                        <span className="desc">预览图片接口</span>
                        <button className="btn btn_primary" id="previewImage">previewImage</button>
                        <span className="desc">上传图片接口</span>
                        <button className="btn btn_primary" id="uploadImage">uploadImage</button>
                        <span className="desc">下载图片接口</span>
                        <button className="btn btn_primary" id="downloadImage">downloadImage</button>

                        <h3 id="menu-voice">音频接口</h3>
                        <span className="desc">开始录音接口</span>
                        <button className="btn btn_primary" id="startRecord">startRecord</button>
                        <span className="desc">停止录音接口</span>
                        <button className="btn btn_primary" id="stopRecord">stopRecord</button>
                        <span className="desc">播放语音接口</span>
                        <button className="btn btn_primary" id="playVoice">playVoice</button>
                        <span className="desc">暂停播放接口</span>
                        <button className="btn btn_primary" id="pauseVoice">pauseVoice</button>
                        <span className="desc">停止播放接口</span>
                        <button className="btn btn_primary" id="stopVoice">stopVoice</button>
                        <span className="desc">上传语音接口</span>
                        <button className="btn btn_primary" id="uploadVoice">uploadVoice</button>
                        <span className="desc">下载语音接口</span>
                        <button className="btn btn_primary" id="downloadVoice">downloadVoice</button>

                        <h3 id="menu-smart">智能接口</h3>
                        <span className="desc">识别音频并返回识别结果接口</span>
                        <button className="btn btn_primary" id="translateVoice">translateVoice</button>

                        <h3 id="menu-device">设备信息接口</h3>
                        <span className="desc">获取网络状态接口</span>
                        <button className="btn btn_primary" id="getNetworkType">getNetworkType</button>

                        <h3 id="menu-location">地理位置接口</h3>
                        <span className="desc">使用微信内置地图查看位置接口</span>
                        <button className="btn btn_primary" id="openLocation">openLocation</button>
                        <span className="desc">获取地理位置接口</span>
                        <button className="btn btn_primary" id="getLocation">getLocation</button>

                        <h3 id="menu-webview">界面操作接口</h3>
                        <span className="desc">隐藏右上角菜单接口</span>
                        <button className="btn btn_primary" id="hideOptionMenu">hideOptionMenu</button>
                        <span className="desc">显示右上角菜单接口</span>
                        <button className="btn btn_primary" id="showOptionMenu">showOptionMenu</button>
                        <span className="desc">关闭当前网页窗口接口</span>
                        <button className="btn btn_primary" id="closeWindow">closeWindow</button>
                        <span className="desc">批量隐藏功能按钮接口</span>
                        <button className="btn btn_primary" id="hideMenuItems">hideMenuItems</button>
                        <span className="desc">批量显示功能按钮接口</span>
                        <button className="btn btn_primary" id="showMenuItems">showMenuItems</button>
                        <span className="desc">隐藏所有非基础按钮接口</span>
                        <button className="btn btn_primary" id="hideAllNonBaseMenuItem">hideAllNonBaseMenuItem</button>
                        <span className="desc">显示所有功能按钮接口</span>
                        <button className="btn btn_primary" id="showAllNonBaseMenuItem">showAllNonBaseMenuItem</button>

                        <h3 id="menu-scan">微信扫一扫</h3>
                        <span className="desc">调起微信扫一扫接口</span>
                        <button className="btn btn_primary" id="scanQRCode0">scanQRCode(微信处理结果)</button>
                        <button className="btn btn_primary" id="scanQRCode1">scanQRCode(直接返回结果)</button>

                        <h3 id="menu-shopping">微信小店接口</h3>
                        <span className="desc">跳转微信商品页接口</span>
                        <button className="btn btn_primary" id="openProductSpecificView">openProductSpecificView</button>

                        <h3 id="menu-card">微信卡券接口</h3>
                        <span className="desc">批量添加卡券接口</span>
                        <button className="btn btn_primary" id="addCard">addCard</button>
                        <span className="desc">调起适用于门店的卡券列表并获取用户选择列表</span>
                        <button className="btn btn_primary" id="chooseCard">chooseCard</button>
                        <span className="desc">查看微信卡包中的卡券接口</span>
                        <button className="btn btn_primary" id="openCard">openCard</button>

                        <h3 id="menu-pay">微信支付接口</h3>
                        <span className="desc">发起一个微信支付请求</span>
                        <button className="btn btn_primary" id="chooseWXPay">chooseWXPay</button>
                    </div>
                </div>

            </div>
        )
    }
}

JsSdk.propTypes = {
};

JsSdk.contextTypes = {
};

export default (JsSdk);




