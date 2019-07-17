import {
    NORMAL_CART_SETTLEMENT_INFO,
    NORMAL_CART_SETTLEMENT_DELIVERY_TIME_SELECTOR_INFO,
    NORMAL_CART_SETTLEMENT_FREIGHT_INFO,
    NORMAL_CART_SETTLEMENT_COUPON_SELECTOR_INFO,
    NORMAL_CART_SETTLEMENT_PAY_BY_BALANCE_INFO,
    NORMAL_CART_SETTLEMENT_DELIVERY_TIME_SELECT,
    NORMAL_CART_SETTLEMENT_COUPON_SELECTOR_TAB_STATE
} from '../constants/ActionTypes';

const normalCartSettlementState = {
    normalCart:{
    },
    deliveryTimeSelectorInfo: {
        showDeliveryTimeSelector: 'N',
        itemList: [],
        callbackFunc: () => {},
        selectedDayStr: '',
        selectedTimeStr: ''
    },
    freightInfo:{
        showFreight: 'N'
    },
    couponSelectorInfo: {
        couponList: [],
        couponActiveStatus: 'first',    //TAB
        handEffectiveCoupon: 'N',       //是否有可用的优惠券
        handInvalidCoupon: 'N',         //是否有不可用的优惠券
        callbackFunc: () => {}
    },
    payByBalanceInfo: {
        showPayByBalance: 'N',
        callbackFunc: () => {}
    }
};

export default function (state = normalCartSettlementState, action) {
    switch (action.type){
        case NORMAL_CART_SETTLEMENT_INFO:
            return Object.assign({}, state, {
                normalCart: action.normalCart
            });
        case NORMAL_CART_SETTLEMENT_DELIVERY_TIME_SELECTOR_INFO://配送时间选择器
            return Object.assign({}, state, {
                deliveryTimeSelectorInfo: action.deliveryTimeSelectorInfo
            });
        case NORMAL_CART_SETTLEMENT_DELIVERY_TIME_SELECT://配送时间选择器，选择日期
            return Object.assign({}, state, {
                deliveryTimeSelectorInfo: Object.assign({}, state.deliveryTimeSelectorInfo, {
                    selectedDayStr: action.selectedDayStr,
                    selectedTimeStr: action.selectedTimeStr
                })
            });
        case NORMAL_CART_SETTLEMENT_FREIGHT_INFO://运费信息
            return Object.assign({}, state, {
                freightInfo: Object.assign({}, state.showFreight, {
                    showFreight: action.showFreight
                })
            });
        case NORMAL_CART_SETTLEMENT_PAY_BY_BALANCE_INFO://余额支付信息
            return Object.assign({}, state, {
                payByBalanceInfo: Object.assign({}, state.payByBalanceInfo, {
                    showPayByBalance: action.showPayByBalance,
                    callbackFunc: action.callbackFunc
                })
            });
        case NORMAL_CART_SETTLEMENT_COUPON_SELECTOR_INFO://优惠券选择器
            return Object.assign({}, state, {
                couponSelectorInfo: action.couponSelectorInfo
            });
        case NORMAL_CART_SETTLEMENT_COUPON_SELECTOR_TAB_STATE://选择优惠券
            return Object.assign({}, state, {
                couponSelectorInfo: Object.assign({}, state.couponSelectorInfo, {
                    couponActiveStatus: action.couponActiveStatus
                })
            });
        default:
            return state;
    }
}