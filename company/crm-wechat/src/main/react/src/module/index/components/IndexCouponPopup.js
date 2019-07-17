import React from 'react';
import PropTypes from 'prop-types';
import xianshangjuan from "../../../media/images/xianshangjuan.png";
import xianxiajuan from "../../../media/images/xianxiajuan.png";
import "../style/IndexCouponPopup.css";

const IndexCouponPopup = ({ history,couponPopup,callbackCloseCoupon}) => {
    this.jump = function () {
        callbackCloseCoupon();
        history.push("/coupon/receive/list/OFFLINE")
    };

    this.jumpUp = function () {
        callbackCloseCoupon();
        history.push("/coupon/receive/list/ONLINE")
    };

    return (
        <div className={couponPopup?"new-pop-ups ":"new-pop-ups coupon-hide"}>
            <div className="item">
                <div className="item-top">
                    <div className="touch-area" onClick={() =>this.jumpUp()}>
                        <div className="touch-area-pic">
                            <img src={xianshangjuan} alt=""/>
                        </div>
                        <div className="touch-area-text">线上券</div>
                    </div>
                    <div className="touch-area" onClick={() => this.jump()}>
                        <div className="touch-area-pic">
                            <img src={xianxiajuan} alt=""/>
                        </div>
                        <div className="touch-area-text">线下券</div>
                    </div>
                </div>
                <div className="item-bottom" onClick={()=>{callbackCloseCoupon()}}>取消</div>
            </div>
        </div>
    )
};

IndexCouponPopup.propTypes={
    couponPopup:PropTypes.bool.isRequired,
    callbackCloseCoupon:PropTypes.func,
};

export default IndexCouponPopup;