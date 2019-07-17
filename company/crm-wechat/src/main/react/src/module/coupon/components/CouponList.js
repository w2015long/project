/**
 * 个人中心-优惠券列表
 * Created by caixuan on 2018/3/28.
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/my-coupon.css";
import {changeCouponType, pageCoupon,} from "../actions/couponActions";
import EmptyPage from "../../common/components/EmptyPage";
import {Link} from "react-router-dom";

class CouponList extends Component {

    componentWillMount() {
        document.title = "优惠券列表";
    }

    changeCouponType(param){
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
        const {couponList,isUse,isEffective} = this.props.couponState;
        return (
            <div className="coupon-list">
                <EmptyPage emptyTipText={"强劲优惠券功能即将发布！！！"}/>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        couponState:store.couponState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pageCoupon,changeCouponType}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CouponList);
