/**
 * Created by admin on 2018/3/28.
 * 修改手机号码
 */
import React, {Component} from "react";
import "../style/MemberValidateMobile.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import head from "../../../media/images/beijin1280x260.png";
import {
    changeMobile,
    countDownTime,
    getSendSmsFrequency,
    getValidCode,
    inputChange,
    validateCode
} from "../actions/memberAction";

class MemberChangeMobile extends Component{

    state = {
        timer : null
    };

    componentWillMount(){
        document.title = '修改手机号码';
        this.props.actions.getSendSmsFrequency();
        this.props.actions.inputChange('', '')
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
        this.props.actions.countDownTime(0);
    }

    onInput(e, len){
        let val = e.target.value;
        if(val.length> len){
            e.target.value = val.slice(0, len)
        }
    }

    sendValidateCode(){
        var self = this;
        let mobile = this.refs.mobile.value;
        const props = this.props;
        if (this.validateMobile(mobile)){
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
        let mobile = this.refs.mobile.value;
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
                this.changeMobile(mobile);
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

    changeMobile(mobile){
        const props = this.props;
        props.actions.changeMobile(mobile, success => {
            if (success) {
                window.successTip("修改成功！");
                setTimeout(function () {
                    props.history.push('/member/index');
                }, 1000);
            }
        });
    }

    render() {
        const {mobile, validateCode, time} = this.props.memberState;
        const {actions} = this.props;
        return (
            <div className="member-validate-mobile">
                <div className="mt"><img src={head} alt=""/></div>
                <div className="mc">
                    <div className={mobile ? "item item-focus" : "item"}>
                        <input onInput={e => this.onInput(e, 11)} type="number" placeholder="请输入11位手机号码" ref={'mobile'} value={mobile} onChange={(event)=>actions.inputChange(event.target.value, validateCode)}/>
                        <span className="del" onClick={()=> actions.inputChange('', validateCode)}/>
                    </div>

                    <div className={validateCode ? "item item-focus" : "item"}>
                        <input type="number" placeholder="请输入短信验证码" ref={'validateCode'} value={validateCode} onInput={e => this.onInput(e, 6)} onChange={(event)=>actions.inputChange(mobile, event.target.value)}/>
                        <span className="del" style={{left:"3.5rem"}} onClick={(event)=>actions.inputChange(mobile, '')}/>
                        {time === 0 && <span className="ver-code blue" onClick={()=>this.sendValidateCode()}>发送验证码</span>}
                        {time > 0 && <span className="ver-code"  ref="reSend">重新获取{time}s</span>}
                    </div>
                    <a className={mobile && validateCode ? "star-btn blue" : "star-btn"} onClick={()=> this.validateCode()}>确认</a>
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
        actions: bindActionCreators({changeMobile, inputChange, getSendSmsFrequency, getValidCode, countDownTime, validateCode}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(MemberChangeMobile);