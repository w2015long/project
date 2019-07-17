import {NORMAL_CART_SETTLEMENT_COUPON_SELECTOR_INFO, NORMAL_CART_SETTLEMENT_COUPON_SELECTOR_TAB_STATE} from "../constants/ActionTypes";

/**
 * 搜索优惠券
 * @param productTotalAmount    商品总金额
 * @param callbackFunc          回调方法
 * @returns {Function}
 */
export function searchCoupon(productTotalAmount = 0, callbackFunc = () => {}) {
    return(dispatch) => {
        const url = '/wap/coupon/searchCoupon?productTotalAmount='+productTotalAmount;
        window.jsonFetch(
            url,
            {},
            json => {
                let handEffectiveCoupon = 'N';
                let handInvalidCoupon = 'N';
                json.map(item => {
                    if(item.isEffective==='Y'){
                        handEffectiveCoupon = 'Y';
                    }else{
                        handInvalidCoupon = 'Y';
                    }
                });

                const action = {
                    type: NORMAL_CART_SETTLEMENT_COUPON_SELECTOR_INFO,
                    couponSelectorInfo: {
                        couponList: json,
                        couponActiveStatus: 'first',
                        handEffectiveCoupon: handEffectiveCoupon,
                        handInvalidCoupon: handInvalidCoupon,
                        callbackFunc: callbackFunc
                    }
                };

                dispatch(action);
            });
    };
}

/**
 * 切换 Tab
 * @param couponActiveStatus
 * @returns {Function}
 */
export function changeTab(couponActiveStatus = 'first') {
    return(dispatch) => {
        const action = {
            type: NORMAL_CART_SETTLEMENT_COUPON_SELECTOR_TAB_STATE,
            couponActiveStatus: couponActiveStatus    //TAB
        };

        dispatch(action);
    };
}

/**
 * 优惠券选中与取消选中
 * @param callbackFunc          优惠券选中或取消选中回调方法
 */
export function selectCoupon(callbackFunc = () => {}) {
    return(dispatch) => {
        const action = {
            type: NORMAL_CART_SETTLEMENT_COUPON_SELECTOR_INFO,
            couponSelectorInfo: {
                couponList: [],
                couponActiveStatus: 'first',    //TAB
                handEffectiveCoupon: 'N',       //是否有可用的优惠券
                handInvalidCoupon: 'N',         //是否有不可用的优惠券
                callbackFunc: () => {}
            }
        };

        dispatch(action);

        if (typeof callbackFunc === 'function'){
            callbackFunc();
        }
    }
}
