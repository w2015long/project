/**
 * Created by liezihao on 2018/8/20
 * 我的评价-评论详情
 * orderCommentList
 */
// 引入定义常量
import {
    GET_ORDER_COMMENT_LIST
} from "../constants/ActionTypes";
import * as type from "../constants/ActionTypes";



//初始化页面时把对象清空
export function emptyObject() {
    return (dispatch) => {
        dispatch({
            type:type.EMPTY_OBJECT
        });
    }
}


//获取评论预先展示信息
export function orderCommentList(orderId,callBack=()=>{}) {
    return (dispatch) => {
        const url = '/wap/orderProductComment/getCommentPreviousData';
        window.textFetch(
            url, {
                method: 'POST',
                body: JSON.stringify(orderId)
            }, json => {
                const action = {
                    type:GET_ORDER_COMMENT_LIST,
                    data:json
                };
                callBack(json);
                dispatch(action);
            }
        );
    }
}


//保存发表评价
export function savePublishComment(order,loadPageCallBack=()=>{}) {
    return (dispatch) => {
        const url = '/wap/orderProductComment/savePublishComment';
        window.textFetch(
            url, {
                method: 'POST',
                body: JSON.stringify(order)
            }, json => {
                loadPageCallBack();
            }
        );
    }
}

/**
 *  发表评价 -订单ID
 */
export function changeGetOrderId(orderId) {
    return function (dispatch) {
        dispatch({
            type:type.ORDER_PRODUCT_COMMENT_ORDER_ID,
            orderId:orderId
        })
    }
}

/**
 *  发表评价 -是否匿名
 */
export function changeGetIsAnonymity(isAnonymity) {
    return function (dispatch) {
        dispatch({
            type:type.ORDER_PRODUCT_COMMENT_IS_ANONYMITY,
            isAnonymity:isAnonymity
        })
    }
}

/**
 *  发表评价 -服务评分
 */
export function changeGetServiceGrade(serviceGrade) {
    return function (dispatch) {
        dispatch({
            type:type.ORDER_PRODUCT_COMMENT_SERVICE_GRADE,
            serviceGrade:serviceGrade
        })
    }
}

/**
 *  发表评价 -发货评分
 */
export function changeGetDeliveryGrade(deliveryGrade) {
    return function (dispatch) {
        dispatch({
            type:type.ORDER_PRODUCT_COMMENT_DELIVERY_GRADE,
            deliveryGrade:deliveryGrade
        })
    }
}

/**
 *  发表评价 -物流评分
 */
export function changeGetLogisticsGrade(logisticsGrade) {
    return function (dispatch) {
        dispatch({
            type:type.ORDER_PRODUCT_COMMENT_LOGISTICS_GRADE,
            logisticsGrade:logisticsGrade
        })
    }
}

/**
 * 发表评价 -初始化商品评论对象
 */
export function orderProductCommentList(productInformation) {
    return function (dispatch) {
        dispatch({
            type:type.ORDE_RPRODUCT_COMMENT_LIST,
            productInformation:productInformation
        })
    }
}

/**
 * 发表评价 -订单信息
 */
export function publishCommentOrderInformation(orderInformation,implementSavePublishComment=()=>{}) {
    return function (dispatch) {
        dispatch({
            type:type.PUBLISH_COMMENT_ORDER_INFORMATION,
            orderInformation:orderInformation
        });
        implementSavePublishComment();
    }
}


