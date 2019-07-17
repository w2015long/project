
// 引入react组件
import React, { Component } from 'react';
// 引入方法
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/Authentication.css';
import {Link} from "react-router-dom";
//import {getMemberInfo} from "../actions/memberAction";
import {CHECKTHE_FORM} from "../../../util/common-reg";
import {getMemberInfo} from "../actions/memberAction";



class PerfectingInformation extends Component {
    state = {
        name:'',
        isShowChangeMemberName:false, //是否显示手输姓名
        isTick:false, //是否勾选
        idCode:'', //身份证
    };


    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        document.title = '完善信息';
        const self = this;
        self.props.actions.getMemberInfo((memberInfo)=>{
            self.setState({
                name:memberInfo.name
            })
        });
    }


    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount(){
    }


    //销毁组件的时候调用
    componentWillUnmount(){

    }



    onChangeMemberName(name){
        const self = this;
        self.setState({
            name:name,
        })
    }

    onChangeIdCode(idCode){
        const self = this;
        self.setState({
            idCode:idCode
        })
    }

    tickEvent(){
        const self = this;
        self.setState({
            isTick:!self.state.isTick
        })
    }

    confirmationActivation(){
        const self = this;
        if(!this.state.name){
            window.warningTip('请输入姓名');
            return;
        }
        if(!this.state.idCode){
            window.warningTip('请输入身份证');
            return;
        }
        if(CHECKTHE_FORM(this.state.idCode)===false){
            return;
        }

        if(!this.state.isTick){
            window.warningTip('请勾选相关条约');
            return;
        }

        console.log("校验通过！！！");


        const url = '/wap/member/saveMemberNameAndIdentityNumber?name=' + this.state.name+"&identityNumber="+this.state.idCode;
        window.textFetch(
            url,
            {
                method: 'GET',
            },
            json => {
                self.props.history.goBack(-1);
            }
        );

    }


    render() {
        const {memberInfo} = this.props.memberState;
        const self = this;


        return (
           <div className="AuthenticationDiv">
               <div className="authentication-main">
                   <div className="model12">
                       <div className="weui_cell">
                           <div className="cell_hd">
                               <span className="label">姓名</span>
                           </div>
                           <div className="cell_bd">
                               <input type="text" className="input-tex" maxLength={15} placeholder="请输入姓名" value={this.state.name} onChange={(event) => this.onChangeMemberName(event.target.value)}/>
                           </div>
                       </div>

                       <div className="weui_cell">
                           <div className="cell_hd">
                               <span className="label">身份证号</span>
                           </div>
                           <div className="cell_bd">
                               <input type="text" className="input-tex" maxLength={18} placeholder="请输入身份证号码"  value={this.state.idCode} onChange={(event) => this.onChangeIdCode(event.target.value)}/>
                           </div>
                       </div>
                   </div>

                   <div className={this.state.isTick?'treaty-tips  treaty-tipsselect':'treaty-tips '} ><span  onClick={()=>this.tickEvent()}>已阅读并同意</span><span className='spanDiv'>《相关条约》</span></div>

                   <div className="next-step margin-t0" onClick={()=>this.confirmationActivation()}>确认激活</div>
               </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(PerfectingInformation);
