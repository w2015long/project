import * as type from '../constants/ActionTypes';

const couponGiftPackState={
    couponDetails:[],
    receiveCoupon:"TO_RECEIVE",
};

export default function (state = couponGiftPackState, action) {
    switch (action.type) {
        case type.COUPON_GIFT_PACK_DETAILS:
            return Object.assign({},state,{
                couponDetails:action.data
            });
        case type.RECEIVE_COUPON_GIFT_PACK:
            return Object.assign({},state,{
                receiveCoupon:action.data
            });
        default:
            return state;
    }
}