/**
 * 订单列表
 * Created by caixuan on 2018/4/2.
 */
import * as type from '../constants/ActionTypes';
import defaultProductPic from "../../../media/images/default-product-pic.jpg";

/**
 * 改变tab栏订单的搜索状态
 * @returns {Function}
 */
export function changeTabOrderState(orderState) {
    return function (dispatch) {
        dispatch({
            type:type.CHANGE_TAB_ORDER_STATE,
            data:orderState
        })
    }
}

/**
 * 订单列表
 * @param pageOrder 分页对象
 * @param state 订单状态
 * @param isComment 是否已经评价
 */
export function pageOrder(pageOrder,state,isComment) {
    return (dispatch) => {
        const url = '/wap/order/pageOrder?page=' + pageOrder.page + "&size=" + pageOrder.size+ "&orderState=" + state +"&isComment="+isComment;
        window.jsonFetch(
            url, {}, json => {
                dispatch({
                    type: type.ORDER_GET_ORDER_PAGE,
                    data: {
                        page: pageOrder.page,
                        size: pageOrder.size,
                        content: pageOrder.content.concat(json.data),
                        recordsFiltered: json.recordsFiltered
                    }
                })
            }
        );
    }
}

/**
 * 不同状态的订单数量
 * @returns {function(*)}
 */
export function getOrderCountByState() {
    return (dispatch) => {
        const url = '/wap/order/findOrderCountByType';
        window.jsonFetch(
            url, {}, json => {
                dispatch({
                    type: type.ORDER_GET_ORDER_COUNT_BY_ORDER_STATE,
                    data: json
                })
            }
        );
    }
}

/**
 * 改变订单列表页标题下拉框显示隐藏状态
 * @returns {Function}
 */
export function changeShowTitleState(data) {
    return function (dispatch) {
        dispatch({
            type:type.ORDER_LIST_CHANGE_TITLE_SHOW_STATE,
            data:data
        })
    }
}

/**
 * 改变订单状态
 * @returns {Function}
 */
export function changeOrderState(data,isComment) {
    return function (dispatch) {
        dispatch({
            type:type.ORDER_LIST_CHANGE_ORDER_STATE,
            data:data,
            isComment:isComment
        })
    }
}

/**
 * 取消订单
 * @param orderId 订单号
 * @param closeReason 取消原因
 * @param callBack 回调函数
 */
export function confirmCancelOrderFun(orderId, closeReason, callBack) {
    return (dispatch) => {
        // 发送请求
        const url = '/wap/order/cancelOrder?orderId=' + orderId + "&closeReason=" + closeReason;
        window.textFetch(
            url, {}, json => {
                callBack();
                window.successTip("取消订单成功");
            }
        );
    }
}

/**
 * 催单
 * @param orderId
 * @param callBack
 */
export function reminderOrder(orderId,callBack) {
    return (dispatch) => {
        const url = '/wap/order/reminderOrder?orderId='+orderId;
        window.textFetch(
            url, {}, json => {
                window.successTip("催单成功");
                if(typeof callBack === 'function'){
                    callBack();
                }
            },
            error=>{
                if(typeof error==='object' && error.errCode ==="REMIND_ORDER_TIME_TOO_SHORT"){
                    window.warningTip("催单时间间隔不能小于两小时");
                    return false;
                }else
                    return true;
            }
        );
    }
}

/**
 * 确认订单送达
 * @param orderId
 * @param callBack
 */
export function confirmOrder(orderId,callBack) {
    return (dispatch) => {
        window.showConfirm("是否确认收货?",()=>{
            const url = '/wap/order/confirmArriveOrder?orderId='+orderId;
            window.textFetch(
                url, {}, json => {
                    callBack();
                    window.successTip("已确认收货");
                }
            );
        });
    }
}

/**
 * 订单详情
 * @param orderId
 */
export function findOrderDetail(orderId) {
    return (dispatch) => {
        const url = '/wap/order/findOrderDetail?orderId='+orderId;
        window.textFetch(
            url, {}, json => {
                dispatch({
                    type:type.ORDER_DETAIL_GET_ORDER_DETAIL,
                    data:json
                })
            }
        );
    }
}
/**
 * 订单详情
 * @param orderId
 * @param callBack 回调函数
 */
export function findOrderStatus(orderId,callBack=()=>{}) {
    return (dispatch) => {
        const url = '/wap/order/findOrderStatus?orderId='+orderId;
        window.textFetch(
            url, {}, json => {
                callBack(json);
            }
        );
    }
}

/**
 * 是否展示所有订单项
 */
export function changeIsShowAllItem(data) {
    return (dispatch) => {
        dispatch({
            type:type.ORDER_DETAIL_CHANGE_IS_SHOW_ALL_ITEM,
            data:data
        })
    }
}

export function handleImageErrored(pageOrder,listIndex,goodsIndex){

    let contents = pageOrder.content || [];

    contents.map((content,contentIndex) => {
        if(contentIndex ===listIndex){
            let orderItems = content.orderItems || [];
            orderItems.map((good, orderItemsIindex) => {
                if (orderItemsIindex === goodsIndex) {
                    good.picture = defaultProductPic;
                }
            });
        }

    });

    return function (dispatch) {
        dispatch({
            type: type.ORDER_GET_ORDER_PAGE,
            data: pageOrder
        });
    }
}
export function handleImageErroredForProductDetail(orderDetail,index){

    const items = orderDetail.orderItemProtocols||[];
    items.map((good, newIindex) => {
        if (newIindex === index) {
            good.picture = defaultProductPic;
        }
    });
    return function (dispatch) {
        dispatch({
            type:type.ORDER_DETAIL_GET_ORDER_DETAIL,
            data:orderDetail
        });
    }
}
