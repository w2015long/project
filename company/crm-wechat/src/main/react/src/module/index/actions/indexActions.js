/**
 * @author olx
 * @date 2018年3月29日14:58:49
 *
 */

import * as types from "../constants/ActionTypes";
import {getCart} from "../../cart/actions/normalCartAction";

/**
 * 获取参数
 * @param params
 * @returns {function(*)}
 */
export function setParams(params,callbackFuns = () => {}) {
    return (dispatch) => {
        const action = {
            type: types.INDEX_SET_SEARCH_PARAMS,
            params: params
        };
        dispatch(action);
        callbackFuns();
    }
}

/**
 *注释提醒
 * @param tip
 * @returns {function(*)}
 */
export function setTip(isShowTip) {
    return (dispatch) => {
        const action = {
            type: types.INDEX_SET_IS_SHOW_TIP,
            isShowTip: isShowTip
        };
        dispatch(action);
    }
}

/**
 *附近门店
 * @param isShowNearByShop
 * @returns {function(*)}
 */
export function setNearByShop(isShowNearByShop) {
    return (dispatch) => {
        const action = {
            type: types.INDEX_SET_IS_SHOW_NEARBY_SHOP,
            isShowNearByShop: isShowNearByShop
        };
        dispatch(action);
    }
}

/**
 *设置用户 坐标
 * @param location
 * @returns {function(*)}
 */
export function setLocation(location) {
    return (dispatch) => {
        const action = {
            type: types.INDEX_SET_LOCATION,
            location: location,
        };
        dispatch(action);
    }
}

export function setIsShowAddAddressComponent(whether) {
    return (dispatch) => {
        const action = {
            type: types.INIT_IS_SHOW_ADDRESS_COMPONENT,
            whether :whether
        };
        dispatch(action);
    }
}

/**
 * 初次进入首页根据定位获取详情
 */
export function getShopDetail(mapLocation,isForciblyLocation="N",callBack=()=>{}) {
    if(!mapLocation){
        window.warningTip("定位失败,请到开阔场所重试,或点击左上角修改地址");
    }

    return (dispatch) => {
        dispatch({
            type: types.INDEX_GET_PAGE_PRODUCT,
            productPage:{}
        });
        const url = '/wap/shop/findShopHome?mapLocation=' + mapLocation+ "&isForciblyLocation="+isForciblyLocation;
        window.textFetch(
            url,
            {},
            json => {
                const action = {
                    type: types.INDEX_GET_SHOP_DETAIL,
                    shopDetail: json,
                    locationName: json.mapLocation
                };
                dispatch( setTip(!json.inShopRange));
                dispatch(action);

                callBack(json.shopId);
                if (json.shopId) {
                    document.title = json.name;
                    dispatch(setParams({sellCategoryId: json.wapPrdSellCatProtocols&&json.wapPrdSellCatProtocols.length>0 ? json.wapPrdSellCatProtocols[0].sellCategoryId : ''},function () {
                        dispatch(getProductList({sellCategoryId: json.wapPrdSellCatProtocols&&json.wapPrdSellCatProtocols.length>0 ? json.wapPrdSellCatProtocols[0].sellCategoryId : ''}, 0, 10));
                    }));

                    dispatch(getCart());
                }else {
                    dispatch( getNearByShopListSort(mapLocation));
                }

            },
            error =>{
                if(typeof error==='object' && error.errCode ==="DISTRIBUTION_RULE_NOT_FOUND"){
                    window.warningTip("连锁配送信息异常,请稍后再试");
                    return false;
                }else
                {
                    return true;
                }
            }
        );
    }
}

/**
 * 点击列表进入指定门店详情
 */
export function findShopHomeByShopId(mapLocation,shopId,calback=()=>{},sellCategoryId) {
    return (dispatch) => {
        dispatch({
            type: types.INDEX_GET_PAGE_PRODUCT,
            productPage:{}
        });
        const url = '/wap/shop/findShopHomeByShopId?shopId='+shopId+'&mapLocation=' + mapLocation ;
        window.textFetch(
            url,
            {},
            json => {
                const action = {
                    type: types.INDEX_GET_SHOP_DETAIL,
                    shopDetail: json,
                    locationName: json.mapLocation
                };
                dispatch( setTip(!json.inShopRange));
                calback();
                dispatch(action);
                if (json.shopId) {
                    document.title = json.name;
                    dispatch(getProductList({sellCategoryId: sellCategoryId}, 0, 10));

                }

            },
            error => {
                return true;
            }
        );
    }
}
/**
 * 加载附近门店分页列表
 */
export function getNearByShopListSort(mapLocation) {
    return (dispatch) => {
        const url = '/wap/shop/getNearByShopListSort?mapLocation=' + mapLocation;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: types.INDEX_SET_NEARBY_SHOP_LIST,
                    nearByShopList: json
                };
                dispatch(action);
            },
            error =>{
                if(typeof error==='object' && error.errCode ==="DISTRIBUTION_RULE_NOT_FOUND"){
                    window.warningTip("该连锁暂无配送规则");
                    return false;
                }else
                {
                    return true;
                }
            }
        );
    }
}


/**
 * 获取收货地址
 * @returns {function(*)}
 */
export function findReceiverListByUserId(getLocationByDefaultAddress=()=>{}) {
    return (dispatch) => {
        const url = '/wap/receiverAddr/findReceiverAddressList';
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: types.INDEX_GET_RECEIVER_LIST,
                    receiverList: json
                };
                dispatch(action);
                getLocationByDefaultAddress();
            },
            error => {

                return true;
            }
        );
    }
}
/**
 * 分页加载商品列表
 */
export function getProductList(params, page = 0, size = 10, productList = []) {
    return (dispatch) => {
        //发起一个fetch请求
        const url = '/wap/product/pageProductListByShopIdAndSellId?'
            + 'sellCatId=' + params.sellCategoryId
            + '&page=' + page + '&size=' + size;
        window.jsonFetch(
            url,
            {},
            json => {

                dispatch({
                    type: types.INDEX_GET_PAGE_PRODUCT,
                    productPage: Object.assign({}, json, {
                        data: productList.concat(json.data),
                    })
                });
            },
            error => {
                //可以在发生错误时搞点事情
                return false;//可以阻止默认的错误弹窗，除非你进行了其他的友好提示或者备用方案。否则绝不允许隐藏错误！！！
            }
        );
    }
}

export function getLoginInfo() {
    return (dispatch) => {
        //发起一个fetch请求
        const url = '/wap/member/getCurrentMember';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: types.INDEX_SET_IS_LOGIN,
                    data: json
                });
            },
            error => {
                //可以在发生错误时搞点事情
                return false;//可以阻止默认的错误弹窗，除非你进行了其他的友好提示或者备用方案。否则绝不允许隐藏错误！！！
            }
        );
    }
}

/**
 * 药师咨询列表
 */
export function pagePharmacistList(page, size, pharmacistList = []) {
    return (dispatch) => {
        const url = '/wap/pharmacist/pageWapPharmacist?page=' + page + "&size=" + size;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: types.WE_CHAT_PHARMACIST_LIST,
                    pharmacistPage: Object.assign({}, json, {
                        page: page,
                        size: size,
                        pharmacists: pharmacistList.concat(json.data)
                    })
                };
                dispatch(action)
            },
            error => {
                return false;
            }
        );
    }
}

/*附近门店内存分页下标*/
export function setNearByShopIndex(nearByShopIndex) {
    return function (dispatch) {
        dispatch({
            type: types.INDEX_SET_NEARBY_SHOP_INDEX,
            nearByShopIndex: nearByShopIndex

        });
    }
}



/**
 *
 */
export function commonSetIndexState(type, data) {
    return (dispatch) => {
        dispatch({
            type: type,
            data: data
        });
    }
}


/**
 * 获取该门店销售分类第一个id
 * @param shopId
 * @param findShopHome 回调
 */
export function getShopSellClassifyFirstId(shopId,findShopHomeByShop = ()=>{}) {
    return (dispatch) => {
        const url = '/wap/shop/getShopSellClassifyFirstId?shopId='+shopId;
        window.textFetch(
            url,
            {},
            json => {
                dispatch({
                    type: types.GET_SHOP_SELL_CLASSIFY_FIRST_ID,
                    sellCategoryId : json
                });
                findShopHomeByShop(json) ;
            }
        );
    }
}

/**
 * 打开或者关闭优惠券弹窗
 */
export function openOrCloseCouponPopup(isOpen) {
    return (dispatch) => {
        dispatch({
            type: types.INDEX_IS_OPEN_COUPON_POPUP,
            data: isOpen
        });
    }
}