/**
 * 订单列表
 * Created by caixuan on 2018/4/2.
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/order-list.css";
import "../../../module/common/style/swiper.min.css";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import EmptyPage from "../../common/components/EmptyPage";
import {Link} from "react-router-dom";
import {
    changeOrderState,
    changeShowTitleState,
    changeTabOrderState,
    confirmOrder,
    getOrderCountByState,
    handleImageErrored,
    pageOrder,
    reminderOrder
} from "../actions/orderListActions";
import {initJsSdk, wxPay} from "../../common/actions/jssdkAction";
import defaultProductPic from "../../../media/images/default-product-pic.jpg";
import CancellationOrder from "./CancellationOrder";

class OrderList extends Component {
    state = {
        classStyleOpen: false, // 取消原因模态框开关
        cancelOrderCallBack: () => {
        }, // 取消订单的回调函数
        orderId: null, // 订单对象
        cancelOrderState: "" // 取消订单的状态
    };

    componentWillMount() {
        this.isPaying = false;
        document.title = '订单列表';
        const {changeTabOrderState} = this.props.orderListState;
        let {orderState} = this.props.match.params;
        if(changeTabOrderState){
            orderState = changeTabOrderState;
        }else if(orderState === 'all'){
            orderState = '';
        }
        let isComment = '';
        if("WAIT_COMMENT" === orderState){//待评价状态: 未评价的已完成订单
            isComment = "N";
            orderState="FINISH";
        }

        this.props.actions.changeOrderState(orderState,isComment);
        this.freshOrderPage(orderState,isComment);
    }

    //当组件要被从界面上移除的时候，调用
    componentWillUnmount(){
        const {actions} = this.props;
        //组件由浏览器返回操作导致卸载操作,则清理结算页
        if( this.props.history.action ==="POP"){
            actions.changeTabOrderState("");
        }
    }

    componentDidMount(){
        new window.Swiper('.tab-tit',{
            freeMode : true,
            slidesPerView : 'auto'
        });
        initJsSdk();
    }
    /**
     * 刷新列表
     */
    freshOrderPage(orderState,isComment){
        console.log("刷新列表");
        this.props.actions.pageOrder({page:0,size:10,content:[],recordsFiltered:0},orderState,isComment);
        this.props.actions.getOrderCountByState();
    }

    /**
     * 点击切换订单状态
     * @param orderState 订单状态
     * @param isComment 是否评价
     */
    clickChangeOrder(orderState,isComment=""){
        if(isComment === "N"){//待评价状态: 未评价的已完成订单
            this.props.actions.changeTabOrderState("WAIT_COMMENT");
        }else {
            this.props.actions.changeTabOrderState(orderState);
        }

        this.freshOrderPage(orderState,isComment);
        this.props.actions.changeOrderState(orderState,isComment);
        this.props.actions.changeShowTitleState(false);
    }


    /**
     * 加载更多方法
     */
    loadMore = () => {
        const {pageOrder, orderState,isComment} = this.props.orderListState;
        pageOrder.page += 1;
        return this.props.actions.pageOrder(pageOrder,orderState,isComment);
    };

    /**
     * 取消订单
     */
    cancelOrder(orderId,orderState){
        /*return this.props.actions.cancelOrder(orderId,()=>{this.freshOrderPage(orderState,"")});*/

        console.log(this.props.orderListState.orderState);
        this.setState({
            classStyleOpen: true,
            orderId: orderId,
            cancelOrderState: orderState,
            cancelOrderCallBack: () => {
                this.freshOrderPage(this.props.orderListState.orderState, "");
                this.setState({classStyleOpen: false});
            }
        });
    }

    remindB2cOrder(orderId,orderState){
        return this.props.actions.reminderOrder(orderId,()=>{this.freshOrderPage(orderState,"")});
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
        let history = this.props.history;
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

    /**
     * 确认订单
     */
    confirmOrder(orderId,orderState){
        return this.props.actions.confirmOrder(orderId,()=>{this.freshOrderPage(orderState,"")});
    }

    /**
     * 评价订单
     * */
    commentOrder(orderId, orderState) {
        this.props.history.push("/order/comment/" + orderId + "/" + orderState);
    }

    /**
     * 取消订单模态框回调设置
     */
    classStyleOpenFun() {
        this.setState({classStyleOpen: false});
    }

    static buildOrderState(orderState,isComment){
        switch (orderState){
            case "UNPAID":
                return "待付款";
            case "WAIT_SEND":
                return "待发货";
            case "SEND":
                return "已发货";
            case "FINISH":
                if(isComment === "N"){
                    return "待评价";
                }
                return "已完成";
            case "CLOSE":
                return "已关闭";
            default:return "";
        }
    }

    render() {
        const {pageOrder,orderState,isShowTitle,orderCount,isComment} = this.props.orderListState;
        const content = pageOrder.content;
        const isHaveNextPage = pageOrder.size * (pageOrder.page + 1) < pageOrder.recordsFiltered;
        const {actions} = this.props;
        const classStyleOpen = this.state.classStyleOpen;
        const cancelOrderCallBack = this.state.cancelOrderCallBack;
        const orderId = this.state.orderId;
        const cancelOrderState = this.state.cancelOrderState;
        return(
            <div className="order-list-main">
                <div className="order-list">
                    <div className="hold-div-top"/>
                    <div className="tab-tit">
                        <ul className="tab-nav swiper-wrapper clearfix">
                            <li className={orderState?"swiper-slide":"swiper-slide cur"}>
                                <a onClick={()=>this.clickChangeOrder("")}>全部</a>
                            </li>
                            <li className={orderState === "UNPAID"?"swiper-slide cur":"swiper-slide"}>
                                <a onClick={()=>this.clickChangeOrder("UNPAID")}>待付款{orderCount.unpaidCount > 0 && <span>{orderCount.unpaidCount}</span>}</a>
                            </li>
                            <li className={orderState === "WAIT_SEND"?"swiper-slide cur":"swiper-slide"}>
                                <a onClick={()=>this.clickChangeOrder("WAIT_SEND")}>待发货{orderCount.waitSendCount > 0 &&<span>{orderCount.waitSendCount}</span>}</a>
                            </li>
                            <li className={orderState === "SEND"?"swiper-slide cur":"swiper-slide"}>
                                <a onClick={()=>this.clickChangeOrder("SEND")}>待收货{orderCount.sendCount > 0 &&<span>{orderCount.sendCount}</span>}</a>
                            </li>
                            <li className={orderState === "FINISH" && isComment === "N"?"swiper-slide cur":"swiper-slide"}>
                                <a onClick={()=>this.clickChangeOrder("FINISH","N")}>待评价{orderCount.waitCommentCount > 0 &&<span>{orderCount.waitCommentCount}</span>}</a>
                            </li>
                            <li className={orderState === "FINISH"?"swiper-slide cur":"swiper-slide"}>
                                <a onClick={()=>this.clickChangeOrder("FINISH")}>已完成</a>
                            </li>
                            <li className={orderState === "CLOSE"?"swiper-slide cur":"swiper-slide"}>
                                <a onClick={()=>this.clickChangeOrder("CLOSE")}>已取消</a>
                            </li>
                        </ul>

                        <div className={isShowTitle?"more active":"more"} ref="title" >
                            <i onClick={()=>this.props.actions.changeShowTitleState(!isShowTitle)}/>
                            <div className="more-box">
                                <span onClick={()=>this.clickChangeOrder("")} className={orderState?"":"selected"}>全部</span>
                                <span onClick={()=>this.clickChangeOrder("UNPAID")} className={orderState === "UNPAID"?"selected":""}>待付款</span>
                                <span onClick={()=>this.clickChangeOrder("WAIT_SEND")} className={orderState === "WAIT_SEND"?"selected":""}>待发货</span>
                                <span onClick={()=>this.clickChangeOrder("SEND")} className={orderState === "SEND"?"selected":""}>待收货</span>
                                <span onClick={()=>this.clickChangeOrder("FINISH")} className={orderState === "FINISH"?"selected":""}>已完成</span>
                                <span onClick={()=>this.clickChangeOrder("FINISH","N")} className={orderState === "FINISH" && isComment === "N"?"selected":""}>待评价</span>
                                <span onClick={()=>this.clickChangeOrder("CLOSE")} className={orderState === "CLOSE"?"selected":""}>已取消</span>
                            </div>
                        </div>
                        <div className="mask-layer"/>
                    </div>
                    {content.length === 0 ? <EmptyPage/>:<div className="gd-cont" id="orderList">
                        {
                            content.map((order,listIndex)=>{
                                return (
                                    <div className="gd-box" key={order.orderId}>
                                        <div className="mt">
                                            <div className="name">
                                                {order.platformType === "O2O" && <Link to={"/shop/detail/"+order.shopId}>{order.shopName}</Link>}
                                                {order.platformType === "B2C" && <a>{order.chainName}</a>}
                                                </div>
                                            <span className="yello-color">{OrderList.buildOrderState(order.orderState,order.isComment)}</span>
                                        </div>
                                        <div className="mc">
                                            <Link to={"/order/detail/"+order.orderId}>
                                                {
                                                    order.orderItems.map((goods,goodsIndex)=>{
                                                        if(goodsIndex < 2){
                                                            return (
                                                                <div className="item" key={goodsIndex}>
                                                                    <div className="pic"><img  onError={()=>{actions.handleImageErrored(pageOrder,listIndex,goodsIndex)}}  src={goods.picture?goods.picture:defaultProductPic} alt=""/></div>
                                                                    <div className="title"><p>{goods.productName}</p></div>
                                                                    <div className="m-bot">
                                                                        <span>单价: ￥{goods.buyUnitPrice}</span>
                                                                        <i>x{goods.quantity}</i>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Link>
                                        </div>
                                        <div className="md">
                                            <p>共 <span>{order.orderItems.length}</span> 种商品
                                                应付款:<span>￥</span><i>{order.payableAmountDouble.toFixed(2).toString().split(".")[0]}</i><span>.{order.payableAmountDouble.toFixed(2).toString().split(".")[1]}</span>
                                            </p>
                                            {(order.orderState === "UNPAID" || order.orderState === "WAIT_SEND") && <a className="md-btn1" onClick={()=>this.cancelOrder(order.orderId,order.orderState)}>取消订单</a>}
                                            {order.orderState === "UNPAID" && <a className="md-btn2" onClick={()=>this.payNow(order.orderId,order.orderState)}>立即支付</a>}
                                            {order.orderState === "WAIT_SEND" && order.platformType === "O2O" && order.isSelfExtract === "N" &&
                                            <a className="md-btn2"
                                               onClick={() => this.props.actions.reminderOrder(order.orderId)}>催单</a>}
                                            {order.orderState === "WAIT_SEND" && order.platformType === "B2C" && order.isRemind === "N" && <a className="md-btn2" onClick={()=>this.remindB2cOrder(order.orderId,order.orderState)}>催单</a>}
                                            {order.orderState === "SEND" && order.isSelfExtract === "N" &&
                                            <a className="md-btn2"
                                               onClick={() => this.confirmOrder(order.orderId, order.orderState)}>确认收货</a>}
                                            {order.orderState === "FINISH" && order.isComment === "N" && <a className="md-btn2" onClick={()=>this.commentOrder(order.orderId,order.orderState)}>评价</a>}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {content.length > 0 &&
                        <AutoLoadMore isHaveNextPage={isHaveNextPage} loadMoreFunc={this.loadMore}
                                      container="orderList"/>}
                    </div>}
                    {(cancelOrderState === "UNPAID" || cancelOrderState === "WAIT_SEND") &&
                    <CancellationOrder classStyleOpen={classStyleOpen} orderId={orderId} callBack={cancelOrderCallBack}
                                       colseFun={() => {
                                           this.classStyleOpenFun()
                                       }}/>}
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
            changeTabOrderState,
            pageOrder,
            handleImageErrored,
            getOrderCountByState,
            changeShowTitleState,
            changeOrderState,
            confirmOrder,
            reminderOrder
        }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderList);

