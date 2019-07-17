/**
 * 会员储值余额中心
 * @author  lcl
 * @date 2019/6/21
 *
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/MemberStoredValueBalance.css";
import {findMemberStoredValueBalance,changeRegisterIDCardState} from "../actions/storedValueReducerAction.js";
import {showConfirm} from "../../common/actions/commonAction";
import Confirm from "../../common/components/Confirm";
class MemberStoredValueBalance extends Component {

    state = {};

    // 构造方法，基本没有使用
    constructor(prosp){
        super(prosp);
        document.title = '我的储值余额';
    }

    // 在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount() {
        this.props.actions.findMemberStoredValueBalance();
        this.checkMemberRegisterIDCard();
    }

    componentDidMount() {

    }
    // 每次准备更新渲染之前调用
    componentWillUnmount() {
    }

    /**
     * 检查是否有身份验证
     * @returns {*}
     */
    checkMemberRegisterIDCard(){
        const pageContext = this;
        const url = '/wap/storedValue/findMemberRegisterIDCard';
        window.textFetch(
            url,
            {},
            json => {
                if(json){ // 已经登记身份信息
                    pageContext.props.actions.changeRegisterIDCardState("Y");
                }else{ // 未登记身份信息
                    pageContext.props.actions.showConfirm('您还没验证身份信息，请前往登记', ()=>{
                        pageContext.props.history.push("/member/authentication");
                    });
                }
            }
        );
    }

    render() {
        const history = this.props.history;
        const {memberStoredValueBalance,registerIDCardState} = this.props.storedValueState;
        let balance = memberStoredValueBalance === 0 ? "0.00":memberStoredValueBalance.toFixed(2);
        return (

            <div className={"member_stored_value_balance"}>
                <Confirm/>
                <div className="my-stored-main">
                    <div className="bg-top">
                        <div className="bg-top-text clearfix">
                            <h5 className="fl" style={{"color":"white"}}>储值总额（元）</h5>
                            <p className="fr" onClick={()=>history.push("/member/billingList")}>账单明细</p>
                        </div>
                        <div className="money">{balance}</div>
                    </div>

                    <div className="model12">
                        <div className="cell_access" onClick={registerIDCardState === 'Y'? () => history.push("/storedValue/recharge") : ()=>this.checkMemberRegisterIDCard()}>
                            <div className="cell_bd">
                                <span className="label_tex">在线充值</span>
                            </div>
                            <div className="cell_ft"/>
                        </div>
                        <div  className="cell_access" onClick={registerIDCardState === 'Y'? () => history.push("/storedValue/recharge") : ()=>this.checkMemberRegisterIDCard()}>
                            <div className="cell_bd">
                                <span className="label_tex">线下付款</span>
                            </div>
                            <div className="cell_ft"/>
                        </div>
                    </div>


                    <div className="special-note">
                        <h5>特别说明：</h5>
                        <div className="special-contentbox">
                            <p>1、请在门店结账前出示二维码；</p>
                            <p>2、此卡可享受会员优惠待遇；</p>
                            <p>3、此卡不得购买产品，不得与其它优惠同时使用</p>
                            <p>4、此卡一经售出，概不兑现。如有遗失，请及时挂失；</p>
                            <p>5、本店保留此卡法律范围内的最终解释权。</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        storedValueState: store.storedValueState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({findMemberStoredValueBalance,showConfirm,changeRegisterIDCardState}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberStoredValueBalance);