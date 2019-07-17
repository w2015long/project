import {NORMAL_CART_SETTLEMENT_PAY_BY_BALANCE_INFO} from '../constants/ActionTypes';

/**
 * 显示余额支付
 * @param showPayByBalance
 * @param callbackFunc
 * @returns {Function}
 */
export function showPayByBalance(showPayByBalance = 'N', callbackFunc = () => {}) {
    return (dispatch) => {
        const action = {
            type: NORMAL_CART_SETTLEMENT_PAY_BY_BALANCE_INFO,
            showPayByBalance: showPayByBalance,
            callbackFunc: callbackFunc
        };

        dispatch(action);
    }
}