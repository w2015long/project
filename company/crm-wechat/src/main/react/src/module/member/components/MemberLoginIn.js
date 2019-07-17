import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import "../style/MemberLoginIn.css";
import {REG_MOBILE_PHONE} from '../../../util/common-reg';
import Confirm from "../../common/components/Confirm";
import {showConfirm} from "../../common/actions/commonAction";
import chachu from "../../../media/images/chachu.png";
import jinkanhuiyuanerweima from "../../../media/images/jinkanhuiyuanerweima.png";
import {qrcanvas} from 'qrcanvas'; //二维码生成
class MemberLoginIn extends Component{

    state = {
        mobile: '',
        canSendSms: false,
        smsResendLimitSecond: 0,
        resendSmsSecond: 0,
        hadSubmit: false,
        validateCode: null,
        weChatParamQRCodeProtocol:null,//会员卡URL；
        qrCodeImg: null, //会员卡二维码
        isShowqrCodeImgLayer: false, //是否展示二维码
    };

    componentWillMount() {
        const context = this;
        document.title = '会员登录';

        //获取短信重发时间间隔
        window.textFetch(
            '/wap/chainSysSetting/getSendSmsFrequency',
            {},
            json => {
                context.setState({smsResendLimitSecond: json});
            }
        );
    }

    componentDidMount() {
        // this.getWechatCardUrl()
    }
    getWechatCardUrl(){
        const context = this;
        const url = '/wap/member/getWechatCardUrl' ;
        window.textFetch(
            url,
            {},
            json => {
                context.setState({weChatParamQRCodeProtocol: json});
                this.initQrCode();
            }
        );
    }

    initQrCode = () => {
        const qrcode = document.getElementById('qrcode');
        if (qrcode&&this.state.weChatParamQRCodeProtocol) {
            var canvas1 = qrcanvas({
                data: decodeURIComponent(this.state.weChatParamQRCodeProtocol), //分享链接（根据需求来）
                size: 150 //二维码大小
            });
            this.setState({qrCodeImg: canvas1})
            qrcode.innerHTML = '';
            qrcode.appendChild(canvas1);
        }
    };


    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    onChangeMobile(mobile){
        this.setState({mobile: mobile});
        if(mobile.length===11 && this.state.resendSmsSecond===0){
            this.setState({canSendSms: true});
        }else{
            this.setState({canSendSms: false});
        }
    }

    onChangeValidateCode(validateCode){
        this.setState({validateCode: validateCode});
    }

    sendSmsCode(){
        const pageContext = this;
        const mobile = pageContext.state.mobile;
        if(REG_MOBILE_PHONE.test(mobile)===false){
            window.warningTip('手机号码格式错误');
            return;
        }

        const url = '/wap/validateCode/sendNormalValidateCode?mobile=' + mobile;
        window.textFetch(
            url,
            {},
            json => {
                window.warningTip('验证码已发送');
                pageContext.setState({canSendSms: false});
                pageContext.resentSmsTimer();
            }
        );
    }

    resentSmsTimer(){
        const pageContext = this;
        pageContext.setState({resendSmsSecond: pageContext.state.smsResendLimitSecond});
        const timer = setInterval(function () {
            if(pageContext.state.resendSmsSecond){
                pageContext.setState({resendSmsSecond: pageContext.state.resendSmsSecond - 1});
            }else{
                pageContext.setState({canSendSms: true});
            }
        }, 1000);
        pageContext.setState({timer: timer});
        this.refs.validateCode.focus();
    }

    checkMember(){
        const pageContext = this;
        const self= this;
        if(this.state.hadSubmit){
            return;
        }

        this.setState({hadSubmit: true});
        if(REG_MOBILE_PHONE.test(this.state.mobile)===false){
            window.warningTip('手机号码格式错误');
            this.setState({hadSubmit: false});
            return;
        }

        if(!this.state.validateCode){
            window.warningTip('请填写短信验证码');
            this.setState({hadSubmit: false});
            return;
        }

        const data = {
            mobile: this.state.mobile,
            validateCode: this.state.validateCode
        };
        const url = '/wap/member/checkMember';
        window.textFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data)
            },
            json => {
                pageContext.setState({hadSubmit: false});
                if(json==='Y'){
                    self.props.history.push(self.props.location.search?self.props.location.search.split("?redirect=")[1]:'/');
                }else{
                    pageContext.props.actions.showConfirm('您还不是会员，前往注册？', function () {
                        self.setState({isShowqrCodeImgLayer:true})
                    });
                }
            },
            () => {
                pageContext.setState({hadSubmit: false});
            }
        );
    }

    render(){
        return (
            <div className='member-login-in'>
                <div className="log_in">
                    <h5>手机号码登录</h5>
                    {/*<h6>如未有账号，请 <Link to="/member/memberCard" className="regist_link">立即注册</Link></h6>*/}
                    <h6>如未有账号，请 <a onClick={()=>{this.setState({isShowqrCodeImgLayer:true})}} className="regist_link">立即注册</a></h6>
                    <div className="login_wrap">
                        <div className="input_container">
                            <label>手机号</label>
                            <input type="number" placeholder="请输入11位手机号码" value={this.state.mobile} onChange={(event) => this.onChangeMobile(event.target.value)}/>
                            <span className={this.state.canSendSms ? 'mesg_code' : 'mesg_code mesg_disable'} onClick={this.state.canSendSms ? () => this.sendSmsCode() : () => {}}>{this.state.canSendSms ? '发验证码' : this.state.resendSmsSecond ? this.state.resendSmsSecond + 's重发' : '发验证码'}</span>
                        </div>
                        <div className="input_container">
                            <label>验证码</label>
                            <input type="number" placeholder="请输入手机验证码" ref='validateCode' onChange={(event) => this.onChangeValidateCode(event.target.value)}/>
                        </div>
                    </div>
                    <a className={this.state.validateCode && this.state.mobile ? 'login_btn btn_active' : 'login_btn'} onClick={this.state.validateCode && this.state.mobile ? () => this.checkMember() : () => {}}>登录</a>
                </div>
                <Confirm/>
                <div className="layer-box"style={{display: this.state.isShowqrCodeImgLayer ? "block" : "none"}}>
                    <div className="lay-item">
                        <h5 className="lay-title">长按领取金康会员卡</h5>
                        <div className="pic-box">
                            <div className="pic" id="qrcode">
                                <img src={jinkanhuiyuanerweima} alt=""/>
                            </div>
                        </div>
                        <a  onClick={()=>{this.setState({isShowqrCodeImgLayer:false})}} className="close-btn">
                            <img src={chachu} alt=""/>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {

    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            showConfirm
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberLoginIn);