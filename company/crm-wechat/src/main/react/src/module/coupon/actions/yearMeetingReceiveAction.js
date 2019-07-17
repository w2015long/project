/**
 * Created by liezihao on 2018/10/16
 * 获取扫码领取优惠卷信息
 */
// 引入定义常量
import {
    YEAR_MEETING_RECEIVE_GET_SCAN_RECEIVE_COUPON,
    YEAR_MEETING_RECEIVE_COUPON_HAPPEN_ABNORMAL
} from "../constants/ActionTypes";


/**
 * 年会领卷
 * @param couponId 优惠卷id
 * @param newMapLocation 会员的经纬度
 */

export function yearMeetingReceive(couponId,newMapLocation) {
    return (dispatch) => {
        const url = 'wap/coupon/yearMeetingReceive?couponId='+couponId+'&newMapLocation='+newMapLocation;
        window.textFetch(
            url, {}, json => {
                const action = {
                    type:YEAR_MEETING_RECEIVE_GET_SCAN_RECEIVE_COUPON,
                    data:json
                };
                //如果会员没有注册 或者 没有激活会员卡 调用回调函数 生成会员卡二维码
                // if(json.memberIsLogin === 'N' || json.activationMemberCard === 'N'){
                //
                // }
                dispatch(action);
            },
            error =>{
                   const action = {
                       type:YEAR_MEETING_RECEIVE_COUPON_HAPPEN_ABNORMAL,
                       data:true
                   };
                   dispatch(action);
               }
        );
    }
}

