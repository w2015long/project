import {
    CHANGE_COMMENT_POINT_SEARCH_PAGE,
    CHANGE_CURRENT_GRADE,
    CHANGE_IS_SHOW_INSTRUCTIONS,
    PRODUCT_ALL_COMMENT,
    PRODUCT_B2C_PRODUCT_LIST,
    PRODUCT_CHANGE_B2C_PRODUCT_SEARCH_PARAMS,
    PRODUCT_CHANGE_IS_SHOW_DELETE_BTN_FOR_INPUT,
    PRODUCT_CHANGE_SHOP_PRODUCT_SEARCH_PARAMS,
    PRODUCT_DETAIL_DATA,
    PRODUCT_FREQUENTLY_MGR_CATEGORY,
    PRODUCT_GRADE_COMMENT,
    PRODUCT_MGR_CATEGORYS,
    PRODUCT_SCAN_INFO,
    PRODUCT_SELL_CATEGORYS,
    PRODUCT_SHOP_PRODUCT_LIST,
    SHIFT_PRODUCT_DETAIL_TAB,
    SUPPORT_SHOP_IDS,
    NEW_PRODUCT_SHOP_PRODUCT_LIST,
    NEW_PRODUCT_CHANGE_SHOP_PRODUCT_SEARCH_PARAMS,
    COUPON_PRODUCT_EMPLOY_DETAILS,
    COUPON_SHORT_MONEY,
    COUPON_PRODUCT_MONEY,
} from "../constants/ActionTypes";
import {COUPON_LIST_GET_LIST} from "../../coupon/constants/ActionTypes";

/**
 * 更改门店商品搜索参数
 */
export function changeShopProductSearchParams(params) {
    return (dispatch) => {
        dispatch({
            type: PRODUCT_CHANGE_SHOP_PRODUCT_SEARCH_PARAMS,
            data: params
        });
    }
}

/**
 * 更改门店商品搜索参数-支持优惠券
 */
export function newChangeShopProductSearchParams(params) {
    return (dispatch) => {
        dispatch({
            type: NEW_PRODUCT_CHANGE_SHOP_PRODUCT_SEARCH_PARAMS,
            data: params
        });
    }
}

/**
 * 查找门店商品
 */
export function newPageShopProduct(params, page, size, productList=[]) {
    return (dispatch) => {
        const url = '/wap/product/newPageWapProduct';
        let data = Object.assign({}, params, {page:page, size:size});

        window.jsonFetch(
            url,
            {
                method:'post',
                body:JSON.stringify(data)
            },
            json => {
                const action = {
                    type: NEW_PRODUCT_SHOP_PRODUCT_LIST,
                    data: {
                        page: page,
                        size: size,
                        recordsFiltered:json.recordsFiltered,
                        products:productList.concat(json.data)
                    }
                };
                dispatch(action)
            }
        );
    }
}

/**
 * 查找优惠券详情
 */
export function wapFindCouponProductEmployDetails(couponId) {
        return (dispatch) => {
            const url = 'wap/coupon/wapFindCouponProductEmployDetails?couponId=' + couponId ;
            window.jsonFetch(
                url,
                {},
                json => {
                    dispatch({
                        type: COUPON_PRODUCT_EMPLOY_DETAILS,
                        data:json
                    })
                });
        }
}

/**
 * 改变优惠券金额
 */
export function changeCouponDistanceEmployMoney(params) {
    return (dispatch) => {
        dispatch({
            type: COUPON_SHORT_MONEY,
            data: params
        });
    }
}
/**
 * 改变总金额
 */
export function changeCouponEmployAllMoney(params) {
    return (dispatch) => {
        dispatch({
            type: COUPON_PRODUCT_MONEY,
            data: params
        });
    }
}


/**
 * 查找门店商品
 */
export function pageShopProduct(params, page, size, productList=[]) {
    return (dispatch) => {
        const url = '/wap/product/pageWapProduct';
        let data = Object.assign({}, params, {page:page, size:size});

        window.jsonFetch(
            url,
            {
                method:'post',
                body:JSON.stringify(data)
            },
            json => {
                const action = {
                    type: PRODUCT_SHOP_PRODUCT_LIST,
                    data: {
                        page: page,
                        size: size,
                        recordsFiltered:json.recordsFiltered,
                        products:productList.concat(json.data)
                    }
                };
                dispatch(action)
            }
        );
    }
}

/**
 * 常用分类列表
 */
export function listFrequentlyMgrCategory() {
    return (dispatch) => {
        const url = '/wap/product/listFrequentlyMgrCategory';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: PRODUCT_FREQUENTLY_MGR_CATEGORY,
                    data: json
                })
            }
        );
    }
}

/**
 * 更改B2C商品搜索参数
 */
export function changeB2cProductSearchParams(params) {
    return (dispatch) => {
        dispatch({
            type: PRODUCT_CHANGE_B2C_PRODUCT_SEARCH_PARAMS,
            data: params
        });
    }
}

/**
 * 查找b2c商品
 */
export function pageB2cProduct(params, page, size, productList=[]) {
    return (dispatch) => {
        dispatch(changeB2cProductSearchParams(params));
        const url = '/wap/product/pageWapProduct';
        let data = Object.assign({}, params, {page:page, size:size});

        window.jsonFetch(
            url,
            {
                method:'post',
                body:JSON.stringify(data)
            },
            json => {
                const action = {
                    type: PRODUCT_B2C_PRODUCT_LIST,
                    data: {
                        page: page,
                        size: size,
                        recordsFiltered:json.recordsFiltered,
                        products:productList.concat(json.data)
                    }
                };
                dispatch(action)
            }
        );
    }
}

/**
 * 加载商品销售分类（包含分类商品数量统计）
 */
export function listSellCategoryToCount(keywords,isOnlyShop) {
    return (dispatch) => {
        const url = '/wap/product/listSellCategoryToCount?keywords=' + keywords +'&isOnlyShop='+isOnlyShop;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: PRODUCT_SELL_CATEGORYS,
                    data: json
                })
            }
        );
    }
}

/**
 * 加载商品管理分类
 */
export function listMgrCategory() {
    return (dispatch) => {
        const url = '/wap/product/listMgrCategory';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: PRODUCT_MGR_CATEGORYS,
                    data: json
                })
            }
        );
    }
}

/**
 * 获取商品详情
 */
export function getProductDetail(productId, platformType, shopId = "", callBackFun = () => {}, failedBackFun = () => {}) {
    return (dispatch) => {
        const url = '/wap/product/getProductDetail?productId=' + productId + '&platformType=' + platformType + '&shopId=' + shopId;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: PRODUCT_DETAIL_DATA,
                    data: json
                });
                callBackFun(json);
            },
            err => {
                failedBackFun();
            }
        );
    }
}

/**
 * 根据条形码获取商品详情
 */
export function findProductScanInfo(anccCode, callBackFun = () => {
}) {
    return (dispatch) => {
        const url = '/wap/product/findProductScanInfo?anccCode=' + anccCode + '&platformType=O2O';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: PRODUCT_SCAN_INFO,
                    data: json
                });
                callBackFun(json);
            }
        );
    }
}

/**
 * 更改商品评论搜索参数
 */
export function changeCommentPointSearchPage(params) {
    return (dispatch) => {
        dispatch({
            type: CHANGE_COMMENT_POINT_SEARCH_PAGE,
            data: params
        });
    }
}

/**
 * 通过分页参数查找商品评论
 * @param params
 * @param page
 * @param size
 * @returns {Function}
 */
export function pageProductCommentByGrade(params, page, size, productGradeComments = []) {

    return (dispatch) => {
        const url = '/wap/product/pageProductCommentByGrade';
        let data = Object.assign({}, params, {page: page, size: size});
        window.jsonFetch(
            url,
            {
                method: 'post',
                body: JSON.stringify(data)
            },
            json => {
                dispatch({
                    type: PRODUCT_GRADE_COMMENT,
                    data: Object.assign({}, params, {
                        page: page,
                        size: size,
                        recordsFiltered: json.recordsFiltered,
                        productGradeComments: productGradeComments.concat(json.data)
                    })
                });
            }
        );
    }
}

/**
 * 所有商品评论
 * @param productId
 * @returns {Function}
 */
export function getAllProductComment(productId) {
    return (dispatch) => {
        const url = '/wap/product/getProductComment?productId=' + productId;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: PRODUCT_ALL_COMMENT,
                    data: json
                });
            }
        );
    }
}

/**
 * 根据商品id找到支持门店id
 * @param productId
 * @returns {Function}
 */
export function findSupportShopIdsByProductId(productId) {
    return (dispatch) => {
        const url = '/wap/product/findSupportShopIdsByProductId?productId=' + productId;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: SUPPORT_SHOP_IDS,
                    data: json
                });
            }
        );
    }
}

/**
 * 是否展示说明书或者详情
 * @param isShowInstructions
 * @returns {Function}
 */
export function changeIsShowInstructions(isShowInstructions) {
    return (dispatch) => {
        dispatch({
            type: CHANGE_IS_SHOW_INSTRUCTIONS,
            data: isShowInstructions
        });
    }
}

/**
 * 切换tab
 * @param currentTab
 * @returns {Function}
 */
export function shiftProductDetailTab(currentTab) {
    return (dispatch) => {
        dispatch({
            type: SHIFT_PRODUCT_DETAIL_TAB,
            data: currentTab
        });
    }
}

/**
 * 切换评论等级
 * @param gradeLevelType
 * @returns {Function}
 */
export function changeCurrentGrade(gradeLevelType) {
    return (dispatch) => {
        dispatch({
            type: CHANGE_CURRENT_GRADE,
            data: gradeLevelType
        });
    }

}
/**
 * 切换是否清空输入框按钮
 * @param inputValue
 * @returns {Function}
 */
export function changeIsShowDeleteBtnForInput(inputValue) {
    return (dispatch) => {
        dispatch({
            type: PRODUCT_CHANGE_IS_SHOW_DELETE_BTN_FOR_INPUT,
            data: inputValue
        });
    }

}






/**
 * 通用
 */
export function commonSetProductState(type, data) {
    return (dispatch) => {
        dispatch({
            type: type,
            data: data
        });
    }
}




