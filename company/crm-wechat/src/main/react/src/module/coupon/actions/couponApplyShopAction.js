/**
 * 个人中心-优惠券-适用门店列表
 * Created by caixuan on 2018/3/28.
 */
import {COUPON_APPLY_SHOP_LIST} from '../constants/ActionTypes';


/**
 *  优惠券适用门店列表
 */
export function findCouponApplyShopList(couponId,mapLocation) {
    return (dispatch) => {
        const url = 'wap/member/getMemberApplyShopList?couponId='+couponId+"&mapLocation=" + mapLocation;
        window.jsonFetch(
            url,
            {
            },
            json => {
                dispatch({
                    type: COUPON_APPLY_SHOP_LIST,
                    data:json
                })
            });
    }
}