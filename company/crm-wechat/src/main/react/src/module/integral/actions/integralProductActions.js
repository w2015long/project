/**
 * @author chencheng
 * @date 2018/4/2
 * 积分商品
 */

import {
    INTEGRAL_PRODUCT_GET_DETAIL,
    INTEGRAL_PRODUCT_GET_MY_INTEGRAL,
    INTEGRAL_PRODUCT_GET_PRODUCT_PAGE,
    INTEGRAL_PRODUCT_UPDATE_SELECTED_PRODUCTS
} from "../constants/ActionTypes";

//获取我的总积分
export function getMemberIntegral() {
    return (dispatch) => {
        const url = '/wap/integral/getMemberIntegral';
        window.textFetch(
            url, {}, json => {
                const action = {
                    type: INTEGRAL_PRODUCT_GET_MY_INTEGRAL,
                    data: json
                };
                dispatch(action);
            }
        );
    }
}

/**
 * 获取积分商品
 */
export function pageIntegralProduct(pageNumber, pageSize, oldContent=[]) {
    return (dispatch) => {
        const url = '/wap/integral/pageIntegralProduct?page=' + pageNumber + "&size=" + pageSize;
        window.jsonFetch(
            url, {}, json => {
                const action = {
                    type:INTEGRAL_PRODUCT_GET_PRODUCT_PAGE,
                    data:{
                        page:pageNumber,
                        size:pageSize,
                        content:oldContent.concat(json.data),
                        total:json.recordsFiltered
                    }
                };
                dispatch(action);
            }
        );
    }
}

/**
 * 更新已选择积分商品
 */
export function updateSelectedIntegralProducts(selectedIntegralProducts) {
    return dispatch=>{
        const action = {
            type:INTEGRAL_PRODUCT_UPDATE_SELECTED_PRODUCTS,
            data:selectedIntegralProducts
        };

        dispatch(action);
    }
}

/**
 * 获取积分商品详情
 */
export function getIntegralProductDetail(integralProductId) {
    return (dispatch) => {
        const url = '/wap/integral/getIntegralProductDetail?integralProductId=' + integralProductId;
        window.jsonFetch(
            url, {}, json => {
                const action = {
                    type:INTEGRAL_PRODUCT_GET_DETAIL,
                    data:json
                };
                dispatch(action);
            }
        );
    }
}