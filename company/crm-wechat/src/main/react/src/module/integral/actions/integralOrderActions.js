/**
 * @author chencheng
 * @date 2018/4/3
 * 积分订单
 */

import {
    INTEGRAL_ORDER_LIST_PAGE_ORDER,
    INTEGRAL_ORDER_LIST_GET_NO_SENT_ORDER_QUANTITY,
    INTEGRAL_ORDER_LIST_GET_NO_RECEIVED_ORDER_QUANTITY,
    INTEGRAL_ORDER_LIST_CHANGE_SELECTED_ORDER_STATE,
    INTEGRAL_ORDER_GET_DETAIL
} from "../constants/ActionTypes";

/**
 * 获取积分订单
 */
export function pageIntegralOrder(pageNumber, pageSize, isSent, isReceived, oldContent=[]) {
    return (dispatch) => {
        const url = '/wap/integralOrder/pageIntegralOrder?page=' + pageNumber + "&size=" + pageSize+ "&isSent=" + isSent+ "&isReceived=" + isReceived;
        window.jsonFetch(
            url, {}, json => {
                const action = {
                    type:INTEGRAL_ORDER_LIST_PAGE_ORDER,
                    data:{
                        page:pageNumber,
                        size:pageSize,
                        content:oldContent.concat(json.data),
                        total:json.recordsFiltered
                    }
                };
                dispatch(action);
            }
        );
    }
}

/**
 * 获取未发货积分订单数量
 */
export function getNoSentQuantity() {
    return (dispatch) => {
        const url = '/wap/integralOrder/getNoSentQuantity';
        window.textFetch(
            url, {}, json => {
                const action = {
                    type:INTEGRAL_ORDER_LIST_GET_NO_SENT_ORDER_QUANTITY,
                    data:json
                };
                dispatch(action);
            }
        );
    }
}

/**
 * 获取未收货积分订单数量
 */
export function getNoReceivedQuantity() {
    return (dispatch) => {
        const url = '/wap/integralOrder/getNoReceivedQuantity';
        window.textFetch(
            url, {}, json => {
                const action = {
                    type:INTEGRAL_ORDER_LIST_GET_NO_RECEIVED_ORDER_QUANTITY,
                    data:json
                };
                dispatch(action);
            }
        );
    }
}


/**
 * 更改订单状态选中
 */
export function changeSelectedOrderState(orderState, callbackFunc) {
    return (dispatch) => {
        const action = {
            type:INTEGRAL_ORDER_LIST_CHANGE_SELECTED_ORDER_STATE,
            data:orderState
        };
        dispatch(action);
        if (typeof callbackFunc === "function"){
            callbackFunc();
        }
    }
}

/**
 * 订单收货
 */
export function orderReceive(integralOrderId, callbackFunc) {
    return (dispatch) => {
        const url = '/wap/integralOrder/orderReceive?integralOrderId='+integralOrderId;
        window.textFetch(
            url, {}, json => {
               if (typeof callbackFunc === 'function'){
                   callbackFunc();
               }
            }
        );
    }
}


/**
 * 订单详情
 */
export function getIntegralOrderDetail(integralOrderId) {
    return (dispatch) => {
        const url = '/wap/integralOrder/getIntegralOrderDetail?integralOrderId='+integralOrderId;
        window.textFetch(
            url, {}, json => {
               const action = {
                   type:INTEGRAL_ORDER_GET_DETAIL,
                   data:json
               };

               dispatch(action);
            }
        );
    }
}
