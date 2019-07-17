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

const addressState = {
    addressData: [],
    location: [116.480983, 40.0958],
    pois: [],
    address: {location: {}},
    addressDetail: {
        receiverName: "",
        contactTel: "",
        deliveryAddr: "",
        detailAddr: "",
    },
    map: {},
    placeSearch: {},
    isDefaultAddress: false,
    isShowSearchAddressComponent: false,
    isShowAddAddressComponent: false,
    keyword: "",
    detailedAddress:'', // 详细位置
};

export default function (state = addressState, action) {
    switch (action.type) {
        case ADDRESS_RECEIVER_ADDRESS_LIST:
            return Object.assign({}, state, {
                addressData: action.addressData
            });
        case ADDRESS_SET_POIS:
            return Object.assign({}, state, {
                pois: action.pois
            });
        case ADDRESS_SET_SEARCH_ADDRESS_DETAIL:
            return Object.assign({}, state, {
                address: action.address
            });
        case ADDRESS_CLEAR_SEARCH_ADDRESS_DETAIL:
            return Object.assign({}, state, {
                address: action.address
            });
        case ADDRESS_CLEAR_ADDRESS_POIS:
            return Object.assign({}, state, {
                pois: action.pois
            });
        case ADDRESS_RECEIVER_ADDRESS_DETAIL:
            return Object.assign({}, state, {
                addressDetail: action.addressDetail,
                isDefaultAddress: action.addressDetail.isDefaultAddr === 'Y'
            });
        case ADDRESS_IS_SELECT_DEFAULT_ADDRESS:
            return Object.assign({}, state, {
                isDefaultAddress: action.isDefaultAddress
            });
        case ADDRESS_PLACE_SEARCH_OBJECT:
            return Object.assign({}, state, {
                placeSearch: action.placeSearch
            });
        case ADDRESS_IS_SHOW_ADDRESS_SEARCH_COMPONENT:
            return Object.assign({}, state, {
                isShowSearchAddressComponent: action.isShowSearchAddressComponent
            });
        case ADDRESS_IS_SHOW_ADD_ADDRESS_COMPONENT:
            return Object.assign({}, state, {
                isShowAddAddressComponent: action.isShowAddAddressComponent
            });
        case ADDRESS_INPUT_ADDRESS_CHANGE:
            return Object.assign({}, state, {
                keyword: action.keyword
            });
        case FIND_DETAILED_ADDRESS:
            return Object.assign({}, state, {
                detailedAddress: action.address
            });
        case ADDRESS_CLEAN_MAP_LOCATION:
            return Object.assign({}, state, {
                detailedAddress: action.address
            });
        default:
            return state;
    }
}