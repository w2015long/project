import * as type from '../constants/ActionTypes';

const couponState={
    //个人中心-积分记录部分
    pageIntegralRecord:{    //积分记录分页
        page:0,
        size:10,
        content:[],
        recordsFiltered:0
    },
    transType:"",//充值:RECHARGE,扣费:DEDUCT_MONEY
    showTransType:false,//是否展示右上角类型

    //个人中心-我的积分部分
    pageIntegralProduct:{   //推荐商品分页
        page:0,
        size:10,
        content:[],
        recordsFiltered:0
    },
    myIntegral:"",          //我的积分
};

export default function (state = couponState, action) {
    switch (action.type) {
        case type.INTEGRAL_RECORD_GET_PAGE:
            return Object.assign({},state,{
                pageIntegralRecord:action.data
            });
        case type.INTEGRAL_RECORD_RECORD_TYPE_IS_SHOW:
            return Object.assign({},state,{
                showTransType:!state.showTransType
            });
        case type.INTEGRAL_RECORD_CHANGE_TRANS_TYPE:
            return Object.assign({},state,{
                transType:action.data
            });
        case type.MEMBER_CENTER_INTEGRAL_GET_INTEGRAL_PRODUCT:
            return Object.assign({},state,{
                pageIntegralProduct:action.data
            });
        case type.MEMBER_CENTER_INTEGRAL_GET_MY_INTEGRAL:
            return Object.assign({},state,{
                myIntegral:action.data
            });
        default:
            return state;
    }
}
