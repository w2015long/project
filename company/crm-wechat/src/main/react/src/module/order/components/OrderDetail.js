/**
 * 订单详情
 * Created by caixuan on 2018/4/3.
 */
import React, {Component} from "react";
import "../style/order-detail.css";
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    changeIsShowAllItem,
    confirmOrder,
    findOrderDetail,
    findOrderStatus,
    handleImageErroredForProductDetail,
    reminderOrder
} from "../actions/orderListActions";
import {initJsSdk, wxPay} from "../../common/actions/jssdkAction";
import defaultProductPic from "../../../media/images/default-product-pic.jpg";
import CancellationOrder from "./CancellationOrder";
//引用条形码组件
import BarCode from '../../common/components/BarCode';

class OrderDetail extends Component {
    state = {
        codeDisplay: false,
        classStyleOpen: false, // 取消原因模态框开关
        cancelOrderCallBack: () => {
        }, // 取消订单的回调函数
        orderStatusTimer:null //订单状态定时器
    };
    componentWillMount() {
        document.title = '订单详情';
        this.isPaying = false;
        let id = this.props.match.params.id;
        this.props.actions.findOrderDetail(id);
    }
    componentDidMount(){
        initJsSdk();
    }
    static buildOrderState(orderState,isComment){
        switch (orderState){
            case "UNPAID":
                return "待付款";
            case "WAIT_SEND":
                return "待发货";
            case "SEND":
                return "待收货";
            case "FINISH":
                if(isComment === "N"){
                    return "待评价";
                }
                return "已完成";
            case "CLOSE":
                return "已取消";
            default:return "";
        }
    }

    static buildTitle(orderState,isComment){
        switch (orderState){
            case "UNPAID":
                return "订单已提交成功，请尽快付款！";
            case "WAIT_SEND":
                return "卖家备货中，请耐心等待。";
            case "SEND":
                return "卖家已发货。";
            case "FINISH":
                if(isComment === "N"){
                    return "请对您的订单进行评价。";
                }
                return "订单已交易成功！";
            case "CLOSE":
                return "订单已取消";
            default:return "";
        }
    }

    /**
     * 取消订单
     */
    cancelOrder(orderId,orderState){
        /* return this.props.actions.cancelOrder(orderId,()=>{this.props.history.push('/order/list/'+orderState)});*/
        this.setState({
            classStyleOpen: true, cancelOrderCallBack: () => {
                this.props.history.push('/order/list/' + orderState)
            }
        });
    }
    //当组件要被从界面上移除的时候，调用
    componentWillUnmount(){
        clearInterval( this.state.orderStatusTimer);
    }
    /**
     * 取消订单模态框回调设置
     */
    classStyleOpenFun() {
        this.setState({classStyleOpen: false});
    }

    /**
     * 立即支付
     */
    payNow(orderId){
        let self = this;
        if(self.isPaying){
            return;
        }
        self.isPaying = true;
        let history = self.props.history;
        wxPay(
            'NORMAL',
            orderId,
            function () {
                history.push('/order/list');
                self.isPaying = false;
            },
            function () {
                window.warningTip('支付失败');
                self.isPaying = false;
            },
            function () {
                window.warningTip('您已取消支付');
                self.isPaying = false;
            }
        );
    }

    commentOrder(){
        console.log("评价功能")
    }

    /**
     * 确认订单
     */
    confirmOrder(orderId,orderState){
        return this.props.actions.confirmOrder(orderId,()=>{this.props.history.push('/order/list/'+orderState)});
    }

    /**
     * 控制条形码模态框
     */
    codeDisplayFun(selfExtractNum = {}) {
        let flag = !this.state.codeDisplay;
        this.setState({codeDisplay: flag});
        this.timelyQueryOrderStatus(flag);

    }
    /**
     * 订单核验成功
     * Created by olx on 2019/5/29/029
     */
    successfulOrderVerification(data){
        if(data==="FINISH"){
            const self= this;
            this.codeDisplayFun();
            window.successTip("订单核验成功");
            self.props.actions.findOrderDetail(self.props.match.params.id);

        }

    }
    /**
     * 定时发起查询后台订单状态
     * Created by olx on 2019/5/29/029
     */
    timelyQueryOrderStatus(data){
        if(data){
           this.state.orderStatusTimer= setInterval(() =>this.props.actions.findOrderStatus(this.props.match.params.id,(data)=>{this.successfulOrderVerification(data)}), 5000);
        }else {
            clearInterval( this.state.orderStatusTimer);
        }
    }
    render() {
        const {orderDetail,isShowAllOrderItems} = this.props.orderListState;
        const items = orderDetail.orderItemProtocols||[];
        const {actions} = this.props;
        let classStyleOpen = this.state.classStyleOpen;
        let cancelOrderCallBack = this.state.cancelOrderCallBack;
        return(
            <div className="order-detail-main">
            <div className="order-detail">
                <div className="current-status">
                    <p>{OrderDetail.buildOrderState(orderDetail.orderState,orderDetail.isComment)}</p>
                    <span>{OrderDetail.buildTitle(orderDetail.orderState,orderDetail.isComment)}</span>
                </div>
                {
                    orderDetail.isSelfExtract === "N" &&
                    <div className="consignee-addr">
                        <span>{orderDetail.receiveName}</span>
                        <span>{orderDetail.receiverMobile}</span>
                        <p>{orderDetail.receiverAddr}</p>
                    </div>
                }
                {
                    orderDetail.isSelfExtract === "Y" && (orderDetail.orderState === "WAIT_SEND" || orderDetail.orderState === "SEND") &&
                    <div className="code-box">
                        <p>提货码</p>
                        <a href="javascript:void(0)"
                           onClick={() => this.codeDisplayFun()}>{orderDetail.selfExtractNum.replace(/(.{3})/g, "$1 ")}</a>
                    </div>
                }
                <div className="gd-cont">
                    <div className="gd-box">
                        <div className="mt">
                            <div className="name">
                            {orderDetail.platformType === "O2O" && <Link to={"/shop/detail/"+orderDetail.shopId}>{orderDetail.shopName}</Link>}
                            {orderDetail.platformType === "B2C" && <a>{orderDetail.chainName}</a>}
                            </div>
                        </div>
                        <div className="mc">
                            {
                                items.map((goods,goodsIndex)=>{
                                    if(goodsIndex < 3){
                                        return (
                                            <div className="item" key={goodsIndex}>
                                                <Link
                                                    to={'/product/detail/' + goods.productId + '/' + goods.platformType + '/' + orderDetail.shopId}>
                                                    <div className="pic"><img onError={() => {
                                                        actions.handleImageErroredForProductDetail(orderDetail, goodsIndex)
                                                    }} src={goods.picture ? goods.picture : defaultProductPic} alt=""/>
                                                    </div>
                                                <div className="title"><p>{goods.productName}</p><p>{goods.spec}</p></div>
                                                <div className="m-bot">
                                                    <span>单价: ￥{goods.buyUnitPrice}</span>
                                                    <i>x{goods.quantity}</i>
                                                </div>
                                                </Link>
                                            </div>
                                        )
                                    }else if(isShowAllOrderItems){
                                        return (
                                            <div className="item" key={goodsIndex}>
                                                <Link
                                                    to={'/product/detail/' + goods.productId + '/' + goods.platformType}>
                                                    <div className="pic"><img onError={() => {
                                                        actions.handleImageErroredForProductDetail(orderDetail, goodsIndex)
                                                    }} src={goods.picture ? goods.picture : defaultProductPic} alt=""/>
                                                    </div>
                                                    <div className="title"><p>{goods.productName}</p><p>{goods.spec}</p></div>
                                                    <div className="m-bot">
                                                        <span>单价: ￥{goods.buyUnitPrice}</span>
                                                        <i>x{goods.quantity}</i>
                                                    </div>
                                                </Link>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                        {orderDetail.orderItemProtocols.length - 3 > 0 &&
                        <div className="md">
                        {!isShowAllOrderItems && <a onClick={() => this.props.actions.changeIsShowAllItem(true)} className="more">查看其它{orderDetail.orderItemProtocols.length - 3}个品种</a>}
                        {isShowAllOrderItems && <a onClick={()=>this.props.actions.changeIsShowAllItem(false)} className="pack-up">收起</a>}
                        </div>}
                    </div>
                </div>
                <div className="info-box">
                    {/*<div className="info-item">*/}
                        {/*<span>订单总金额</span>*/}
                        {/*<i>￥{orderDetail.orderTotalAmount == null ? 0 : orderDetail.orderTotalAmount}</i>*/}
                    {/*</div>*/}
                    <div className="info-item">
                        <span>商品总金额</span>
                        <i>¥ {orderDetail.productTotalAmount?orderDetail.productTotalAmount.toFixed(2):0.00}</i>
                    </div>
                    <div className="info-item">
                        <span>运费</span>
                        <i>¥ {orderDetail.freightAmount?orderDetail.freightAmount.toFixed(2):0.00}</i>
                    </div>
                    <div className="info-item">
                        <span>优惠劵抵扣金额</span>
                        <i>- {orderDetail.couponAmount?orderDetail.couponAmount.toFixed(2):0.00.toFixed(2)}</i>
                    </div>
                    <div className="info-item">
                        <span>余额抵扣金额</span>
                        <i>- {orderDetail.balanceDeductionAmount?orderDetail.balanceDeductionAmount.toFixed(2):0.00.toFixed(2)}</i>
                    </div>
                    <div className="info-item">
                        <span>优惠金额</span>
                        <i>- {orderDetail.discountAmount?orderDetail.discountAmount.toFixed(2):0.00.toFixed(2)}</i>
                    </div>
                    <div className="info-item">
                        <span>赠送积分</span>
                        <i>{orderDetail.obtainIntegral == null ? 0 : orderDetail.obtainIntegral} 积分</i>
                    </div>
                    <div className="payment">
                        <span>实付金额</span>
                        <i>¥ {orderDetail.payableAmount?orderDetail.payableAmount.toFixed(2):0.00}</i>
                    </div>
                </div>
                <div className="info-box">
                    <div className="info-item">
                        <span>订单编号</span>
                        <i>{orderDetail.orderNum}</i>
                    </div>
                    <div className="info-item">
                        <span>下单时间</span>
                        <i>{orderDetail.createTimeStr}</i>
                    </div>
                    <div className="info-item">
                        <span>服务商</span>
                        {orderDetail.platformType === "O2O" && <i>{orderDetail.shopName}</i>}
                        {orderDetail.platformType === "B2C" && <i>{orderDetail.chainName}</i>}
                    </div>
                    {orderDetail.remark &&<div className="info-item">
                        <span>备注信息</span>
                        <i>{orderDetail.remark}</i>
                    </div>}
                </div>
                {orderDetail.orderState !== "CLOSE" && orderDetail.isComment !== "Y" && <div className="dt-footer">
                    {(orderDetail.orderState === "UNPAID" || orderDetail.orderState === "WAIT_SEND") && <a className="md-btn1" onClick={()=>this.cancelOrder(orderDetail.orderId,orderDetail.orderState)}>取消订单</a>}
                    {orderDetail.orderState === "UNPAID" && <a className="md-btn2" onClick={()=>this.payNow(orderDetail.orderId,orderDetail.orderState)}>立即支付</a>}
                    {orderDetail.orderState === "WAIT_SEND" && orderDetail.platformType === "O2O" && orderDetail.isSelfExtract === "N" &&
                    <a className="md-btn2" onClick={() => this.props.actions.reminderOrder(orderDetail.orderId)}>催单</a>}
                    {orderDetail.orderState === "WAIT_SEND" && orderDetail.platformType === "B2C" && orderDetail.isRemind === "N" && <a className="md-btn2" onClick={()=>this.props.actions.reminderOrder(orderDetail.orderId)}>催单</a>}
                    {orderDetail.orderState === "SEND" && orderDetail.isSelfExtract === "N" && <a className="md-btn2"
                                                                                                  onClick={() => this.confirmOrder(orderDetail.orderId, orderDetail.orderState)}>确认收货</a>}
                    {orderDetail.orderState === "FINISH" && orderDetail.isComment === "N" && <a className="md-btn2" onClick={()=>this.commentOrder()}>评价</a>}
                </div>}
                <div className="hold-div-bottom"/>
            </div>
                {(orderDetail.orderState === "UNPAID" || orderDetail.orderState === "WAIT_SEND") &&
                <CancellationOrder classStyleOpen={classStyleOpen} orderId={orderDetail.orderId}
                                   callBack={cancelOrderCallBack} colseFun={() => {
                    this.classStyleOpenFun()
                }}/>}
                <div className="code-layer" style={{display: this.state.codeDisplay ? 'block' : 'none'}}>
                    <div className="code-box">
                        <div className="img-box">{orderDetail.selfExtractNum &&
                        <BarCode codeHeight={40} codeDisplayValue={true}
                                 codeNumber={parseInt(orderDetail.selfExtractNum)}/>}</div>
                        <a href="javascript:void(0)" className="close-btn" onClick={() => this.codeDisplayFun()}/>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        orderListState:store.orderListState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            handleImageErroredForProductDetail,
            confirmOrder,
            findOrderDetail,
            findOrderStatus,
            changeIsShowAllItem,
            reminderOrder
        }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);




