/**
 * 获取扫码领取优惠卷信息
 * Created by liezihao on 2018/10/16
 */
// 引入定义常量
import {
    GET_SCAN_RECEIVE_COUPON,
    GENERATE_MEMBER_CARD_QR_CODE,
    RECEIVE_COUPON_HAPPEN_ABNORMAL,
    RECORD_COUPON_DATA
} from '../constants/ActionTypes';

const getCouponData={
    couponData:[],      //优惠卷信息
    memberCard : '',    //会员卡二维码url
    abnormal : false,    //是否发生异常
    recordCouponData:{}  //记录优惠券数据
};

export default function (state = getCouponData, action) {
    switch (action.type) {
        case GET_SCAN_RECEIVE_COUPON:
            return Object.assign({},state,{
                couponData:action.data
            });
        case GENERATE_MEMBER_CARD_QR_CODE:
            return Object.assign({},state,{
                memberCard:action.data
            });
        case RECEIVE_COUPON_HAPPEN_ABNORMAL:
            return Object.assign({},state,{
                abnormal:action.data
            });
        case RECORD_COUPON_DATA:
            return Object.assign({},state,{
                recordCouponData:action.data
            });
        default:
            return state;
    }
}