/**
 * @author chencheng
 * @date 2018/4/3
 * 积分商品订单（我的礼品）
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AutoLoadMore from '../../common/components/AutoLoadMore'
import EmptyPage from "../../common/components/EmptyPage";

import '../../common/style/swiper.min.css'
import '../style/IntegralOrderList.css'
import {pageIntegralOrder, getNoReceivedQuantity, getNoSentQuantity, changeSelectedOrderState, orderReceive} from '../actions/integralOrderActions'

class IntegralOrderList extends Component {
    componentWillMount() {
        document.title = "我的礼品";
        this.reloadIntegralOrder();
    }

    pageIntegralOrder(page, content) {
        const size = this.props.integralOrderState.integralOrderPage.size;
        const selectOrderState = this.props.integralOrderState.selectOrderState;
        let isSent = null, isReceived = null;
        if (selectOrderState === 'noSent'){
            isSent = "N";
            isReceived = null;
        }else if (selectOrderState === 'noReceived'){
            isSent = 'Y';
            isReceived = 'N';
        }else if (selectOrderState === 'finish'){
            isSent = 'Y';
            isReceived = 'Y';
        }
        this.props.actions.pageIntegralOrder(page, size, isSent, isReceived, content);
    }

    reloadIntegralOrder(){
        this.pageIntegralOrder(0, []);
        this.props.actions.getNoSentQuantity();
        this.props.actions.getNoReceivedQuantity();
    }
    loadMoreIntegralOrder(){
        const {page, content} = this.props.integralOrderState.integralOrderPage;
        this.pageIntegralOrder(page+1, content)
    }

    changeOrderState(orderState){
        let self = this;
        this.props.actions.changeSelectedOrderState(orderState, function () {
            setTimeout(function () {
                self.reloadIntegralOrder();
            }, 100)
        });
    }
    /**
     * 确认收货
     */
    orderReceive(integralOrderId){
        let self = this;
        window.showConfirm(
            '确定已经收到礼品？',
            ()=>{
                this.props.actions.orderReceive(integralOrderId, function () {
                    window.successTip('收货成功！');
                    setTimeout(function () {
                        self.reloadIntegralOrder();
                    },1000);
                })
            });
    }

    //订单状态
    getOrderState(order) {
        if (order.isSent === 'N') {
            return <span className="yello-color">待发货</span>
        }
        if (order.isReceived === 'N') {
            return <span className="yello-color">待收货</span>
        }
        return <span>已完成</span>
    }

    //订单商品数量
    getOrderProductQuantity(order) {
        let quantity = 0;
        let orderItems = order.orderItems || [];
        for (let orderItem of orderItems){
            quantity += orderItem.num;
        }
        return quantity;
    }
    //订单按钮
    getOrderButton(order){
        if (order.isSent === 'Y' && order.isReceived === 'N') {
            return (
                <div>
                    <Link to={'/logistics/'+order.logisticsCompanyCode+'/'+order.logisticsOrderNum} className="md-btn1">查看物流</Link><a className="md-btn2" onClick={()=>this.orderReceive(order.integralOrderId)}>确认收货</a>
                </div>
            )
        }
    }
    render() {
        const {integralOrderPage, noSentQuantity, noReceivedQuantity, selectOrderState} = this.props.integralOrderState;
        const orders = integralOrderPage.content || [];
        const isHaveNextPage = (integralOrderPage.page + 1) * (integralOrderPage.size) < integralOrderPage.total;

        return (
            <div className="integral-order-list">
                <div className="tab-tit swiper-container">
                    <ul className="tab-nav swiper-wrapper clearfix">
                        <li className={selectOrderState === 'all' ? "swiper-slide cur":"swiper-slide"} onClick={()=>this.changeOrderState('all')}>
                            <a>全部</a>
                        </li>
                        <li className={selectOrderState === 'noSent' ? "swiper-slide cur":"swiper-slide"} onClick={()=>this.changeOrderState('noSent')}>
                            <a>待发货{noSentQuantity && noSentQuantity > 0 ? <span>{noSentQuantity}</span> : ''}</a>
                        </li>
                        <li className={selectOrderState === 'noReceived' ? "swiper-slide cur":"swiper-slide"} onClick={()=>this.changeOrderState('noReceived')}>
                            <a>待收货{noReceivedQuantity && noReceivedQuantity > 0 ? <span>{noReceivedQuantity}</span> : ''}</a>
                        </li>
                        <li className={selectOrderState === 'finish' ? "swiper-slide cur":"swiper-slide"} onClick={()=>this.changeOrderState('finish')}>
                            <a>已完成</a>
                        </li>
                    </ul>
                </div>
                {orders.length === 0 ? <EmptyPage/> : <div className="gd-cont" id="integralOrderList">
                    {
                        orders.map((order) => {
                            return (
                                <div className="gd-box" key={order.integralOrderId} >
                                    <div className="mt">
                                        <div className="order-number">订单号：{order.orderNum}</div>
                                        {this.getOrderState(order)}
                                    </div>
                                    <div className="mc" onClick={()=>this.props.history.push('/integral/order/detail/'+order.integralOrderId)}>
                                        {
                                            order.orderItems.map((orderItem) => {
                                                return (
                                                    <div className="item" key={orderItem.integralProductId}>
                                                        <div className="pic"><a><img src={orderItem.picFileUrl} alt=""/></a>
                                                        </div>
                                                        <div className="title"><a>{orderItem.integralProductNm}</a>
                                                        </div>
                                                        <div className="m-bot">
                                                            <span>{orderItem.integralPrice}积分</span>
                                                            <i>x{orderItem.num}</i>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="md">
                                        <p>商品数量 <span>{this.getOrderProductQuantity(order)}</span> 应付总积分：<i>{order.totalIntegral}</i></p>
                                        {this.getOrderButton(order)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>}


                <AutoLoadMore container={'integralOrderList'} isHaveNextPage={isHaveNextPage}
                              loadMoreFunc={() => this.loadMoreIntegralOrder()}/>
            </div>
        );
    }
}


IntegralOrderList.propTypes = {};

IntegralOrderList.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        integralOrderState: store.integralOrderState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pageIntegralOrder, getNoSentQuantity, getNoReceivedQuantity, changeSelectedOrderState, orderReceive}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegralOrderList);
