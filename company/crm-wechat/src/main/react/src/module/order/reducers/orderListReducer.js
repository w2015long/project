/**
 * 订单列表-数据中心
 * Created by caixuan on 2018/4/2.
 */
import * as type from '../constants/ActionTypes';

const orderListState={
    pageOrder:{    //订单列表分页
        page:0,
        size:10,
        content:[],
        recordsFiltered:0
    },
    orderState:"",  //订单状态:待支付,待发货,已发货,已完成,已取消,待评价
    isComment:"",
    isShowTitle:false, //是否显示头部下拉框
    orderCount:{
        waitSendCount:0,
        sendCount:0,
        unpaidCount:0
    },
    orderDetail:{orderItemProtocols:[]},//订单详情
    isShowAllOrderItems:false,
    changeTabOrderState : "",
};

export default function (state = orderListState, action) {
    switch (action.type) {
        case type.CHANGE_TAB_ORDER_STATE:
            return Object.assign({},state,{
                changeTabOrderState:action.data
            });
        case type.ORDER_GET_ORDER_COUNT_BY_ORDER_STATE:
            return Object.assign({},state,{
                orderCount:action.data
            });
        case type.ORDER_GET_ORDER_PAGE:
            return Object.assign({},state,{
                pageOrder:action.data
            });
        case type.ORDER_LIST_CHANGE_TITLE_SHOW_STATE:
            return Object.assign({},state,{
                isShowTitle:action.data
            });
        case type.ORDER_LIST_CHANGE_ORDER_STATE:
            return Object.assign({},state,{
                orderState:action.data,
                isComment:action.isComment
            });
        case type.ORDER_DETAIL_GET_ORDER_DETAIL:
            return Object.assign({},state,{
                orderDetail:action.data
            });
        case type.ORDER_DETAIL_CHANGE_IS_SHOW_ALL_ITEM:
            return Object.assign({},state,{
                isShowAllOrderItems:action.data
            });
        default:
            return state;
    }
}
