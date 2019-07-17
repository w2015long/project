import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import "../style/CouponExchangeList.css";
import {confirmCouponExchange, getMemberIntegral, pageCouponExchangeList} from "../actions/couponExchangeActions";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import EmptyPage from "../../common/components/EmptyPage";

//兑换优惠劵
class CouponExchangeList extends Component {

    constructor(props){
        super(props);
    }

    componentWillMount() {
        document.title = '积分换券';
        this.initData();
    }

    initData(){
        const {couponExchangePage} = this.props.couponExchangeState;
        this.props.actions.getMemberIntegral();//获取我的积分
        this.props.actions.pageCouponExchangeList(0, couponExchangePage.size);//获取优惠券列表
    }

    loadMoreData() {
        let {couponExchangePage} = this.props.couponExchangeState;
        this.props.actions.pageCouponExchangeList( couponExchangePage.page + 1, couponExchangePage.size,couponExchangePage.couponExchanges);
    }

    //兑换优惠劵
    exchangeCoupon(couponExchangeId, deductIntegral, exchangeableNum) {
        let self = this;
        const {myIntegral} = this.props.couponExchangeState;
        if (parseInt(myIntegral) < parseInt(deductIntegral)) {
            window.warningTip('积分不足，无法兑换');
            return;
        }
        if (parseInt(exchangeableNum) <= 0) {
            window.warningTip("抱歉,该优惠劵已兑完！");
            return ;
        }

        window.showConfirm(
            '确定使用' + deductIntegral + '积分兑换该优惠券吗',
            () => {
                self.props.actions.confirmCouponExchange(couponExchangeId, () => {
                    window.successTip("恭喜你,兑换成功");
                    self.initData();
                });
            }
        );
    }

    subString(text) {
        let subStr = "仅限";
        if (text.trim().length > 8) {
            subStr += text.trim().substring(0, 8);
            subStr += "...";
        } else {
            subStr += text.trim();
            subStr += "商品";
        }
        console.log(subStr);
        return subStr;
    }

    render() {
        const {couponExchangePage,myIntegral} = this.props.couponExchangeState;
        const isHaveNextPage = couponExchangePage.size * (couponExchangePage.page + 1) < couponExchangePage.recordsFiltered;

        return (
            <div className="exchange-coupon">
                <div className="points-coupon">
                    <div className="mt">
                        <i>我的积分</i><span>{myIntegral || 0}</span>
                    </div>
                    {couponExchangePage.length === 0 ? <EmptyPage/> :
                        <div className="mc" id="couponExchangeList">
                            {
                                couponExchangePage.couponExchanges.map(couponExchange => {
                                    return (
                                        <div className="item" key={couponExchange.couponExchangeId}>
                                            <div className="mlt"><span>{couponExchange.couponAmount}</span></div>
                                            {
                                                couponExchange.isLimitedUse === 'Y' ?
                                                    <p>订单满{couponExchange.orderFullAmountDouble}减{couponExchange.couponAmount}</p>
                                                    :
                                                    <p>订单立减{couponExchange.couponAmount}</p>
                                            }
                                            {couponExchange.isLimitedUse === 'Y' ?
                                                <span>满{couponExchange.orderFullAmount}可用</span> :
                                                <span>{couponExchange.isLimitedClassRange === 'Y' ? '限制商品可用' : '无限制门槛'}</span>}
                                            {couponExchange.isLimitedClassRange === 'Y' ?
                                                <span>{couponExchange.productNmList != null ? this.subString(couponExchange.productNmList[0]) : ""}</span> :
                                                <span>全品通用</span>}
                                            <div className="required">{couponExchange.deductIntegral + "积分"}</div>
                                            <a onClick={() => this.exchangeCoupon(couponExchange.couponExchangeId, couponExchange.deductIntegral, couponExchange.exchangeableNum)}
                                               className="exchange">立即兑换</a>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                    <AutoLoadMore loadMoreFunc={this.loadMoreData.bind(this)} isHaveNextPage={isHaveNextPage} container={'couponExchangeList'}/>
                </div>
            </div>
        )
    }
}

CouponExchangeList.propTypes = {};

CouponExchangeList.contextTypes = {

};

const mapStateToProps = (store, ownProps) => {
    return {
        couponExchangeState: store.couponExchangeState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pageCouponExchangeList,getMemberIntegral,confirmCouponExchange}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponExchangeList);