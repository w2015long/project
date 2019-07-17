import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import logo from "../../../media/images/pic640x128.png";
import '../style/ForgetPayPassword.css';
import {getSendSmsFrequency} from "../../common/actions/commonAction";

class ForgetPayPassword extends Component {
    state = {
        showSendValidateCode: 'Y',
        showSetPassword: 'N',
        showPassword: 'N',
        mobile: '',
        hadSendValidateCode: 'N',
        validateCode: '',
        sendValidateCodeTimer: 0,
        tipsTimer: 0,
        tipsText: '',
        payPassword: '',
        canSavePayPassword: 'N'
    };

    componentWillMount() {
        const pageContext = this;
        const {actions} = this.props;

        const url = '/wap/member/getMemberMobile';
        window.textFetch(
            url,
            {},
            text => {
                pageContext.changeState({
                    mobile: text + ''
                });
            }
        );

        actions.getSendSmsFrequency();
        pageContext.changeState({
            showSendValidateCode: 'Y',
            showSetPassword: 'N',
            showPassword: 'N',
            hadSendValidateCode: 'N',
            validateCode: '',
            sendValidateCodeTimer: 0,
            tipsTimer: 0,
            tipsText: '',
            payPassword: '',
            canSavePayPassword: 'N'
        });
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){

    }

    /**
     * 修改 state
     * @param state
     */
    changeState(state = {}){
        const pageContext = this;
        pageContext.setState(Object.assign({}, pageContext.state, state));
    }

    /**
     * 发送短信验证码
     */
    sendNormalValidateCode(){
        const pageContext = this;
        const {sendSmsFrequency} = this.props.commonState;

        const url = '/wap/validateCode/sendNormalValidateCode?mobile=' + pageContext.state.mobile;
        window.textFetch(
            url,
            {},
            text => {
                pageContext.changeState({
                    sendValidateCodeTimer: sendSmsFrequency,
                    hadSendValidateCode: 'Y'
                });

                setInterval(function () {
                    const {sendValidateCodeTimer} = pageContext.state;
                    if(sendValidateCodeTimer > 0){
                        pageContext.changeState({
                            sendValidateCodeTimer: sendValidateCodeTimer - 1
                        });
                    }
                }, 1000);

                pageContext.showTips('验证码已发送');
                pageContext.refs.validateCode.focus();
            }
        );
    }

    /**
     * 校验验证码
     */
    checkValidateCode(){
        const pageContext = this;
        const url = '/wap/validateCodeLog/checkValidateCode?mobile=' + this.state.mobile + '&validateCode=' + this.state.validateCode;
        window.textFetch(
            url,
            {},
            text => {
                pageContext.changeState({
                    showSendValidateCode: 'N',
                    showSetPassword: 'Y',
                    showPassword: 'N',
                    hadSendValidateCode: 'N',
                    validateCode: '',
                    sendValidateCodeTimer: 0,
                    tipsTimer: 0,
                    tipsText: '',
                    payPassword: '',
                    canSavePayPassword: 'N'
                });
            }
        );
    }

    /**
     * 显示提示语
     * @param tipsText
     */
    showTips(tipsText = ''){
        const pageContext = this;

        pageContext.changeState({
            tipsTimer: 3,
            tipsText: tipsText
        });

        setInterval(function () {
            const {tipsTimer} = pageContext.state;
            if(tipsTimer){
                pageContext.changeState({
                    tipsTimer: tipsTimer - 1
                });
            }
        }, 1000);
    }

    /**
     * 密码校验
     * @param payPassword
     */
    checkPayPassword(payPassword){
        if(!payPassword){
            this.changeState({
                payPassword: payPassword,
                canSavePayPassword: 'N'
            });
            return;
        }

        if(payPassword.length<6){
            this.changeState({
                payPassword: payPassword,
                canSavePayPassword: 'N'
            });
            return;
        }

        if(payPassword.length>16){
            this.changeState({
                payPassword: payPassword,
                canSavePayPassword: 'N'
            });
            return;
        }

        this.changeState({
            payPassword: payPassword,
            canSavePayPassword: 'Y'
        });
    }

    /**
     * 保存支付密码
     */
    savePayPassword(){
        const pageContext = this;
        const {payPassword} = this.state;
        const md5 = require('md5-node');
        const url = '/wap/member/updatePayPassword';
        window.textFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify({encryptedPassword: md5(payPassword)})
            },
            text => {
                pageContext.changeState({
                    showSendValidateCode: 'Y',
                    showSetPassword: 'N',
                    showPassword: 'N',
                    mobile: '',
                    hadSendValidateCode: 'N',
                    validateCode: '',
                    sendValidateCodeTimer: 0,
                    tipsTimer: 0,
                    tipsText: '',
                    payPassword: '',
                    canSavePayPassword: 'N'
                });

                pageContext.props.history.goBack(-2);
            }
        );
    }

    render() {
        const {mobile} = this.state;

        return(
            <div className='forget-pay-password'>
                <div className="retrieve-main">
                    <div className="mt">
                        <img src={logo} alt=""/>
                    </div>
                    {
                        this.state.showSendValidateCode===`Y` && this.state.showSetPassword==='N' &&
                        <div className="mc">
                            <div className="item">
                                <p>{mobile ? mobile.substr(0, 3) + '*****' + mobile.substr(7, 12) : ''} 收到的短信验证码</p>
                            </div>
                            <div className="item item-active" ref='validateCodeDiv'>
                                <input type="text" placeholder="请输入短信验证码" value={this.state.validateCode} ref='validateCode' onChange={(event) => this.changeState({validateCode: event.target.value.trim()})}/>
                                {
                                    this.state.validateCode &&
                                    <span className="del" onClick={() => this.changeState({validateCode: ''})}/>
                                }
                                <span className={this.state.sendValidateCodeTimer > 0 ? 'ver-code' : 'ver-code blue'} onClick={this.state.sendValidateCodeTimer > 0 ? () => {} : () => this.sendNormalValidateCode()}>
                                    {
                                        this.state.hadSendValidateCode==='N' ? '发验证码' : this.state.sendValidateCodeTimer > 0 ? this.state.sendValidateCodeTimer + 's重新发' : '重发验证码'
                                    }
                                </span>
                            </div>
                            <a className={this.state.validateCode ? "star-btn blue" : "star-btn"} onClick={() => this.checkValidateCode()}>开始</a>
                        </div>
                    }
                    {
                        this.state.showSendValidateCode===`N` && this.state.showSetPassword==='Y' &&
                        <div className="mc">
                            <div className="item">
                                <p>设置新的支付密码</p>
                            </div>
                            <div className="item">
                                <input type={this.state.showPassword==='Y' ? 'text' : 'password'} placeholder="6-16位数字/字母/字符组合" value={this.state.payPassword} onChange={(e) => this.checkPayPassword(e.target.value.trim())}/>
                                <span className={this.state.showPassword==='Y' ? 'visible' : 'invisible'} onClick={() => this.changeState({showPassword: this.state.showPassword==='Y' ? 'N' : 'Y'})}/>
                            </div>
                            <a className={this.state.canSavePayPassword==='Y' ? "star-btn blue" : "star-btn"} onClick={this.state.canSavePayPassword==='Y' ? () => this.savePayPassword() : () => {}}>开始</a>
                        </div>
                    }
                    {
                        this.state.tipsTimer > 0 &&
                        <div className="layer">{this.state.tipsText}</div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        commonState: store.commonState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getSendSmsFrequency
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPayPassword);