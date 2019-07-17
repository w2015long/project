/**
 * 优惠券大礼包详情
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/coupon-gift-pack-details.css";
import {wapFindCouponGiftPacksDetails,receiveCouponGiftPacks} from "../actions/couponGiftPackDetailsAction";
import Img from "../../common/components/Img.js"
import couponPicture from "../../../media/images/wsptp.png"
class CouponGiftPackDetails extends Component {
    componentWillMount() {
        document.title = "优惠券大礼包详情";
    }
    componentDidMount(){
        let couponGiftPacksId = this.props.match.params.couponGiftPacksId;
        this.props.actions.wapFindCouponGiftPacksDetails(couponGiftPacksId);
    }

    /**
     * 领券
     * @param couponGiftPacksId 大礼包Id
     */
    receiveCouponGiftPacks(couponGiftPacksId){
        this.props.actions.receiveCouponGiftPacks(couponGiftPacksId);
    }


    render() {
        const {couponDetails,receiveCoupon} = this.props.couponGiftPackDetailsState;
        const couponList = couponDetails.couponList || [];
        return (
            <div className="coupon-gift-pack-details">
                <div className="coupon-main">

                    <div className="inner">
                        <div className="wx-mask" style={{"display":" none"}}></div>

                        <div className="coupon-box">
                            <div className="inner">
                                <ul className="cp-ul">
                                    <div className="cc-title">
                                        <i className="title-i1"></i>
                                        <span>领取后可在优惠券中心查看</span>
                                        <i className="title-i2"></i>
                                    </div>

                                    {
                                        couponList.map((coupon)=>{
                                            return (
                                                <li className="list-item" key={coupon.couponId}>
                                                    <div className="cell-hd">
                                                        <div className="cont">
                                                            <Img src={couponPicture} alt=""/>
                                                        </div>
                                                    </div>
                                                    <div className="cell-bd">
                                                        <div className="bd-top">
                                                            <div className="title">
                                                                {coupon.applyProductType === 'ALL_PRODUCTS'&&<span className="tag">全品类</span>}
                                                                {coupon.couponName}
                                                            </div>
                                                            <div className="validity">
                                                                {coupon.couponType === 'FULL_REDUCE'&&<i>￥</i>}
                                                                {coupon.couponType === 'FULL_REDUCE'&&coupon.couponAmountDouble}

                                                                {coupon.couponType === 'DISCOUNT'&&coupon.couponDiscount}
                                                                {coupon.couponType === 'DISCOUNT'&&<i>折</i>}
                                                                <span>
                                                                    {coupon.isLimitedUse === 'Y' && "无限制"}
                                                                    {coupon.isLimitedUse === 'N' && "满"+coupon.orderFullAmountDouble+"元可用"}
                                                                    <i>|</i>
                                                                    <em>
                                                                         {coupon.isOnline === 'Y' && "线上券"}
                                                                         {coupon.isOffline === 'Y' && "线下券"}
                                                                         {(coupon.isOnline === 'Y'&& coupon.isOffline === 'Y') && "线上线下券"}
                                                                    </em>
                                                                </span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    {coupon.couponGiftCouponNum > 1 &&
                                                    <div className="state-box">
                                                        <span>
                                                            {coupon.couponGiftCouponNum}张
                                                        </span>
                                                    </div>
                                                    }
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
                {receiveCoupon === "TO_RECEIVE" && <div className="get-it-right-now" onClick={() => this.props.actions.receiveCouponGiftPacks(couponDetails.couponGiftPacksId)}>立即领取</div>};
                {receiveCoupon === "HAVE_RECEIVE" && <div className="get-it-right-now" onClick={() => {this.props.history.push('/shop/complaint/'+couponDetails.shopId) }}>前往门店</div>}
                {receiveCoupon === "FAILURE_RECEIVE" && <div className="get-it-right-now" onClick={() => {this.props.history.push('/index/receive/coupon/supportReceive')}}>领券中心</div>}
            </div>
        )

    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        couponGiftPackDetailsState: store.couponGiftPackDetailsState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({wapFindCouponGiftPacksDetails,receiveCouponGiftPacks}, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CouponGiftPackDetails);