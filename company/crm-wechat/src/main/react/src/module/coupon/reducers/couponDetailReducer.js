import * as type from '../constants/ActionTypes';

const couponDetailState={

    //商品
    couponApplyProductSearchParam: { //优惠卷适用商品搜索参数
        page: 0,
        size:10,
        couponPermissionId:null, //优惠券适用权限ID
        couponId: null //优惠券ID
    },
    couponApplyProductPage:{  //优惠卷适用商品分页
        page:0,
        size:10,
        content:[],
        recordsFiltered:0
    },

    //优惠卷适用门店
    couponApplyStore: [],


    tabButton:'product', //tab按钮
};

export default function (state = couponDetailState, action) {
    switch (action.type) {
        case type.COUPON_APPLY_PRODUCT_PAGE:
            return Object.assign({},state,{
                couponApplyProductPage:action.data
            });
        case type.CHANGE_TAB_BUTTON:
            return Object.assign({},state,{
                tabButton:action.data
            });
        case type.COUPON_APPLY_STORE_LIST:
            return Object.assign({},state,{
                couponApplyStore:action.data
            });
        default:
            return state;
    }
}
