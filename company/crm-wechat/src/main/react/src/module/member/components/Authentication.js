/**
 * 扫码领优惠券
 * Created by liezihao on 2018/10.16
 */
// 引入react组件
import React, { Component } from 'react';
// 引入方法
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/Authentication.css';
import {Link} from "react-router-dom";
import {getMemberInfo} from "../actions/memberAction";
import {REG_MOBILE_PHONE} from "../../../util/common-reg";
import PerfectingInformation from "./PerfectingInformation"




class Authentication extends Component {
    state = {
        canSendSms: true,
        resendSmsSecond: 0,
        smsResendLimitSecond: 0,
        validateCode: null,
        hadSubmit:false,
        isCanVerification:false,
        isNext:false //是否到第二步
    };


    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        document.title = '身份验证';
        const context = this;
        //获取短信重发时间间隔
        window.textFetch(
            '/wap/chainSysSetting/getSendSmsFrequency',
            {},
            json => {
                context.setState({smsResendLimitSecond: json});
            }
        );
        context.props.actions.getMemberInfo();
    }

    //销毁组件的时候调用
    componentWillUnmount(){

    }

    sendSmsCode(memberInfo){
        const pageContext = this;
        const mobile = memberInfo.mobile;
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
                pageContext.setState({canSendSms: false,isCanVerification:true});
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
     //   this.refs.validateCode.focus();
    }

    onChangeValidateCode(validateCode){
        if(validateCode.length>6){
            this.setState({validateCode: validateCode.slice(0,6)});
        }else {
            this.setState({validateCode: validateCode});
        }

    }

    checkMember(memberInfo){
        const pageContext = this;
        const self= this;
        if(this.state.hadSubmit){
            return;
        }

        this.setState({hadSubmit: true});
        if(REG_MOBILE_PHONE.test(memberInfo.mobile)===false){
            window.warningTip('手机号码格式错误');
            this.setState({hadSubmit: false});
            return;
        }

        if(!this.state.isCanVerification){
            window.warningTip('请获取短信验证码');
            this.setState({hadSubmit: false});
            return;
        }

        if(!this.state.validateCode){
            window.warningTip('请填写短信验证码');
            this.setState({hadSubmit: false});
            return;
        }

        const data = {
            mobile: memberInfo.mobile,
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
                   self.setState({isNext: true})
                }
            },
            () => {
                pageContext.setState({hadSubmit: false});
            }
        );
    }


    render() {
        const {memberInfo} = this.props.memberState;
        const self = this;
        const isNext = this.state.isNext;
        return (
           <div className="AuthenticationDiv">
               {isNext&&<PerfectingInformation history={this.props.history}/>}
               {    !isNext&& <div className="authentication-main">
                   <div className="model12">
                       <div className="weui_cell">
                           <div className="cell_hd">
                               <span className="label">手机号码</span>
                           </div>
                           <div className="cell_bd">
                               <input type="text" className="input-tex" value={memberInfo.hideMobile}
                                      readOnly="readonly" onChange={() => {
                               }}/>
                           </div>
                           <div className="cell_ft">
                               <span className="send"
                                     onClick={this.state.canSendSms ? () => this.sendSmsCode(memberInfo) : () => {
                                     }}>{this.state.canSendSms ? '发送验证码' : this.state.resendSmsSecond ? this.state.resendSmsSecond + 's重发' : '发送验证码'}</span>
                           </div>
                       </div>

                       <div className="weui_cell">
                           <div className="cell_hd">
                               <span className="label">验证码</span>
                           </div>
                           <div className="cell_bd">
                               <input type="number" className="input-tex" ref='validateCode' placeholder="输入验证码"
                                      value={this.state.validateCode}
                                      onChange={(event) => this.onChangeValidateCode(event.target.value)}/>
                           </div>
                       </div>

                   </div>
                   <div className="next-step" onClick={() => this.checkMember(memberInfo)}>
                       下一步
                   </div>
               </div>}
           </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        memberState: store.memberState,
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getMemberInfo
            }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
