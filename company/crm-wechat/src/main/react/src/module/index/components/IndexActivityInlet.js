import React from 'react';
import PropTypes from 'prop-types';
import receiveCoupon from "../../../media/images/receiveCoupon.png";
import receiveIntegral from "../../../media/images/receiveIntegral.png";
import bargain from "../../../media/images/bargain.png";
import yaozixun from "../../../media/images/yaozixun.png";
import xianshangjuan from "../../../media/images/xianshangjuan.png";
import xianxiajuan from "../../../media/images/xianxiajuan.png";
import "../style/indexActivityInlet.css";

/**
 * 首页活动入口
 */


const IndexActivityInlet = ({ history,callbackOpenCoupon}) => {
    return (

        <div className="home_entrance indexActivityInletDivBlock">

            <div className="entrance_item" onClick={() => {callbackOpenCoupon()}}>
                <div className="entrance_item_t">
                    <img src={receiveCoupon}/>
                </div>
                <div className="entrance_item_b">领优惠券</div>
            </div>

            <div className="entrance_item" onClick={() => history.push('/member/integral/sign')}>
                <div className="entrance_item_t">
                    <img src={receiveIntegral}/>
                </div>
                <div className="entrance_item_b">领积分</div>
            </div>

            <div className="entrance_item" onClick={() => history.push('/bargain/bargainActivity')}>
                <div className="entrance_item_t">
                    <img src={bargain}/>
                </div>
                <div className="entrance_item_b">砍价免单</div>
                <div className="tips">火爆</div>
            </div>

            <div className="entrance_item" onClick={() => history.push('/ydy/patient/list')}>
                <div className="entrance_item_t">
                    <img src={yaozixun}/>
                </div>
                <div className="entrance_item_b">在线问诊</div>
            </div>

        </div>
    );
};
IndexActivityInlet.propTypes={
    callbackOpenCoupon:PropTypes.func,
};

export default IndexActivityInlet