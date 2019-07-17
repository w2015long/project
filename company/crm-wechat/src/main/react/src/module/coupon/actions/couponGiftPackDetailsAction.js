/**
 * 优惠券大礼包
 */
import {
    COUPON_GIFT_PACK_DETAILS,
    RECEIVE_COUPON_GIFT_PACK,
} from '../constants/ActionTypes';

/**
 * 查询优惠券详情
 * @param couponGiftPacksId 大礼包Id
 */
export function wapFindCouponGiftPacksDetails(couponGiftPacksId) {
    return (dispatch) => {
        const url = 'wap/couponGiftPacks/wapFindCouponGiftPacksDetails?couponGiftPacksId=' + couponGiftPacksId;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: COUPON_GIFT_PACK_DETAILS,
                    data: json
                })
            });
    }
}

/**
 * 领取优惠卷礼包
 * @param couponGiftPacksId 大礼包Id
 */
export function receiveCouponGiftPacks(couponGiftPacksId) {
    return (dispatch) => {
        const url = 'wap/couponGiftPacks/receiveCouponGiftPacks?couponGiftPacksId=' + couponGiftPacksId;
        window.textFetch(
            url,
            {},
            json => {
                window.successTip("领取成功");
                const action = {
                    type: RECEIVE_COUPON_GIFT_PACK,
                    data: "HAVE_RECEIVE"
                };
                dispatch(action);
            },
            error => {
                const action = {
                    type: RECEIVE_COUPON_GIFT_PACK,
                    data: "FAILURE_RECEIVE"
                };
                dispatch(action);
            }
        );
    }
}
