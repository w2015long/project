import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import "../style/NormalCartSettlement.css";
import {initJsSdk} from "../../common/actions/jssdkAction";
import {
    addressSelectCallback,
    changeSelfExtractState,
    clearCart,
    getNormalCartSettlementInfo,
    saveOrder,
    updateBalanceDeductionInfo,
    updateCouponInfo,
    updateExpectArriveTime
} from "../actions/normalCartSettlementAction";
import {searchCoupon} from '../actions/couponSelectorAction';
import DeliveryTimeSelector from "./DeliveryTimeSelector";
import {showDeliveryTimeSelector} from '../actions/deliveryTimeSelectorAction';
import Freight from './Freight';
import {showFreight} from '../actions/freightAction';
import PayByBalance from './PayByBalance';
import {showPayByBalance} from "../actions/payByBalanceAction";
import Confirm from '../../common/components/Confirm';
import {showConfirm} from "../../common/actions/commonAction";
import Address from "../../common/components/Address";
import Img from "../../common/components/Img";

/**
 * 购物车,结算页,页面跳转严格使用history.push(),返回使用history.goBack();
 */
class NormalCartSettlement extends Component {
    state = {
        isPay: false,                       //是否支付
        showAddress: 'N',                   //是否显示地址
        haveValidO2OProduct: 'N',           //是否有可以结算的O2O商品
        haveValidB2CProduct: 'N',           //是否有可以结算的B2C商品
        haveCrossPlatformProduct: 'N',      //是否含有跨平台商品
        haveO2OProduct: 'N',                //是否包含O2O商品
        memberRemark: ''                    //会员备注
    };

    componentWillMount() {
         initJsSdk();//初始化jssdk
         document.title = "结算页";
         this.props.actions.getNormalCartSettlementInfo(() => this.goBack(), () => this.initPageState());
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){
        const {actions} = this.props;
        //组件由浏览器返回操作导致卸载操作,则清理结算页
        if(  this.props.history.action ==="POP"){
            actions.clearCart();

        }
    }

    goBack() {
        this.props.history.goBack();
    }

    /**
     * 修改 state
     * @param state
     * @param callbackFunc
     */
    changeState(state = {}, callbackFunc = () => {}){
        const pageContext = this;

        pageContext.setState(Object.assign({}, pageContext.state, state), function () {
            callbackFunc();
        });
    }

    initPageState() {
        const cartItemList = this.props.normalCartSettlementState.normalCart.cartItemList || [];
        let haveValidO2OProduct = 'N';
        let haveValidB2CProduct = 'N';
        let haveO2OProduct = 'N';
        cartItemList.map(item => {
            if(item.isSelected==='Y' && item.platformType==='O2O'){
                if(item.isInvalid==='N' || (item.isInvalid==='Y' && item.isInvalidInCart==='N')){
                    haveO2OProduct = 'Y';
                }

                if(item.isInvalid==='N'){
                    haveValidO2OProduct = 'Y';
                }
            }

            if(item.isSelected==='Y' && item.platformType==='B2C' && item.isInvalid==='N'){
                haveValidB2CProduct = 'Y';
            }
        });

        this.changeState({
            isPay: false,
            showAddress: 'N',
            haveValidO2OProduct: haveValidO2OProduct,
            haveValidB2CProduct: haveValidB2CProduct,
            haveO2OProduct: haveO2OProduct,
            haveCrossPlatformProduct: haveValidO2OProduct==='Y' && haveValidB2CProduct==='Y' ? 'Y' : 'N'
        });
    }

    /**
     * 显示优惠券选择器
     */
    showCouponSelector(){
        const {normalCart} = this.props.normalCartSettlementState;
        const self = this;
        const {actions} = this.props;
        const {productTotalAmount} = this.props.normalCartSettlementState.normalCart;
        actions.searchCoupon(productTotalAmount, function (couponPermissionId) {
            actions.updateCouponInfo(couponPermissionId,self.props.history);
        });
        self.props.history.push('/cart/couponSelector/'+ normalCart.couponPermissionId);
    }

    /**
     * 检查会员是否设置余额支付密码
     */
    checkMemberPayPasswordIsExist(){
        const pageContext = this;
        const {actions} = this.props;
        const url = '/wap/member/checkMemberPayPasswordIsExist';
        window.jsonFetch(
            url,
            {},
            json => {
                if(json.payPasswordIsExist){//已经设置支付密码
                    actions.showPayByBalance('Y', (isUseBalance) => actions.updateBalanceDeductionInfo(isUseBalance));
                }else{//没有设置支付密码
                    actions.showConfirm('还没设置支付密码，请先设置支付密码', function () {
                        pageContext.props.history.push('/cart/forgetPayPassword');
                    });
                }
            }
        );
    }

    /**
     * 购物车项渲染
     * @param cartItemList      购物车项
     * @param isInvalid         是否失效（是否渲染失效的购物车项）
     * @returns {*}
     */
    renderCartItem(cartItemList, isInvalid){
        return  cartItemList.map(cartItem => {
                    return(
                        (cartItem.isSelected==='Y'
                            && cartItem.isInvalid===isInvalid
                            && ((isInvalid==='Y' && cartItem.isInvalidInCart==='N') || isInvalid==='N')) &&
                            <div className={cartItem.isInvalid==='Y' ? 'item invalid' : 'item'} key={cartItem.skuId}>
                                <div className="pic">
                                    <a>
                                        <Img src={cartItem.picture} />
                                        <span className={cartItem.isInvalid==='Y' ? 'arrive' : cartItem.platformType==='O2O' ? 'arrive bg-green' : 'arrive bg-blue'}>
                                            {
                                                cartItem.isInvalid==='Y' ? '失效' : cartItem.platformType==='O2O' ? '当天达' : '5天内达'
                                            }
                                        </span>
                                    </a>
                                </div>
                                <div className="title">
                                    <a>{cartItem.productNm}</a>
                                </div>
                                <div className="price">￥{cartItem.unitPriceDouble}</div>
                                <div className="m-bot">
                                    {
                                        cartItem.isInvalid==='Y' &&
                                        <span className="lose-tex">{cartItem.msg}</span>
                                    }
                                    {
                                        cartItem.isInvalid==='N' &&
                                        <span>规格：{cartItem.spec}</span>
                                    }
                                    <i>x{cartItem.quantity}</i>
                                </div>
                            </div>
                    );
                })

    }

    render(){
        const {normalCart} = this.props.normalCartSettlementState;
        const {actions} = this.props;
        let cartItemList = normalCart.cartItemList || [];
        let isSupportAccountPay = normalCart.isSupportAccountPay==='Y' && (normalCart.payableAmount > 0 || (normalCart.payableAmount===0 && normalCart.isUseBalance === 'Y'));
        return(
            <div className="main">
                {
                    this.state.showAddress==='Y' && normalCart.isSelfExtract==='N' &&
                    <Address callbackFunc={(receiverAddr) => this.changeState({showAddress: 'N'}, () => actions.addressSelectCallback(receiverAddr.receiverAddrId,()=>{this.initPageState()}))} needJudgeDistributionRange='N'/>
                }
                {
                    this.state.showAddress==='N'  &&
                    <div className="normal-cart-settlement">
                        <div className="get-order">
                            <div className="rb-bg"/>
                            {
                                this.state.haveO2OProduct==='Y' &&
                                <div className="pickup-way">
                                    <div className="cell-hd">取货方式</div>
                                    <div className="cell-bd">
                                        <div className={normalCart.isSelfExtract==='N' ? 'switchery other' : 'switchery'}>
                                            <span onClick={() => normalCart.isSelfExtract==='Y' ? {} : actions.changeSelfExtractState(() => this.initPageState())}>自提</span>
                                            <i onClick={() => normalCart.isSelfExtract==='N' ? {} : actions.changeSelfExtractState(() => this.initPageState())}>外送</i>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                normalCart.isSelfExtract==='Y' &&
                                <div className="consignee-addr2">
                                    <div className="drugstore-name">
                                        <p>{normalCart.currentShopName}</p>
                                        <span/>
                                    </div>
                                    <div className="dt-addrrr">{normalCart.currentAddress}</div>
                                </div>
                            }
                            {
                                normalCart.isSelfExtract==='N' &&
                                <div className="consignee-addr">
                                    <a onClick={() => this.changeState({showAddress: 'Y'})}>
                                        <span>{normalCart.receiverAddrId ? normalCart.receiverName : '新增地址'}</span>
                                        <span> {normalCart.receiverAddrId ? normalCart.contactTel : ''}</span>
                                        <p>{normalCart.receiverAddrId ? normalCart.deliveryAddr : '没有收货地址'}</p>
                                    </a>
                                </div>

                            }
                            {
                                this.state.haveValidO2OProduct==='Y' &&
                                <div className="shipment-times">
                                    <a onClick={() => actions.showDeliveryTimeSelector(normalCart.expectArriveTime, "", (expectArriveTime) => actions.updateExpectArriveTime(expectArriveTime))}>
                                        <span>{normalCart.isSelfExtract==='Y' ? '取货时间' : '送货时间'}</span>
                                        <p>{normalCart.expectArriveTime} <i>修改</i></p>
                                    </a>
                                </div>
                            }
                            <div className="step-cont">
                                <div className="goods-list">
                                    <div className="gd-box">
                                        <div className="mc">
                                            {
                                                this.renderCartItem(cartItemList, 'N')
                                            }
                                            {
                                                this.renderCartItem(cartItemList, 'Y')
                                            }
                                        </div>
                                    </div>

                                </div>
                                {
                                    normalCart.isSelfExtract==='N' &&
                                    <div className="postage">
                                        <span>配送费</span>
                                        <em onClick={() => actions.showFreight('Y')}>配送说明</em>
                                        <i>￥{normalCart.freightAmountDouble}</i>
                                    </div>
                                }
                            </div>
                            {
                                normalCart.isSupportCouponPay==='Y' &&
                                <div className="coupon">
                                    <div className="item">
                                        <div className="cell-hd">优惠券</div>
                                        <div className="cell-bd">
                                            <a onClick={() => this.showCouponSelector()}>
                                                <span>{normalCart.couponPermissionId ? '-￥' + normalCart.couponDeductionAmountDouble : '没有可用优惠券'}</span>
                                            </a>
                                        </div>
                                        <div className="cell-ft"/>
                                    </div>
                                </div>
                            }
                            {
                                isSupportAccountPay &&
                                <div className="balance">
                                    <div className="item">
                                        <div className="cell-hd">余额</div>
                                        <div className="cell-bd"><span> 剩余{normalCart.balanceAmountDouble}元</span></div>
                                        <div className="cell-ft" onClick={normalCart.isUseBalance==='Y' ? () => actions.updateBalanceDeductionInfo('N') : () => this.checkMemberPayPasswordIsExist()}>
                                            {
                                                normalCart.isUseBalance==='Y' &&
                                                <em>-￥{normalCart.balanceDeductionAmountDouble}</em>
                                            }
                                            {
                                                normalCart.balanceAmountDouble > 0 &&
                                                <span className={normalCart.isUseBalance==='Y' ? "switchery checked" : "switchery"} ><i/></span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                this.state.haveValidB2CProduct==='Y' &&
                                <div className="invoice">
                                    <div className="item" onClick={() => {this.props.history.push('/cart/invoice')}}>
                                        <div className="cell-hd">发票</div>
                                        <div className="cell-bd">
                                            <a><span>{normalCart.isNeedInvoice==='Y' ? (normalCart.invoiceTitle.length>10?normalCart.invoiceTitle.slice(0,10):normalCart.invoiceTitle) : '无需发票'}</span></a>
                                        </div>
                                        <div className="cell-ft"/>
                                    </div>
                                </div>
                            }
                            <div className="order-memo">
                                <textarea className="area-input" placeholder="选填：可填写附件要求，我们会尽力安排" defaultValue={this.state.memberRemark} onChange={(event) => this.changeState({memberRemark: event.target.value.trim()})}/>
                            </div>
                            <div className="amount_list">
                                <div className="amount_item">
                                    <div className="amount_item_l">商品金额</div>
                                    <div className="amount_item_r">￥{normalCart.productTotalAmountDouble}</div>
                                </div>

                                    <div className="amount_item">
                                        <div className="amount_item_l">配送费</div>
                                        <div className="amount_item_r colorred">+￥{normalCart.freightAmountDouble}</div>
                                    </div>
                                {/*{ normalCart.freightAmount>0 &&}*/}

                                    <div className="amount_item">
                                        <div className="amount_item_l">活动优惠</div>
                                        <div className="amount_item_r colorred">-￥{normalCart.productDiscountAmountDouble}</div>
                                    </div>
                               {/* {normalCart.productDiscountAmount>0 &&}*/}

                                    <div className="amount_item">
                                        <div className="amount_item_l">优惠券</div>
                                        <div className="amount_item_r colorred">-￥{normalCart.couponDeductionAmountDouble}</div>
                                    </div>
                               {/* {normalCart.couponDeductionAmount>0 &&}*/}
                                {/*{normalCart.balanceDeductionAmount>0 && }
                                    <div className="amount_item">
                                        <div className="amount_item_l">余额</div>
                                        <div className="amount_item_r colorred">-￥{normalCart.balanceDeductionAmountDouble}</div>
                                    </div>
                                */}
                            </div>
                            <div className="tips">
                                {
                                    this.state.haveCrossPlatformProduct==='Y' &&
                                    <div>
                                        <span>温馨提示：</span>
                                        <p>订单中同时出现当天达和3-5天达的商品，为了您能更快的收到商品，系统将为您分开配送。</p>
                                    </div>
                                }
                            </div>
                            <div className="div-bottom"/>
                            <div className="floatbar">
                                <p><span>实付款</span>￥{normalCart.payableAmountDouble}</p>
                                <a className="pay-btn" onClick={() => actions.saveOrder(normalCart, this.state, this.props.history)}>提交订单</a>
                            </div>
                        </div>
                        <DeliveryTimeSelector/>
                        <Freight haveValidO2OProduct={this.state.haveValidO2OProduct} haveValidB2CProduct={this.state.haveValidB2CProduct} />
                        <PayByBalance/>
                    </div>
                }
                <Confirm/>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        normalCartSettlementState: store.normalCartSettlementState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getNormalCartSettlementInfo,
            updateExpectArriveTime,
            saveOrder,
            addressSelectCallback,
            searchCoupon,
            updateCouponInfo,
            showDeliveryTimeSelector,
            showFreight,
            showPayByBalance,
            showConfirm,
            clearCart,
            updateBalanceDeductionInfo,
            changeSelfExtractState
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NormalCartSettlement);

