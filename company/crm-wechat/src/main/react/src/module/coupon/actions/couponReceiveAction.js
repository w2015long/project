/**
 * 优惠券
 */
import {
    NEW_COUPON_LIST_GET_PAGE,
    CHANGE_COUPON_CATEGORY,
    COUPON_CATEGORY_LIST,

} from '../constants/ActionTypes';

/**
 * 优惠券列表
 * @param isUse 已经使用
 * @param isEffective 已经过期
 * @returns {function(*)}
 */
export function pageReceiveCoupons(params,page, size, couponList = []) {
    return (dispatch) => {
        const url = 'wap/coupon/pageReceiveCoupons';
        let data = Object.assign({}, params, {page: page, size: size});
        window.jsonFetch(
            url,
            {
                method: 'post',
                body: JSON.stringify(data)
            },
            json => {
                dispatch({
                    type: NEW_COUPON_LIST_GET_PAGE,
                    data: {
                            page: page,
                            size: size,
                            recordsFiltered: json.recordsFiltered,
                            coupons: couponList.concat(json.data)
                    }
                })
            });
    }
}

/**
 * 优惠券分类列表
 */
export function couponCategoryList() {
    return (dispatch) => {
        const url = '/wap/coupon/findCouponCat';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: COUPON_CATEGORY_LIST,
                    data: json
                })}
        );
    }
}


/**
 * 切换优惠券列表tab
 * @param param
 */
export function changeCouponType(param) {
    return function (dispatch) {
        dispatch({
            type: CHANGE_COUPON_CATEGORY,
            data: param
        })
    }
}

/**
 * 领取优惠券
 */
export function updateReceiveCoupons(coupon,index,callBack=()=>{}) {
    return (dispatch) => {
        const url = 'wap/coupon/updateReceiveCoupons?couponId=' + coupon.couponId;
        window.textFetch(
            url,
            {},
            json => {
                callBack(json,index,dispatch);//json 是否已领取，权限id
                window.successTip("已领取");
            },
            error => {
                if(typeof error==='object' && error.errCode ==="SYS_OBJ_NOT_FOUND"){
                    window.warningTip("您还不是会员，请注册之后再领取!");
                    return false;
                }else if(typeof error==='object' && error.errCode ==="COUPON_OBJ_ERROR"){
                    window.warningTip("您的会员等级不在指定领取等级内哦!");
                    return false;
                }
                else{
                    return true;
                }
            });
    }

}



/**
 * 年中领取优惠券
 */
export function yearMetaphaseReceiveCoupons(couponId,callback=()=>{}) {
    return (dispatch) => {
        const url = 'wap/coupon/updateReceiveCoupons?couponId=' + couponId;
        window.textFetch(
            url,
            {},
            json => {
                window.successTip("领取成功");
            },
            error => {
                if(typeof error==='object' && error.errCode ==="SYS_OBJ_NOT_FOUND"){
                    callback();
                    return false;
                }else if(typeof error==='object' && error.errMsg ==="该会员等级不在指定领取等级内"){
                    window.warningTip("您的会员等级不在指定领取等级内哦!");
                    return false;
                } else{
                    if(typeof error==='object'){
                        window.warningTip(error.errMsg);
                    }
                    return false;
                }
            });
    }

}