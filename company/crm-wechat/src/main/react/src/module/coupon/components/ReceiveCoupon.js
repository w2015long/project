/**
 * 领优惠券
 * Created by caixuan on 2018/4/9.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/receive-coupon.css';
import {listReceiveCoupon, updateReceiveCoupons} from "../actions/receiveCouponAction";
import EmptyPage from "../../common/components/EmptyPage";

class ReceiveCoupon extends Component {

    componentWillMount() {
        document.title = '领取优惠券';
        this.props.actions.listReceiveCoupon();
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
        const {couponList} = this.props.receiveCouponState;
        return (
            <div className="receive-coupon">
                <div className="mt">
                    <span>领取优惠券</span>
                </div>
                {couponList.length === 0 && <EmptyPage/>}
                <div className="mc">
                    {
                        couponList.map(coupon=>{
                            if(coupon.isOnlySupportOffline === 'N'){
                                return (
                                    <div className="item" key={coupon.couponId}>
                                        <div className="mlt"><span>{coupon.couponAmountDouble}</span></div>
                                        {
                                            coupon.isLimitedUse === 'Y' ?
                                                <p>订单满{coupon.orderFullAmountDouble}减{coupon.couponAmountDouble}</p>
                                                :
                                                <p>订单立减{coupon.couponAmountDouble}</p>
                                        }
                                        {coupon.isLimitedUse === 'Y' ? <span>满{coupon.orderFullAmountDouble}可用</span> :
                                            <span>{coupon.isLimitedClassRange === 'Y' ? '限制商品可用' : '无限制门槛'}</span>}
                                        {coupon.isLimitedClassRange === 'Y' ?
                                            <span>{coupon.productNmList != null ? this.subString(coupon.productNmList[0]) : ""}</span> :
                                            <span>全品通用</span>}
                                        <a onClick={() => this.props.actions.updateReceiveCoupons(coupon.couponId)}
                                           className="exchange">立即领取</a>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        receiveCouponState:store.receiveCouponState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({listReceiveCoupon,updateReceiveCoupons}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ReceiveCoupon);
