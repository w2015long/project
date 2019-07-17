import {
    NEW_COUPON_LIST_GET_PAGE,
    COUPON_CATEGORY_LIST,
    CHANGE_COUPON_CATEGORY,
    COUPON_APPLY_SHOP_LIST
}  from "../constants/ActionTypes"
import * as type from "../constants/ActionTypes";

const newCouponState ={
    // 优惠券数据
    couponPage:{
        page: 0,
        size: 10,
        recordsFiltered:0,
        coupons: []
    },

    // 优惠券分类
    couponCateGoryList:[],

    // 优惠券搜索参数
    couponSearch:{
        couponCategoryId:null,      // 优惠券分类Id,
        acquireEntrance:"",         // 线上线下卷

        page: 0,
        size: 10,
        content: [],
        total: 0
    },

    // 优惠券分类关系
    couponCategoryId:null,

    applyShopList:[],
};

export default function (state = newCouponState, action) {
    switch (action.type) {
        case NEW_COUPON_LIST_GET_PAGE:
            return Object.assign({},state,{
                couponPage:action.data
            });
        case COUPON_CATEGORY_LIST:
            return Object.assign({},state,{
                couponCateGoryList:action.data
            });
        case CHANGE_COUPON_CATEGORY:
            return Object.assign({},state,{
                couponCategoryId:action.data
            });
        case COUPON_APPLY_SHOP_LIST:
            return Object.assign({},state,{
                applyShopList:action.data
            });
        default:
            return state;
    }
}