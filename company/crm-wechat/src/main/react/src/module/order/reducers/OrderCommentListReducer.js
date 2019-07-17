// 引入定义常量
import {
    EMPTY_OBJECT,
    GET_ORDER_COMMENT_LIST,
    ORDER_PRODUCT_COMMENT_ORDER_ID,
    ORDER_PRODUCT_COMMENT_IS_ANONYMITY,
    ORDER_PRODUCT_COMMENT_SERVICE_GRADE,
    ORDER_PRODUCT_COMMENT_DELIVERY_GRADE,
    ORDER_PRODUCT_COMMENT_LOGISTICS_GRADE,
    ORDE_RPRODUCT_COMMENT_LIST,
    PUBLISH_COMMENT_ORDER_INFORMATION
} from "../constants/ActionTypes";
import {PRODUCT_B2C_PRODUCT_LIST} from "../../product/constants/ActionTypes";


/**
 * @author liezihao
 * @data 2018/8/20
 */


// 定义初始化数据，对应Redycer.js内定义的key，数据最终给orderCommentListState组件使用
const orderCommentListState = {
    // 订单评论列表
    orderCommentList: {
        orderCommentListData: []
    },

    publishComment: {
        orderId: '',
        isAnonymity: 'N',

        orderComment: {
            serviceGrade: 5,
            deliveryGrade: 5,
            logisticsGrade: 5,
        },

        orderProductComments: []
    },

};

/**
 *  reducer 方法
 * @param state
 * @param action
 * @returns {*}
 */
export default function (state = orderCommentListState, action) {
    switch (action.type) {
        //发表评价 -清空对象
        case EMPTY_OBJECT:
            return Object.assign({}, state, {
                orderCommentList: [],
                publishComment: Object.assign({}, state.publishComment, {
                    orderProductComments: []
                })
            });
        case GET_ORDER_COMMENT_LIST:
            return Object.assign({}, state, {
                orderCommentList: action.data
            });
        //发表评价 -订单ID
        case ORDER_PRODUCT_COMMENT_ORDER_ID:
            return Object.assign({}, state, {
                publishComment: Object.assign({}, state.publishComment, {
                    orderId: action.orderId
                })
            });
        //发表评价 -是否匿名
        case ORDER_PRODUCT_COMMENT_IS_ANONYMITY:
            return Object.assign({}, state, {
                publishComment: Object.assign({}, state.publishComment, {
                    isAnonymity: action.isAnonymity
                })
            });
        //发表评价 -服务评分
        case ORDER_PRODUCT_COMMENT_SERVICE_GRADE:
            return Object.assign({}, state, {
                publishComment: Object.assign({}, state.publishComment, {
                    orderComment: Object.assign({}, state.publishComment.orderComment, {
                        serviceGrade: action.serviceGrade
                    })
                })
            });
        //发表评价 -发货评分
        case ORDER_PRODUCT_COMMENT_DELIVERY_GRADE:
            return Object.assign({}, state, {
                publishComment: Object.assign({}, state.publishComment, {
                    orderComment: Object.assign({}, state.publishComment.orderComment, {
                        deliveryGrade: action.deliveryGrade
                    })
                })
            });
        //发表评价 -物流评分
        case ORDER_PRODUCT_COMMENT_LOGISTICS_GRADE:
            return Object.assign({}, state, {
                publishComment: Object.assign({}, state.publishComment, {
                    orderComment: Object.assign({}, state.publishComment.orderComment, {
                        logisticsGrade: action.logisticsGrade
                    })
                })
            });

        //发表评价 -初始化商品评论对象
        case ORDE_RPRODUCT_COMMENT_LIST:
            return Object.assign({}, state, {
                publishComment: Object.assign({}, state.publishComment, {
                    orderProductComments: action.productInformation
                })
            });

        //发表评价 -订单信息
        case PUBLISH_COMMENT_ORDER_INFORMATION:
            return Object.assign({}, state, {
                publishComment: Object.assign({}, state.publishComment, {
                    publishComment: action.orderInformation
                })
            });

        default:
            return state;
    }
}