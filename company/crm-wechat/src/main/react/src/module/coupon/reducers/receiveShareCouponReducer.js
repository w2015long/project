import {RECEIVE_SHARE_COUPON_INFO,RECEIVE_COUPONS_RESULT} from "../constants/ActionTypes";

const receiveShareCouponState={

    receiveShareCouponInfo:{},
    receive_coupons_result :'wait',
    errorInfo:''
};

export default function (state = receiveShareCouponState, action) {
    switch (action.type) {
        case RECEIVE_SHARE_COUPON_INFO:
            return Object.assign({},state,{
                receiveShareCouponInfo:action.data
            });
        case RECEIVE_COUPONS_RESULT:
            return Object.assign({},state,{
                receive_coupons_result:action.data.receive_coupons_result,
                errorInfo :action.data.errorInfo
            });
        default:
            return state;
    }
}
