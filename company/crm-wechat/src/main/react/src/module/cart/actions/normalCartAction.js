import {INIT_NORMAL_CART_INFO} from '../constants/ActionTypes';
import {REG_INT} from "../../../util/common-reg";

/**
 * 获取购物车
 */
export function getCart(callbackFunc) {
    return (dispatch) => {
        const url = '/wap/normalCart/getCart?isCartRequest=Y';
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: INIT_NORMAL_CART_INFO,
                    normalCart: json
                };

                dispatch(action);

                if (typeof callbackFunc === 'function'){
                    callbackFunc();
                }
            }
        );
    }
}

/**
 * 移除已选中的购物车项
 * @returns {function(*)}
 */
export function removeSelected(cartItemList, callbackFunc = () => {}) {
    return (dispatch) => {
        const url = '/wap/normalCart/removeSelected';
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: INIT_NORMAL_CART_INFO,
                    normalCart: json
                };

                dispatch(action);

                if (typeof callbackFunc === 'function'){
                    callbackFunc();
                }
            }
        );
    }
}

/**
 * 更新订单项选中状态
 * @param skuId
 * @returns {function(*)}
 */
export function updateItemSelectStatus(skuId, callbackFunc) {
    return (dispatch) => {
        const url = '/wap/normalCart/updateItemSelectStatus?skuId=' + skuId;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: INIT_NORMAL_CART_INFO,
                    normalCart: json
                };

                dispatch(action);

                if (typeof callbackFunc === 'function'){
                    callbackFunc();
                }
            }
        );
    }
}

/**
 * 设置购物车订单项为选中状态
 * @param skuId
 * @returns {function(*)}
 */
export function setItemSelect(skuId, callbackFunc) {
    return (dispatch) => {
        const url = '/wap/normalCart/setItemSelect?skuId=' + skuId;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: INIT_NORMAL_CART_INFO,
                    normalCart: json
                };

                dispatch(action);

                if (typeof callbackFunc === 'function'){
                    callbackFunc();
                }
            }
        );
    }
}

/**
 * 全选
 * @returns {function(*)}
 */
export function selectAll(isSelectAll = 'Y', callbackFunc) {
    return (dispatch) => {
        const url = '/wap/normalCart/selectAll?isSelectAll='+isSelectAll;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: INIT_NORMAL_CART_INFO,
                    normalCart: json
                };

                dispatch(action);

                if (typeof callbackFunc === 'function'){
                    callbackFunc();
                }
            }
        );
    }
}

/**
 * 增加或减少购物车项数量（增加按钮、减少按钮）
 * @param skuId                 skuId
 * @param isIncrease            是否增加，是：Y; 否：N
 * @param shareIdentityCode     商品分享会员身份编码（openId）
 * @param callbackFunc          回调方法
 */
export function changeItemQuantity(skuId, isIncrease, shareIdentityCode, callbackFunc = () => {}) {
    return (dispatch) => {
        const quantity = isIncrease==='Y' ? 1 : -1;
        const url = '/wap/normalCart/addOrUpdateItem';
        const data = {
            skuId: skuId,
            quantity: quantity,
            shareIdentityCode: shareIdentityCode,
            modify: 'N'
        };

        window.jsonFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data)
            },
            json => {
                const action = {
                    type: INIT_NORMAL_CART_INFO,
                    normalCart: json
                };

                dispatch(action);

                if (typeof callbackFunc === 'function'){
                    callbackFunc();
                }
            }
        );
    }
}

/**
 * 扫码增加购物车项数量
 * @param skuId                 skuId
 * @param callbackFunc          回调方法
 */
export function scanChangeItemQuantity(skuId, callbackFunc = () => {
}, failCallback = () => {
}) {
    return (dispatch) => {
        const url = '/wap/normalCart/addOrUpdateItem';
        const data = {
            skuId: skuId,
            quantity: 1,
            modify: 'N',
            commissionSource:"SCAN_CODE_PURCHASE"
        };

        window.jsonFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data)
            },
            json => {
                const action = {
                    type: INIT_NORMAL_CART_INFO,
                    normalCart: json
                };

                dispatch(action);
                callbackFunc();

            },
            err => {
                return failCallback(err);
            }
        );
    }
}

/**
 * 手动修改购物车项数量
 * @param skuId
 * @param quantity
 * @returns {function(*)}
 */
export function modifyItemQuantity(skuId, quantity, callbackFunc) {
    return (dispatch) => {
        if(!REG_INT.test(quantity)){
            window.warningTip('商品数量只能是正整数');
            return;
        }

        const url = '/wap/normalCart/addOrUpdateItem';
        const data = {
            skuId: skuId,
            quantity: quantity,
            isModify: 'Y'
        };

        window.jsonFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data)
            },
            json => {
                const action = {
                    type: INIT_NORMAL_CART_INFO,
                    normalCart: json
                };

                dispatch(action);

                if (typeof callbackFunc === 'function'){
                    callbackFunc();
                }
            }
        );
    }
}

/**
 * 清空失效宝贝
 * @returns {Function}
 */
export function removeInvalidItem(callbackFunc = () => {}) {
    return (dispatch) => {
        const url = '/wap/normalCart/removeInvalidItem';
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: INIT_NORMAL_CART_INFO,
                    normalCart: json
                };

                dispatch(action);

                if (typeof callbackFunc === 'function'){
                    callbackFunc();
                }
            }
        );
    }
}