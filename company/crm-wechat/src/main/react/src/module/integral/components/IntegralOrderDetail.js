/**
 * @author chencheng
 * @date 2018/5/9
 * 积分订单详情
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import moment from 'moment'
import '../style/IntegralOrderDetail.css'
import {orderReceive, getIntegralOrderDetail} from '../actions/integralOrderActions'

class IntegralOrderDetail extends Component {

    state = {
        isShowAllOrderItems:false
    };

    componentWillMount() {
        document.title = "我的礼品";
        this.props.actions.getIntegralOrderDetail(this.props.match.params.id)
    }

    //渲染订单状态
    renderOrderState(order){
        if (order.isSent === 'N') {
            return (
                    <div className="current-status">
                        <p>待发货</p>
                        <span>卖家备货中，请耐心等待。</span>
                    </div>
                )
        }
        if (order.isReceived === 'N') {
            return (
                <div className="current-status">
                    <p>待发货</p>
                    <span>卖家已发货，等待送达。</span>
                </div>
            )
        }
        return (
            <div className="current-status">
                <p>已完成</p>
                <span>订单已交易成功！</span>
            </div>
        )
    }

    //渲染展开与收起按钮
    renderShowMore(itemsSize){
        if (itemsSize <= 2){
            return null;
        }
        if (this.state.isShowAllOrderItems){
            return (
                <div className="md" onClick={()=>{this.changeIsShowAllOrderItems(false)}}>
                    <a className="pack-up">收起</a>
                </div>
            )
        }else {
            return (
                <div className="md" onClick={()=>{this.changeIsShowAllOrderItems(true)}}>
                    <a className="more">展开</a>
                </div>
            )
        }
    }

    changeIsShowAllOrderItems(isShowAll){
        this.setState({isShowAllOrderItems:isShowAll});
    }

    //渲染订单操作按钮
    renderOrderButton(order){
        if (order.isSent === 'Y' && order.isReceived === 'N') {
            return (
                <div className="dt-footer">
                    <Link to={'/logistics/'+order.logisticsCompanyCode+'/'+order.logisticsOrderNum} className="md-btn1">查看物流</Link>
                    <a className="md-btn2" onClick={()=>this.orderReceive(order.integralOrderId)}>确认收货</a>
                </div>
            )
        }
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
                        self.props.actions.getIntegralOrderDetail(integralOrderId)
                    },1000);
                })
            });
    }


    render() {
        const order = this.props.integralOrderState.integralOrderDetail;
        const orderItems = order.orderItems || [];
        return (
            <div className="integral-order-detail">
                {this.renderOrderState(order)}
                <div className="consignee-addr">
                    <span style={{paddingRight:"0.5rem"}}>收货人: {order.receiverName}</span>
                    <span>{order.receiverMobile}</span>
                    <p>{order.receiverAddr}</p>
                </div>
                <div className="gd-cont">
                    <div className="gd-box">
                        <div className="mc">
                            {
                                orderItems.map((orderItem, index)=>{
                                    if (!this.state.isShowAllOrderItems && index > 1){
                                        return null;
                                    }
                                    return (
                                        <div className="item" key={index}>
                                            <div className="pic"><a><img src={orderItem.picFileUrl} alt=""/></a></div>
                                            <div className="title"><a>{orderItem.integralProductNm}</a></div>
                                            <div className="m-bot">
                                                <span className="font-size-15">{orderItem.integralPrice}积分</span>
                                                <i>x{orderItem.num}</i>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {this.renderShowMore(orderItems.length)}
                    </div>
                </div>
                <div className="info-box">
                    <div className="jf-payment">
                        <span>实付积分</span>
                        <i>{order.totalIntegral}</i>
                    </div>
                </div>
                <div className="info-box">
                    <div className="info-item">
                        <span>订单编号</span>
                        <i>{order.orderNum}</i>
                    </div>
                    <div className="info-item">
                        <span>下单时间</span>
                        <i>{moment(order.createTime).format('YYYY-MM-DD HH:mm:ss')}</i>
                    </div>
                </div>
                {this.renderOrderButton(order)}
                <div className="hold-div-bottom"/>
            </div>
        );
    }
}


IntegralOrderDetail.propTypes = {};

IntegralOrderDetail.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        integralOrderState: store.integralOrderState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getIntegralOrderDetail, orderReceive}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegralOrderDetail);
