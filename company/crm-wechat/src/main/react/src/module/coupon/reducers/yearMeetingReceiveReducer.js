/**
 * 获取年会扫码领取优惠卷信息
 * Created by liezihao on 2018/12/24
 */
// 引入定义常量
import {
    YEAR_MEETING_RECEIVE_GET_SCAN_RECEIVE_COUPON,
    YEAR_MEETING_RECEIVE_COUPON_HAPPEN_ABNORMAL,
} from '../constants/ActionTypes';

const getYearMeetingReceiveCouponData={
    couponData:[],      //优惠卷信息
    abnormal : false    //是否发生异常
};

export default function (state = getYearMeetingReceiveCouponData, action) {
    switch (action.type) {
        case YEAR_MEETING_RECEIVE_GET_SCAN_RECEIVE_COUPON:
            return Object.assign({},state,{
                couponData:action.data
            });
        case YEAR_MEETING_RECEIVE_COUPON_HAPPEN_ABNORMAL:
            return Object.assign({},state,{
                abnormal:action.data
            });
        default:
            return state;
    }
}