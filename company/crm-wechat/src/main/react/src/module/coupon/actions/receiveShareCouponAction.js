/**
 * 领取分享优惠卷
 */
import {
    RECEIVE_COUPONS_RESULT,
    RECEIVE_SHARE_COUPON_INFO
} from '../constants/ActionTypes';

/**
 * 查询优惠卷信息
 * @param couponShareCode 优惠券分享码
 */
export function queryCouponInfo(couponShareCode) {
    return (dispatch) =>  {
        const url = 'wap/couponGiftLog/receiveCoupon?couponShareCode=' + couponShareCode;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: RECEIVE_SHARE_COUPON_INFO,
                    data: json
                })
            });
    }
}

/**
 *  好友领取优惠卷
 * @param couponShareCode 优惠券分享码
 */
export function receiveCoupons(couponShareCode) {
    return (dispatch) => {
        const url = 'wap/couponGiftLog/receiveCouponFromFriend?couponShareCode=' + couponShareCode;
        window.textFetch(
            url,
            {},
            json => {
                const action = {
                    type: RECEIVE_COUPONS_RESULT,
                    data: {
                        receive_coupons_result : "success",
                        errorInfo:''
                    }
                };
                dispatch(action);
            },
            error => {
                const action = {
                    type: RECEIVE_COUPONS_RESULT,
                    data:{
                        receive_coupons_result:"exception",
                        errorInfo:error.errMsg
                    }
                };
                dispatch(action);
            }
        );
    }
}
