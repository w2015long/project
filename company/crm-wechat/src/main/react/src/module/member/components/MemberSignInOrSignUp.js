import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import logo from "../../../media/images/pic750x344.jpg";
import "../style/MemberSignInOrSignUp.css";
import {
    checkMember,
    getSendSmsFrequency,
    resetInput,
    resetResendSecond,
    resetStateBeforeLeave,
    saveAndLogin,
    sendSmsCode
} from "../actions/memberSignInOrSignUpAction";

class MemberSignInOrSignUp extends Component {
    pageSate = {
      hadSubmit: false
    };

    state = {
        timer : null
    };

    componentWillMount() {
        document.title = '会员注册';
        this.props.actions.getSendSmsFrequency();
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){
        this.props.actions.resetStateBeforeLeave();
        clearInterval(this.state.timer);
    }

    resentSmsTimer(){
        const pageContext = this;
        const timer = setInterval(function () {
            const {resendSmsSecond} = pageContext.props.memberSignInOrSignUpState;
            const {actions} = pageContext.props;
            if(resendSmsSecond){
                actions.resetResendSecond(resendSmsSecond - 1);
            }
        }, 1000);
        pageContext.setState({timer: timer});
        this.refs.validateCode.focus();
    }

    render(){
        const {tipsText, resendSmsSecond, smsResendLimitSecond, showMemberName, mobile, validateCode, name} = this.props.memberSignInOrSignUpState;
        const {actions} = this.props;

        return(
            <div className="member-sign-in-or-sign-up">
                <div className="login-main">
                    <div className="mt">
                        <img src={logo} alt=""/>
                    </div>
                    {
                        !showMemberName &&
                        <div className="mc">
                            <div className={mobile ? 'item item-focus' : 'item'} >
                                <input type="tel" placeholder="请输入手机号码" ref="mobile" value={mobile} maxLength="11" onChange={(event) => actions.resetInput(event.target.value, validateCode, name)}/>
                                <span className="del" onClick={() => actions.resetInput('', validateCode, name)}/>
                            </div>
                            <div className={validateCode ? 'item item-focus item-ver-code' : 'item item-ver-code'}>
                                <input type="tel" placeholder="请输入短信验证码" ref="validateCode" value={validateCode} maxLength="6" onChange={(event) => actions.resetInput(mobile, event.target.value, name)}/>
                                <span className="del" onClick={() => actions.resetInput(mobile, '', name)}/>
                                {
                                    resendSmsSecond===0 &&
                                    <span className="ver-code blue" onClick={() => actions.sendSmsCode(mobile, smsResendLimitSecond, () => this.resentSmsTimer())}>发送验证码</span>
                                }
                                {
                                    resendSmsSecond>0 &&
                                    <span className="ver-code">{resendSmsSecond}s重新发</span>
                                }
                            </div>
                            <a className="star-btn blue" onClick={() => actions.checkMember(mobile, validateCode, this.props.history, this.pageSate,this.props.location.search.split("?callBackUrl=")[1])}>开始</a>
                        </div>
                    }
                    {
                        showMemberName &&
                        <div className="mc">
                            <div className={name ? 'item item-focus' : 'item'}>
                                <input type="text" placeholder="请输入会员名称" max="16" ref="name" value={name} onChange={(event) => actions.resetInput(mobile, validateCode, event.target.value)}/>
                                <span className="del" onClick={() => actions.resetInput(mobile, validateCode, '')}/>
                            </div>
                            <a className="star-btn blue" onClick={() => actions.saveAndLogin(mobile, name, this.props.history, this.pageSate)}>确认</a>
                        </div>
                    }
                    {
                        tipsText &&
                        <div className="layer">{tipsText}</div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        memberSignInOrSignUpState: store.memberSignInOrSignUpState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            sendSmsCode,
            resetResendSecond,
            getSendSmsFrequency,
            checkMember,
            saveAndLogin,
            resetInput,
            resetStateBeforeLeave
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberSignInOrSignUp);