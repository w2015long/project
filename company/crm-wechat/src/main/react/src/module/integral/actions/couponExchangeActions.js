/**
 * 兑换优惠券
 * Created by wsh on 2018/4/3.
 */
import {
    COUPON_EXCHANGE_LIST,
    COUPON_EXCHANGE_LIST_INTEGRAL,

} from "../constants/ActionTypes";

/**
 * 兑换优惠劵列表
 * @param page
 * @param size
 * @param couponExchangeList
 * @returns {function(*)}
 */
export function pageCouponExchangeList(page, size, couponExchangeList = []) {
    return (dispatch) => {
        const url = '/wap/exchangeCoupon/pageExchangeCoupon?page=' + page + "&size=" + size;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: COUPON_EXCHANGE_LIST,
                    couponExchangePage: Object.assign({}, json, {
                        page: page,
                        size: size,
                        couponExchanges: couponExchangeList.concat(json.data)
                    })
                };
                dispatch(action);
            }
        );
    }
}

/**
 * 获取用户积分
 * @returns {function(*)}
 */
export function getMemberIntegral() {
    return (dispatch) => {
        const url = '/wap/exchangeCoupon/getMemberIntegral';
        window.textFetch(
            url, {}, json => {
                dispatch({
                     type: COUPON_EXCHANGE_LIST_INTEGRAL,
                    data: json
                })
            },
            error => {
                return true;
            }
        );
    }
}


/**
 * 确认兑换优惠劵
 * @param couponExchangeId
 * @param callback
 * @returns {function()}
 */
export function confirmCouponExchange(couponExchangeId, callback) {
    return (dispatch) => {
        const url = '/wap/exchangeCoupon/couponExchange?couponExchangeId=' + couponExchangeId;
        window.jsonFetch(
            url,
            {},
            json => {
                if (typeof callback === "function") {
                    callback();
                }
            },
        error =>{
            if(typeof error==='object' && error.errCode ==="COUPON_EXCEED_LARGEST_RECEIVE_NUM"){
                window.warningTip(error.errMsg);
                return false;
            }
        }
        );
    }
}