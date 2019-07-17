import * as type from '../constants/ActionTypes';

const couponState={
    isUse:"N",
    isEffective:"",
    myCouponListCurrentCouponType: "ONLINE",
    myCouponList:{
        page: 0,
        size: 10,
        content: [],
        total: 0
    },
    couponDetail:null,

};

export default function (state = couponState, action) {
    switch (action.type) {
        case type.COUPON_LIST_GET_LIST:
            return Object.assign({},state,{
                couponList:action.data
            });
        case type.COUPON_LIST_CHANGE_TYPE:
            return Object.assign({},state,{
                isUse:action.data.isUse,
                isEffective:action.data.isEffective
            });
        case type.MY_COUPON_LIST_SWITCH_CURRENT_COUPON_TYPE:
            return Object.assign({},state,{
                myCouponListCurrentCouponType:action.data,
            });
        case type.MY_COUPON_LIST_PAGE_COUPON_LIST:
            return Object.assign({},state,{
                myCouponList:action.data
            });
        case type.MY_COUPON_DETAIL_GET_DATA:
            return Object.assign({},state,{
                couponDetail:action.data
            });
        default:
            return state;
    }
}
