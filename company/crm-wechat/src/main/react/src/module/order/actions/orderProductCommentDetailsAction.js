/**
 * Created by liezihao on 2018/8/16
 * 我的评价-评论详情
 * orderProductCommentDetailsAction
 */
// 引入定义常量
import {
    ORDER_PRODUCT_COMMENT_DETAILS
} from "../constants/ActionTypes";



export function getOrderProductCommentDetails(orderCommentId) {
    return (dispatch) => {
        const url = '/wap/orderProductComment/getOrderProductCommentDetails?orderCommentId='+orderCommentId;
        window.textFetch(
            url, {}, json => {
                const action = {
                    type:ORDER_PRODUCT_COMMENT_DETAILS,
                    data:json
                };

                dispatch(action);
            }
        );
    }
}