/**
 * 领取优惠券
 * Created by caixuan on 2018/4/9.
 */
import * as types from "../constants/ActionTypes";
/**
 * 用户可领的优惠券列表
 * @returns {function(*)}
 */
export function listReceiveCoupon() {
    return (dispatch) => {
        const url = 'wap/coupon/findReceiveCoupons';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: types.COUPON_GET_RECEIVE_COUPON_LIST,
                    data:json
                })
            });
    }
}

/**
 * 领券
 * @param couponId
 * @returns {function(*)}
 */
export function updateReceiveCoupons(couponId) {
    return (dispatch) => {
        const url = 'wap/coupon/updateReceiveCoupons?couponId=' + couponId;
        window.textFetch(
            url,
            {},
            json => {
                window.successTip("已领取");
            },
            error => {
                if(typeof error==='object' && error.errCode ==="MEMBER_ALREADY_RECEIVE_COUPON"){
                    window.warningTip("您已经领取过该券!");
                    return false;
                }else
                    return true;
            });
    }

}