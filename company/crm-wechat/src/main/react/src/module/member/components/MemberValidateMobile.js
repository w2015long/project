/**
 * Created by admin on 2018/3/27.
 * 校验手机号码
 */
import React, {Component} from "react";
import "../style/MemberValidateMobile.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {countDownTime, getSendSmsFrequency, getValidCode, inputChange, validateCode} from "../actions/memberAction";
import head from "../../../media/images/beijin1280x260.png";

class MemberValidateMobile extends Component {

    state = {
        timer : null
    };

    componentWillMount() {
        document.title = '验证手机号码';
        this.props.actions.getSendSmsFrequency();
    }

    componentDidMount(){
        this.props.actions.inputChange('', '');
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
        this.props.actions.countDownTime(0);
    }

    sendValidateCode(){
        var self = this;
        let mobile = this.props.memberState.memberInfo.mobile;
        if (this.validateMobile(mobile)){
            const props = this.props;
            props.actions.getValidCode(mobile, success => {
                if(success){
                    window.successTip("验证码已发送");
                    let leftTime = props.memberState.sendSmsFrequency;
                    let timer = setInterval(function () {
                        if (leftTime <= 0) {
                            clearInterval(timer);
                        }
                        props.actions.countDownTime(leftTime--);
                    }, 1000);
                    self.setState({timer: timer});
                }
            });
            this.refs.validateCode.focus();
        }
    }

    validateCode(){
        let mobile = this.props.memberState.memberInfo.mobile;
        let validateCode = this.refs.validateCode.value;
        if(!this.validateMobile(mobile)){
            return;
        }
        if (!validateCode) {
            window.warningTip("验证码不能为空！");
            return;
        }
        this.props.actions.validateCode(mobile, validateCode, success => {
            if (success) {
                this.props.history.push('/member/mobile/change');
            }
        });
    }

    validateMobile(mobile) {
        if (!mobile) {
            window.warningTip("手机号码不能为空！");
            return false;
        } else {
            let reg = new RegExp(/^1[23456789]\d{9}$/);
            if (!reg.test(mobile)) {
                window.warningTip("手机号码格式错误！");
                return false;
            }
        }
        return true;
    }

    onInput(e, len){
        let val = e.target.value;
        if(val.length> len){
            e.target.value = val.slice(0, len)
        }
    }

    render() {
        const {time, validateCode, memberInfo} = this.props.memberState;
        const {actions} = this.props;
        return (
            <div className="member-validate-mobile">
                <div className="mt">
                    <img src={head} alt=""/>
                </div>
                <div className="mc">
                    <div className="item">
                        <input placeholder="请输入11位手机号码" onInput={e => this.onInput(e, 11)} type="text" value={memberInfo.mobile} ref={'mobile'} readOnly={true}/>
                        {time === 0 && <span className="ver-code blue" onClick={()=>this.sendValidateCode()}>发送验证码</span>}
                        {time !== 0 && <span className="ver-code"  ref="reSend">重新获取{time}s</span>}
                    </div>
                    <div className={validateCode ? "item item-focus" : "item"}>
                        <input type="number" placeholder="请输入短信验证码" ref={'validateCode'} value={validateCode} onInput={e => this.onInput(e, 6)} onChange={(event)=>actions.inputChange('', event.target.value)}/>
                        <span className="del" onClick={(event)=>actions.inputChange('', '')}/>
                    </div>
                    <a className={validateCode ? "star-btn blue" : "star-btn"} onClick={()=>this.validateCode()}>开始</a>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        memberState:store.memberState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getValidCode, countDownTime, validateCode, getSendSmsFrequency, inputChange}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberValidateMobile);