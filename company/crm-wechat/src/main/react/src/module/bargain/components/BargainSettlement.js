import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import icon24x24 from "../../../media/images/icon24x24.png";
import dinwei from "../../../media/images/dinwei.png";
import DeliveryTimeSelector from "../../cart/components/DeliveryTimeSelector";
import BargainAddress from "./BargainAddress";
import {selectDeliveryTime, showDeliveryTimeSelector} from '../../cart/actions/deliveryTimeSelectorAction';
import "../style/BargainSettlement.css";
import {saveOrder, showBargainSettlementDetail} from "../../bargain/actions/bargainSettlementAction";

class BargainSettlement extends Component {

    state = {
        isPay: false,      //是否支付
        showAddress: 'N',// 是否显示选择地址组件
        expectArriveTime: '立即取货', // 取货时间
        addressItem: null // 选中的地址
    };

    componentWillMount() {
        document.title = '砍价提货结算页';
        const {mutualBargainShareRecordId, mutualBargainActivityId} = this.props.match.params;
        this.props.actions.showBargainSettlementDetail(mutualBargainShareRecordId, mutualBargainActivityId);
    }

    /**
     * 修改 state
     */
    changeState(state) {
        this.setState(state);
    }

    /**
     * 提交订单
     */
    submitOrder() {
        if (!this.state.addressItem) {
            window.warningTip('请选择取货地址！');
            return;
        }
        const {mutualBargainShareRecordId, mutualBargainActivityId} = this.props.match.params;
        let submitData = {
            shopId: this.state.addressItem.shopId,
            mutualBargainShopId: this.state.addressItem.mutualBargainShopId,
            mutualBargainShareRecordId: mutualBargainShareRecordId,
            mutualBargainActivityId: mutualBargainActivityId,
            expectArriveTime: this.state.expectArriveTime
        };
        this.props.actions.saveOrder(submitData, this.state, this.props.history);
    }

    render() {
        let self = this;
        const {mutualBargainActivityId, mutualBargainShareRecordId} = this.props.match.params;
        const {mutualBargainSettlementDetail} = this.props.bargainSettlementState;
        const {actions} = this.props;
        let addressItem = this.state.addressItem;
        return (
            <div className="bargain-settlement-main">
                {
                    this.state.showAddress === 'Y' &&
                    <BargainAddress mutualBargainActivityId={parseInt(mutualBargainActivityId)}
                                    mutualBargainShareRecordId={parseInt(mutualBargainShareRecordId)}
                                    callbackFunc={(addressItem) => {
                        this.changeState({"showAddress": "N", "addressItem": addressItem})
                    }}/>
                }
                {
                    this.state.showAddress === 'N' &&
                    <div className="bargain-settlement">
                        <div className="get-order">
                            <div className="rb-bg"></div>
                            {addressItem &&
                            <div className=" consignee-addr2" onClick={() => {
                                this.changeState({"showAddress": "Y"})
                            }}>
                                <div className="ca-item">
                                    <span className="zt">【1】</span>
                                    <span
                                        className="zt zt2">{addressItem.shopName}{addressItem.isHasInventory === "Y" ? "" : "(缺货)"}</span>
                                    <p>{addressItem.shopAddress}</p>
                                    <h5><img src={icon24x24}/></h5>
                                </div>
                                <div className="ca-item">
                                    <span className="zt">【2】</span>
                                    <span className="zt zt2">{addressItem.activityArea}</span>
                                    <p>{addressItem.activitySite}</p>
                                    <h5><img src={dinwei}/></h5>
                                </div>
                            </div>
                            }
                            {!addressItem &&
                            <div className="consignee-addr" style={{"display": "disable"}}>
                                <a href="javascript:void(0);" onClick={() => {
                                    this.changeState({"showAddress": "Y"})
                                }}>
                                    <span>新增取货地址</span>
                                    <p>你还未选择取货地址</p>
                                </a>
                            </div>
                            }
                            {addressItem &&
                            <div className="shipment-times">
                                <a onClick={() => actions.showDeliveryTimeSelector(false, addressItem.shopId, (expectArriveTime) => {
                                    self.setState({"expectArriveTime": expectArriveTime})
                                })}>
                                    <span>取货时间</span>
                                    <p>{this.state.expectArriveTime} <i>修改</i></p>
                                </a>
                            </div>
                            }
                            <div className="step-cont">
                                <div className="goods-list">
                                    <div className="gd-box">

                                        <div className="mc">
                                            <div className="item">
                                                <Link
                                                    to={'/product/detail/' + mutualBargainSettlementDetail.productId + (addressItem ? '/O2O/' + addressItem.shopId : "")}>
                                                    <div className="pic"><a href="javascript:void(0);">
                                                        <img
                                                            src={mutualBargainSettlementDetail.picture ? mutualBargainSettlementDetail.picture : ""}
                                                            alt=""/></a>
                                                    </div>
                                                    <div className="title"><a
                                                        href="javascript:void(0);">{mutualBargainSettlementDetail.productNm}</a>
                                                    </div>
                                                    <div
                                                        className="price">￥{mutualBargainSettlementDetail.priceDouble ? mutualBargainSettlementDetail.priceDouble.toFixed(1) : 0.0}</div>
                                                    <div className="m-bot">
                                                        <span>规格：{mutualBargainSettlementDetail.spec}/{mutualBargainSettlementDetail.unit}</span>
                                                        <i>x{mutualBargainSettlementDetail.quantity}</i>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <div className="amount_list">
                                <div className="amount_item">
                                    <div className="amount_item_l">商品金额</div>
                                    <div
                                        className="amount_item_r">￥{mutualBargainSettlementDetail.priceDouble ? mutualBargainSettlementDetail.priceDouble.toFixed(1) : 0.0}</div>
                                </div>
                                <div className="amount_item">
                                    <div className="amount_item_l">活动优惠</div>
                                    <div
                                        className="amount_item_r colorred">-￥{mutualBargainSettlementDetail.activityDiscountsDouble ? mutualBargainSettlementDetail.activityDiscountsDouble.toFixed(1) : 0.0}</div>
                                </div>

                            </div>

                            <div className="tips">
                                <span>温馨提示：</span>
                                <p>请到指定位置领取活动商品，感谢您的参与！</p>
                            </div>
                            <div className="div-bottom"></div>
                            <div className="floatbar">
                                <p>
                                    <span>实付款 :</span>￥{mutualBargainSettlementDetail.activityPriceDouble ? mutualBargainSettlementDetail.activityPriceDouble.toFixed(1) : 0.0}
                                </p>
                                <a href="javascript:void(0);" className="pay-btn"
                                   onClick={() => this.submitOrder()}>立即支付</a>
                            </div>
                        </div>
                        <DeliveryTimeSelector isNotNormalCartCall={true}/>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        normalCartSettlementState: store.normalCartSettlementState,
        bargainSettlementState: store.bargainSettlementState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            showBargainSettlementDetail,
            showDeliveryTimeSelector,
            selectDeliveryTime,
            saveOrder
        }, dispatch)
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(BargainSettlement);