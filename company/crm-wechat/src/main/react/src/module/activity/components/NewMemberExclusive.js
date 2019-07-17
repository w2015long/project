import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import privilege640x480 from "../../../media/images/privilege640x480.jpg";
import newExclusive from "../../../media/images/newExclusive.png";
import "../style/NewMemberExclusive.css";
import {getNewMemberExclusiveInitData} from "../actions/newMemberExclusiveAction";


class NewMemberExclusive extends Component {

    state = {};

    componentWillMount() {
        document.title = "新会员专题";
        // 初始化页面数据
        this.props.actions.getNewMemberExclusiveInitData();
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    gotoCouponList() {
        this.props.history.push('/index/receive/coupon/supportReceive');
    }

    gotoProductDetail(productId, shopId) {
        this.props.history.push('/product/detail/' + productId + '/O2O/' + shopId);
    }

    gotoProductList() {
        this.props.history.push('/product/list/shop');
    }

    render() {
        const {couponList, discountProductList} = this.props.newMemberExclusiveState;
        console.log(couponList);
        console.log(discountProductList);
        return (
            <div className="new_member_topic">
                <div className="topic_ad"><img src={privilege640x480}/></div>
                <div className="mc">
                    <div className="cont">
                        {/*<div className="mc-hd"><span>已得1000元优惠券</span></div>
                        <div className="coupon-box">
                            {
                                couponList.map((coupon, index) => {
                                    return (
                                        <div className="item" key={index} onClick={() => {
                                            this.gotoCouponList()
                                        }}>
                                            <div className="mlt">
                                                <i>￥</i>
                                                <span>{coupon.couponAmountDouble}</span>
                                            </div>
                                            <div className="mrt">
                                                <p>满{coupon.orderFullAmountDouble}可用</p>
                                                <p>{coupon.isLimitedClassRange != "Y" ? "全场可用" : "指定商品可用"}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>*/}
                        <div className="mc-hd"><span>新人专享钜惠</span></div>
                        <div className="theme-box">
                            {
                                discountProductList.map((discountProduct, index) => {
                                    //价格格式化输出
                                    let firstSellPrice, secondSellPrice;
                                    let sellPriceDouble = discountProduct.couponAfterPrice || discountProduct.couponAfterPrice;
                                    if (sellPriceDouble) {
                                        const sellPriceDoubles = sellPriceDouble.toFixed(1).split(".");
                                        firstSellPrice = sellPriceDoubles[0];
                                        secondSellPrice = sellPriceDoubles[1];
                                    } else {
                                        firstSellPrice = 0;
                                        secondSellPrice = 0;
                                    }
                                    return <div className="item" key={index}
                                                onClick={() => this.gotoProductDetail(discountProduct.productId, discountProduct.shopId)}>
                                        <div className="pic">
                                            <a href="javascript:void(0)">
                                                <img src={discountProduct.pictureUrl}/>
                                            </a>
                                        </div>
                                        <div className="title">
                                            <a href="javascript:void(0)">{discountProduct.productNm}</a>
                                        </div>
                                        <div className="price">
                                            <i>¥</i>
                                            <span>{firstSellPrice}</span>
                                            <i>.{secondSellPrice}</i>
                                            <img className="new-exclusive" src={newExclusive}/>
                                        </div>
                                        <div className="original-price">原价￥{discountProduct.couponBeforePrice}</div>
                                        <a href="javascript:void(0)" className="buy-btn">立即抢购</a>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        newMemberExclusiveState: store.newMemberExclusiveState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getNewMemberExclusiveInitData
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMemberExclusive);

