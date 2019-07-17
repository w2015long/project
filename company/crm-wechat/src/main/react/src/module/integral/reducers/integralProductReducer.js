/**
 * @author chencheng
 * @date 2018/4/02
 * 积分商品列表
 */

import {
    INTEGRAL_PRODUCT_GET_DETAIL,
    INTEGRAL_PRODUCT_GET_MY_INTEGRAL,
    INTEGRAL_PRODUCT_GET_PRODUCT_PAGE,
    INTEGRAL_PRODUCT_UPDATE_SELECTED_PRODUCTS
} from '../constants/ActionTypes'

const integralProductState = {
    myIntegral: 0,          //我的积分
    integralProductPage: {//积分商品列表
        page: -1,
        size: 5,
        content: [],
        total: 0
    },
    selectedIntegralProducts: [],//已选择的积分商品列表

    integralProductDetail: {}//积分商品详情
};


export default function (state = integralProductState, action) {
    switch (action.type) {
        case INTEGRAL_PRODUCT_GET_MY_INTEGRAL:
            return Object.assign({}, state, {
                myIntegral: action.data
            });
        case INTEGRAL_PRODUCT_GET_PRODUCT_PAGE:
            return Object.assign({}, state, {
                integralProductPage: action.data
            });
        case INTEGRAL_PRODUCT_UPDATE_SELECTED_PRODUCTS:
            return Object.assign({}, state, {
                selectedIntegralProducts: action.data
            });
        case INTEGRAL_PRODUCT_GET_DETAIL:
            return Object.assign({}, state, {
                integralProductDetail: action.data
            });
        default:
            return state;
    }
}
