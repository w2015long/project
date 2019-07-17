/**
 * @author chencheng
 * @date 2018/4/03
 * 积分订单
 */

import {
    INTEGRAL_ORDER_LIST_PAGE_ORDER,
    INTEGRAL_ORDER_LIST_GET_NO_SENT_ORDER_QUANTITY,
    INTEGRAL_ORDER_LIST_GET_NO_RECEIVED_ORDER_QUANTITY,
    INTEGRAL_ORDER_LIST_CHANGE_SELECTED_ORDER_STATE,
    INTEGRAL_ORDER_GET_DETAIL
} from '../constants/ActionTypes'

const integralOrderState = {
    integralOrderPage: {//积分订单列表
        page: -1,
        size: 5,
        content: [],
        total: 0
    },
    noSentQuantity: 0,//未发货数量
    noReceivedQuantity: 0,//未收货数量
    selectOrderState: 'all',//选中的订单状态：all-全部、noSent-未发货、noReceived-未收货、finish-完成

    integralOrderDetail: {}//积分订单详情
};


export default function (state = integralOrderState, action) {
    switch (action.type) {
        case INTEGRAL_ORDER_LIST_PAGE_ORDER:
            return Object.assign({}, state, {
                integralOrderPage: action.data
            });
        case INTEGRAL_ORDER_LIST_GET_NO_SENT_ORDER_QUANTITY:
            return Object.assign({}, state, {
                noSentQuantity: action.data
            });
        case INTEGRAL_ORDER_LIST_GET_NO_RECEIVED_ORDER_QUANTITY:
            return Object.assign({}, state, {
                noReceivedQuantity: action.data
            });
        case INTEGRAL_ORDER_LIST_CHANGE_SELECTED_ORDER_STATE:
            return Object.assign({}, state, {
                selectOrderState: action.data
            });
        case INTEGRAL_ORDER_GET_DETAIL:
            return Object.assign({}, state, {
                integralOrderDetail: action.data
            });
        default:
            return state;
    }
}
