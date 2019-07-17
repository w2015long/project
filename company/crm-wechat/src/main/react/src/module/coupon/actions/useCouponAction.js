/**
 * Created by liezihao on 2018/10/16
 * 使用优惠卷
 */
// 引入定义常量
import {USE_COUPON, USE_COUPON_RESULT} from "../constants/ActionTypes";
import JsBarcode from 'jsbarcode';


/**
 * 使用优惠卷
 * @param couponPermissionId 优惠券使用权限ID
 * @returns {Function}
 */
export function getCouponDetail(couponPermissionId, failCallback = () => {
}, successCallBack = () => {
}) {
    return (dispatch) => {
        const url = '/wap/coupon/useCoupon?couponPermissionId='+couponPermissionId;
        window.textFetch(
            url, {}, json => {
                const action = {
                    type:USE_COUPON,
                    data:json
                };
                if(json.isCouponExpire === 'N'){
                    sweepBarCode(json.couponCode);
                    successCallBack();
                }
                dispatch(action);
            },
            err => {
                console.log("失败");
                if (typeof failCallback === "function") {
                    failCallback();
                }
            }
        );
    }
}

function sweepBarCode(couponCode) {
    let barcode = document.getElementById('barcode');
    let str = couponCode;
    let options = {
        width: 2,
        height:100,
        format: "CODE128",
        displayValue:false,//是否在条形码下方显示文字
        fontSize: 18,
        lineColor:'#000'
    };
    JsBarcode(barcode, str, options); //原生
}


/**
 * 查询优惠卷使用情况
 * @param couponPermissionId 优惠券使用权限ID
 * @param couponUseCondition 使用情况回调
 * @returns {Function}
 */
export function queryCouponUseSituation(couponPermissionId, couponUseCondition = () => {
}) {
    return (dispatch) => {
        const url = '/wap/coupon/queryCouponUseSituation?couponPermissionId='+couponPermissionId;
        window.textFetch(
            url, {}, json => {
                const action = {
                    type:USE_COUPON_RESULT,
                    data:json
                };
                dispatch(action);
                console.log(couponUseCondition);
                if (json === 'Y') {
                    console.log("过期");
                    couponUseCondition();
                }

            }, err => {
                return false;

            }
        );
    }
}
