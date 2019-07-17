/**
 * Created by admin on 2018/3/28.
 */
import {
    ADDRESS_CLEAR_ADDRESS_POIS,
    ADDRESS_CLEAR_SEARCH_ADDRESS_DETAIL,
    ADDRESS_INPUT_ADDRESS_CHANGE,
    ADDRESS_IS_SELECT_DEFAULT_ADDRESS,
    ADDRESS_IS_SHOW_ADD_ADDRESS_COMPONENT,
    ADDRESS_IS_SHOW_ADDRESS_SEARCH_COMPONENT,
    ADDRESS_PLACE_SEARCH_OBJECT,
    ADDRESS_RECEIVER_ADDRESS_DETAIL,
    ADDRESS_RECEIVER_ADDRESS_LIST,
    ADDRESS_SET_POIS,
    ADDRESS_SET_SEARCH_ADDRESS_DETAIL,
    FIND_DETAILED_ADDRESS,
    ADDRESS_CLEAN_MAP_LOCATION
} from "../constants/actionTypes";

/**
 * 保存收货地址
 */
export function saveReceiverAddress(data, callback) {
    return (dispatch) => {
        const url = '/wap/receiverAddr/saveOrUpdateReceiverAddress';
        window.textFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data)
            },
            json => {
                callback(true);
            }
        );
    }
}

/**
 * 地址列表
 */
export function getMemberReceiverAddressList() {
    return (dispatch) => {
        const url = '/wap/receiverAddr/findReceiverAddressList';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: ADDRESS_RECEIVER_ADDRESS_LIST,
                    addressData: json
                })
            }
        );
    }
}

/**
 * 设置搜索地址结果
 */
export function setPois(pois) {
    return (dispatch) => {
        dispatch({
            type: ADDRESS_SET_POIS,
            pois: pois
        })
    }
}

/**
 * 设置选中的地址
 */
export function setSearchAddressDetailInfo(address) {
    return (dispatch) => {
        dispatch({
            type: ADDRESS_SET_SEARCH_ADDRESS_DETAIL,
            address: address
        })
    }
}

/**
 * 清除当前选中的地址
 */
export function clearCurrentDetailAddress() {
    return (dispatch) => {
        dispatch({
            type: ADDRESS_CLEAR_SEARCH_ADDRESS_DETAIL,
            address: {location: {}}
        })
    }
}

/**
 * 清除搜索的地址结果
 */
export function clearPoi() {
    return (dispatch) => {
        dispatch({
            type: ADDRESS_CLEAR_ADDRESS_POIS,
            pois: []
        })
    }
}

/**
 * 是否选择为默认地址
 */
export function isSelectDefaultAddress(isDefault) {
    return (dispatch) => {
        dispatch({
            type: ADDRESS_IS_SELECT_DEFAULT_ADDRESS,
            isDefaultAddress: isDefault
        })
    }
}

/**
 * 获取收货地址详情
 */
export function getReceiverAddressById(receiverAddressId,callback) {
    return (dispatch) => {
        const url = '/wap/receiverAddr/findReceiverAddressDetail?receiverId=' + receiverAddressId;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: ADDRESS_RECEIVER_ADDRESS_DETAIL,
                    addressDetail: json
                });
                callback();
            }
        );
    }
}

/**
 * 删除地址
 */
export function deleteReceiverAddress(receiverId, callback) {
    return (dispatch) => {
        const url = '/wap/receiverAddr/deleteReceiverAddress?receiverId=' + receiverId;
        window.textFetch(
            url,
            {},
            json => {
                callback(true);
            }
        );
    }
}

/**
 * 设置placeSearch对象
 */
export function setPlaceSearch(placeSearch) {
    return (dispatch) => {
        dispatch({
            type: ADDRESS_PLACE_SEARCH_OBJECT,
            placeSearch: placeSearch
        })
    }
}

/**
 * 是否显示地址搜索组件
 */
export function isShowSearchAddressComponent(isShow) {
    return (dispatch) => {
        dispatch({
            type: ADDRESS_IS_SHOW_ADDRESS_SEARCH_COMPONENT,
            isShowSearchAddressComponent: isShow
        })
    }
}

/**
 * 是否显示添加地址组件
 */
export function isShowAddAddressComponent(isShow) {
    return (dispatch) => {
        dispatch({
            type: ADDRESS_IS_SHOW_ADD_ADDRESS_COMPONENT,
            isShowAddAddressComponent: isShow
        })
    }
}

/**
 * 输入框变化监听
 */
export function inputChange(value) {
    return(dispatch) => {
        dispatch({
            type: ADDRESS_INPUT_ADDRESS_CHANGE,
            keyword: value
        });
    }
}


/**
 * 详细位置
 */
export function findDetailedAddress(mapLocation) {
    return (dispatch) => {
        const url = '/wap/receiverAddr/findDetailedAddress?mapLocation=' + mapLocation;
        window.textFetch(
            url,
            {},
            json => {
                dispatch({
                    type: FIND_DETAILED_ADDRESS,
                    address: json
                })
            }
        );
    }
}


/**
 * 选中后把最开始的字段定位设未空值
 */
export function cleanMapLocation() {
    return (dispatch) => {
        dispatch({
            type: ADDRESS_CLEAN_MAP_LOCATION,
            address: ''
        })
    }
}