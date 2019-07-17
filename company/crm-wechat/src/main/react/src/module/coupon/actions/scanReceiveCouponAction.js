/**
 * Created by liezihao on 2018/10/16
 * 获取扫码领取优惠卷信息
 */
// 引入定义常量
import {
    GET_SCAN_RECEIVE_COUPON,
    GENERATE_MEMBER_CARD_QR_CODE,
    RECEIVE_COUPON_HAPPEN_ABNORMAL,
    RECORD_COUPON_DATA
} from "../constants/ActionTypes";


/**
 * 获取扫码领取优惠卷
 * @param couponId 优惠卷id
 * @returns {Function}
 */
export function scanReceiveCouponAction(couponId,callBack=()=>{}) {
    return (dispatch) => {
        const url = 'wap/coupon/scanReceiveCoupon?couponId='+couponId;
        window.textFetch(
            url, {}, json => {
                const action = {
                    type:GET_SCAN_RECEIVE_COUPON,
                    data:json
                };
                //如果会员没有注册 或者 没有激活会员卡 调用回调函数 生成会员卡二维码
                if(json.memberIsLogin === 'N' || json.activationMemberCard === 'N'){
                    callBack();
                }
                dispatch(action);
            },
            error =>{
                   const action = {
                       type:RECEIVE_COUPON_HAPPEN_ABNORMAL,
                       data:true
                   };
                   dispatch(action);
               }
        );
    }
}



/**
 * 记录优惠卷数据
 */
export function recordCouponDataAction(couponData) {
    return (dispatch) => {
        const action = {
            type:RECORD_COUPON_DATA,
            data:couponData
        };
        dispatch(action);
    }
}


/**
 * 清空CouponData
 */
export function emptyCouponDataAction() {
    return (dispatch) => {
        const action = {
            type:GET_SCAN_RECEIVE_COUPON,
            data:{}
        };
        dispatch(action);
    }
}

/**
 * 生成会员卡二维码
 * @param shopId  员工id
 * @param callbackUrl 回调url
 * @returns {Function}
 */
export function generateMemberCardQrCode(callbackUrl) {
    return (dispatch) => {
        //generalizeChannel 用户首次领卡推送附带该参数 先写死0 ，后续可能需要优化
        const url = '/wap/coupon/geMemberCardCode?generalizeChannel=0&redirectUrl='+callbackUrl;
        window.textFetch(
            url, {}, json => {
                const action = {
                    type:GENERATE_MEMBER_CARD_QR_CODE,
                    data:json
                };
                dispatch(action);
            },
        );
    }
}