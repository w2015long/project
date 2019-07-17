/**
 * 取消订单组件
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import "../style/cancellation-order.css";
import PropTypes from 'prop-types';
import {confirmCancelOrderFun} from "../actions/orderListActions";

class CancellationOrder extends Component {

    //组件作用域内的一个组件状态，react的核心
    state = {
        itemCur: 1,
        closeReason: "",
        orderDetail: {orderState: "UNPAID"}

    };

    /**
     * 取消原因选择
     */
    itemCurFun(index, closeReason) {
        this.setState({itemCur: index, closeReason: closeReason});
    }

    confirmFun(orderId) {
        this.props.actions.confirmCancelOrderFun(orderId, this.state.closeReason, this.props.callBack)
    }

    render() {
        let itemCur = this.state.itemCur;
        let classStyleOpen = this.props.classStyleOpen;
        let orderId = this.props.orderId;
        return (
            <div className="cancellation-order">
                <div className="reason-layer" style={{"display": "block"}} hidden={!classStyleOpen}>
                    <div className="reason-box">
                        <div className="mt">取消订单
                            <Link to="javascript:void(0)" className="close" onClick={() => this.props.colseFun()}/>
                        </div>
                        <div className="mc">
                            <div className={itemCur === 1 ? "item cur" : "item"}>
                                <a onClick={() => this.itemCurFun(1, "我不想买了")}>我不想买了</a>
                            </div>
                            <div className={itemCur === 2 ? "item cur" : "item"}>
                                <a onClick={() => this.itemCurFun(2, "信息填写错误，重新拍")}>信息填写错误，重新拍</a>
                            </div>
                            <div className={itemCur === 3 ? "item cur" : "item"}>
                                <a onClick={() => this.itemCurFun(3, "卖家缺货")}>卖家缺货</a>
                            </div>
                            <div className={itemCur === 4 ? "item cur" : "item"}>
                                <a onClick={() => this.itemCurFun(4, "同城见面交易")}>同城见面交易</a>
                            </div>
                            <div className={itemCur === 5 ? "item cur" : "item"}>
                                <a onClick={() => this.itemCurFun(5, "其他原因")}>其他原因</a>
                            </div>
                        </div>
                        <div className="md">
                            <a onClick={() => {
                                this.confirmFun(orderId)
                            }}>确认
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/*组件属性类型*/
CancellationOrder.propTypes = {
    /*布尔类型 控制弹窗显示*/
    classStyleOpen: PropTypes.bool,
    /*对象类型 订单详情*/
    orderId: PropTypes.number,
    /*函数类型 设置模态框开关*/
    colseFun: PropTypes.func,
    /*函数类型 确认取消的回调函数*/
    callBack: PropTypes.func,
};

const mapStateToProps = (store, ownProps) => {
    return {
        orderListState: store.orderListState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({confirmCancelOrderFun}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CancellationOrder);

