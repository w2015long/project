/**
 * 个人中心-优惠券列表
 * Created by caixuan on 2018/3/28.
 */
import {COUPON_LIST_GET_LIST,COUPON_LIST_CHANGE_TYPE} from '../constants/ActionTypes';

/**
 * 优惠券列表
 * @param isUse 已经使用
 * @param isEffective 已经过期
 * @returns {function(*)}
 */
export function pageCoupon(isUse, isEffective) {
    return (dispatch) => {
        const url = 'wap/member/findMemberCoupon?isUse=' + isUse + "&isEffective=" + isEffective;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: COUPON_LIST_GET_LIST,
                    data:json
                })
            });
    }
}

/**
 * 切换优惠券列表tab
 * @param param
 */
export function changeCouponType(param) {
    return function (dispatch) {
        dispatch({
            type: COUPON_LIST_CHANGE_TYPE,
            data: param
        })
    }
}

