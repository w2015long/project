import * as type from "../constants/ActionTypes";

const couponExchangeState = {
    couponExchangePage: {
        page: 0,
        size: 10,
        couponExchanges: []
    },
    myIntegral: ""                    //会员积分
};

export default function (state = couponExchangeState, action) {
    switch (action.type) {
        case type.COUPON_EXCHANGE_LIST:
            return Object.assign({}, state, {
                couponExchangePage: action.couponExchangePage
            });
        case type.COUPON_EXCHANGE_LIST_INTEGRAL:
            return Object.assign({}, state, {
                myIntegral: action.data
            });
        default:
            return state;
    }
}
