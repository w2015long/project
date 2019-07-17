/**
 * 领取优惠券
 * Created by caixuan on 2018/4/9.
 */
import * as types from "../constants/ActionTypes"
const couponState={
    couponList:[],
};

export default function (state = couponState, action) {
    switch (action.type) {
        case types.COUPON_GET_RECEIVE_COUPON_LIST:
            return Object.assign({},state,{
                couponList:action.data
            });
        default:
            return state;
    }
}
