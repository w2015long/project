import {NORMAL_CART_SETTLEMENT_FREIGHT_INFO} from '../constants/ActionTypes';

/**
 * 显示运费信息
 * @param showFreight
 * @returns {Function}
 */
export function showFreight(showFreight = 'N') {
    return (dispatch) => {
        const action = {
            type: NORMAL_CART_SETTLEMENT_FREIGHT_INFO,
            showFreight: showFreight
        };

        dispatch(action);
    }
}