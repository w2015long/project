/**
 * @author  lcl
 * @date 2019/6/21
 *
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/StoredValueRecharge.css";
import {findStoreValueRuleDetails, findOptimalStoredValueRule} from "../actions/storedValueReducerAction.js";
import Tou from "../../../media/images/default_head.png";
import {wxStoreValuePay} from "../../common/actions/jssdkAction";

class StoredValueRecharge extends Component {

    state = {
        amount: 0.00,
        selectAmountDiv: 1,
        isCustomShowArrivalAmount: "N",
        amountSuccess:0.00,
    };

    // 构造方法，基本没有使用
    constructor(prosp) {
        super(prosp);
        document.title = '储值中心';

    }

    componentWillMount() {
        this.props.actions.findStoreValueRuleDetails();
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    /**
     * 查询自定义金额对应的到账金额
     * @param storeValueRuleId 储值规则Id
     */
    findOptimalStoredValueRule(storeValueRuleId) {
        let self = this;
        let amountInput = parseFloat(document.getElementById('amountInput').value);
        self.props.actions.findOptimalStoredValueRule(storeValueRuleId, amountInput, () => {
            self.setState({
                amount: amountInput,
                selectAmountDiv: 7,
                isCustomShowArrivalAmount: "Y",
                amountSuccess:self.props.storedValueState.optimalAmount,
            })
        });
    }

    /**
     * 选择充值金额
     * @returns {*}
     */
    selectAmount(number, amount,account) {
        this.setState({
            amount: amount,
            selectAmountDiv: number,
            isCustomShowArrivalAmount: "N",
            amountSuccess:account,
        });
    }

    /**
     * 充值
     */
    rechargeBalance() {
        const history = this.props.history;
        wxStoreValuePay(this.state.amount,
            ()=>{
                // 支付成功回调
                history.push("/storedValue/successFul/"+ this.state.amountSuccess)
            }, json=>{
                // 支付失败回调
                history.push("/storedValue/failure/"+json.errMsg)
            }, ()=>{
                // 取消支付回调
                window.warningTip('您已取消充值');
            }
        )
    }


    render() {
        const {ruleDetails, optimalAmount} = this.props.storedValueState;
        const curDiv = this.state.selectAmountDiv;
        const isCustomShowArrivalAmount = this.state.isCustomShowArrivalAmount;
        let list = ruleDetails.storeValueRuleDetailFindProtocols || []
        return (
            <div className={"stored_value_recharge"}>
                <div className="online-recharge-main">
                    <div className="bg-top">
                        <div className="bg-toppic">
                            <img src={null != ruleDetails.iconFileId ? ruleDetails.isDisabled : Tou} alt=""/>
                        </div>
                        <div className="bg-toptext">您正在为[金康药房]会员卡储值</div>
                    </div>

                    <div className="stored-value-box">
                        <div className="stored-value">
                            <h5>储值金额</h5>
                            <div className="amount-list clearfix">
                                {
                                    null != ruleDetails.amountDouble1 &&
                                    <div className={curDiv === 1 ? "item  cur" : "item"}
                                         onClick={() => this.selectAmount(1, ruleDetails.amountDouble1,ruleDetails.amountDouble1Arrival)}>
                                        <h5>{ruleDetails.amountDouble1}<span>元</span></h5>
                                        <p>到账：{ruleDetails.amountDouble1Arrival}元</p>
                                    </div>
                                }

                                {
                                    null != ruleDetails.amountDouble2 &&
                                    <div className={curDiv === 2 ? "item  cur" : "item"}
                                         onClick={() => this.selectAmount(2, ruleDetails.amountDouble2,ruleDetails.amountDouble2Arrival)}>
                                        <h5>{ruleDetails.amountDouble2}<span>元</span></h5>
                                        <p>到账：{ruleDetails.amountDouble2Arrival}元</p>
                                    </div>
                                }

                                {
                                    null != ruleDetails.amountDouble3 &&
                                    <div className={curDiv === 3 ? "item  cur" : "item"}
                                         onClick={() => this.selectAmount(3, ruleDetails.amountDouble3,ruleDetails.amountDouble3Arrival)}>
                                        <h5>{ruleDetails.amountDouble3}<span>元</span></h5>
                                        <p>到账：{ruleDetails.amountDouble3Arrival}元</p>
                                    </div>
                                }

                                {
                                    null != ruleDetails.amountDouble4 &&
                                    <div className={curDiv === 4 ? "item  cur" : "item"}
                                         onClick={() => this.selectAmount(4, ruleDetails.amountDouble4,ruleDetails.amountDouble4Arrival)}>
                                        <h5>{ruleDetails.amountDouble4}<span>元</span></h5>
                                        <p>到账：{ruleDetails.amountDouble4Arrival}元</p>
                                    </div>
                                }

                                {
                                    null != ruleDetails.amountDouble5 &&
                                    <div className={curDiv === 5 ? "item  cur" : "item"}
                                         onClick={() => this.selectAmount(5, ruleDetails.amountDouble5,ruleDetails.amountDouble5Arrival)}>
                                        <h5>{ruleDetails.amountDouble5}<span>元</span></h5>
                                        <p>到账：{ruleDetails.amountDouble5Arrival}元</p>
                                    </div>
                                }

                                {
                                    null != ruleDetails.amountDouble6 &&
                                    <div className={curDiv === 6 ? "item  cur" : "item"}
                                         onClick={() => this.selectAmount(6, ruleDetails.amountDouble6,ruleDetails.amountDouble6Arrival)}>
                                        <h5>{ruleDetails.amountDouble6}<span>元</span></h5>
                                        <p>到账：{ruleDetails.amountDouble6Arrival}元</p>
                                    </div>
                                }

                            </div>
                        </div>

                        {
                            ruleDetails.isEnableCustom === 'Y' &&
                            <div className="custom-amount">
                                <h5>自定义金额</h5>
                                <div className="enter-the-amount">
                                    <span>￥</span>
                                    <input type="number" pattern="[0-9]*" id={"amountInput"} placeholder="自定义金额(单笔最大允许储值10000元)"
                                           onBlur={() => this.findOptimalStoredValueRule(ruleDetails.storeValueRuleId)}/>
                                </div>
                                {isCustomShowArrivalAmount === "Y" &&
                                <div className="tip-tex">到账{optimalAmount}元</div>
                                }

                            </div>
                        }

                        {
                            !ruleDetails || !ruleDetails.storeValueRuleDetailFindProtocols ?
                                <div className="preferential-rules">
                                    <p>储值优惠规则</p>
                                </div>
                                :
                                <div className="preferential-rules">
                                    <p>储值优惠规则</p>
                                    {
                                        list.filter(store => store.giveType === 'FIRST_RECHARGE').map((store, index) => {
                                            return (
                                                <div className="rule-list" key={index}>首充{store.rechargeAmountDouble}元赠送{store.giveAmountDouble}元</div>
                                            )
                                        })
                                    }
                                    {
                                        list.filter(store => store.giveType === 'EVERY_TIME_RECHARGE').map((store, index) => {
                                            return (
                                                <div className="rule-list" key={index}>满{store.rechargeAmountDouble}元赠送{store.giveAmountDouble}元</div>
                                            )

                                        })
                                    }
                                </div>
                        }
                    </div>

                    <div className="confirm-btn" onClick={() => this.rechargeBalance()}>确认储值</div>
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
        actions: bindActionCreators({findStoreValueRuleDetails, findOptimalStoredValueRule}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(StoredValueRecharge);