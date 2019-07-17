/**
 * 使用优惠卷
 * Created by liezihao on 2018/10/16
 */
// 引入定义常量
import {
    USE_COUPON,
    USE_COUPON_RESULT
} from '../constants/ActionTypes';

const generateCouponCode={
    couponDetails:[],      //优惠卷详情
    useResult : ''        //优惠卷使用结果
};

export default function (state = generateCouponCode, action) {
    switch (action.type) {
        case USE_COUPON:
            return Object.assign({},state,{
                couponDetails:action.data
            });
        case USE_COUPON_RESULT:
            return Object.assign({},state,{
                useResult:action.data
            });
        default:
            return state;
    }
}