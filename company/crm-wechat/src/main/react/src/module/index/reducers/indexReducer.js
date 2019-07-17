/**
 * oxl
 * 门店首页
 * ActionTypes
 */

import * as type from '../constants/ActionTypes';

const indexState = {
    shopDetail: {
    },
    params: {
        sellCategoryId: '',
        data: [],
        page: 0,
        recordsFiltered: 0,
        size: 10
    },
    loginInfo: {},
    productPage: {},
    isShowTip:false,
    isShowNearByShop:false,
    location: null,
    locationName: "正在定位...",
    receiverList:[],
    pharmacistPage: {
        page: 0,
        size: 10,
        pharmacists: []
    },
    nearByShopIndex: 0,    //附近门店内存分页下标
    nearByShopList:[],//附近门店
    isStickySearchInput:"N",//是否悬浮商品搜索输入框
    isStickyCatItem:"N",//是否置顶商品分类
    isShowAddAddressComponent:false,
    activityLayerDefaultState:"N",
    sellCategoryId : '',
    couponPopup:false,  // 优惠券弹窗状态
};



export default function (state = indexState, action) {
    switch (action.type) {
        case type.INDEX_GET_SHOP_DETAIL:
            return Object.assign({}, state, {
                shopDetail: action.shopDetail,
                locationName: action.locationName
            });
        case type.INDEX_SET_SEARCH_PARAMS:
            return Object.assign({}, state, {
                params: Object.assign({}, state.params, action.params)
            });
        case type.INDEX_GET_PAGE_PRODUCT:
            return Object.assign({}, state, {
                productPage: action.productPage
            });
        case type.INDEX_SET_IS_SHOW_TIP:
            return Object.assign({}, state, {
                isShowTip: action.isShowTip
            });
        case type.INDEX_SET_IS_SHOW_NEARBY_SHOP:
            return Object.assign({}, state, {
                isShowNearByShop: action.isShowNearByShop
            });
        case type.INDEX_SET_LOCATION:
            return Object.assign({}, state, {
                location: action.location,

            });
        case type.INDEX_SET_LOCATION_NAME:
            return Object.assign({}, state, {
                locationName: action.locationName
            });

        case type.INDEX_GET_RECEIVER_LIST:
            return Object.assign({}, state, {
                receiverList: action.receiverList
            });
        case type.WE_CHAT_PHARMACIST_LIST:
            return Object.assign({}, state, {
                pharmacistPage: action.pharmacistPage
            });
        case type.INDEX_SET_NEARBY_SHOP_INDEX:
            return Object.assign({},state,{
                nearByShopIndex: action.nearByShopIndex
            });
        case type.INDEX_SET_NEARBY_SHOP_LIST:
            return Object.assign({},state,{
                nearByShopList: action.nearByShopList
            });
        case type.INIT_IS_SHOW_ADDRESS_COMPONENT:
            return Object.assign({}, state, {
                isShowAddAddressComponent: action.whether
            });
        case type.INDEX_SET_IS_STICKY_SEARCH_INPUT:
            return Object.assign({}, state, {
                isStickySearchInput: action.data
            });
        case type.INDEX_SET_IS_STICKY_CAT_ITEM:
            return Object.assign({}, state, {
                isStickyCatItem: action.data
            });
        case type.INDEX_SET_IS_LOGIN:
            return Object.assign({}, state, {
                loginInfo: action.data
            });
        case type.INDEX_SET_DEFAULT_ACTIVITY_STATE:
            return Object.assign({}, state, {
                activityLayerDefaultState: action.data
            });
        case type.GET_SHOP_SELL_CLASSIFY_FIRST_ID:
            return Object.assign({}, state, {
                sellCategoryId: action.sellCategoryId
            });
        case type.INDEX_IS_OPEN_COUPON_POPUP:
            return Object.assign({}, state, {
                couponPopup: action.data
            });
        default:
            return state;
    }
}
