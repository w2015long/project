/**
 * 个人中心-优惠券列表
 * Created by caixuan on 2018/3/28.
 */
import {COUPON_APPLY_PRODUCT_PAGE,CHANGE_TAB_BUTTON,COUPON_APPLY_STORE_LIST} from '../constants/ActionTypes';



/**
 *  分页 - 优惠券适用商品
 */
export function pageCouponApplyProduct(couponApplyProductSearchParam,couponApplyProductContent = []) {
    return (dispatch) => {
        const url = 'wap/member/pageCouponApplyProduct';
        window.jsonFetch(
            url,
            {
                method:'POST',
                body:JSON.stringify(couponApplyProductSearchParam)
            },
            json => {
                let data = {
                    page:couponApplyProductSearchParam.page,
                    size:couponApplyProductSearchParam.size,
                    content:couponApplyProductContent.concat(json.data),
                    recordsFiltered:json.recordsFiltered
                };
                dispatch({
                    type: COUPON_APPLY_PRODUCT_PAGE,
                    data:data
                })
            });
    }
}

/**
 *  优惠券适用门店列表
 */
export function couponApplyStoreListAction(couponId,mapLocation) {
    return (dispatch) => {
        const url = 'wap/member/getMemberApplyShopList?couponId='+couponId+"&mapLocation=" + mapLocation;
        window.jsonFetch(
            url,
            {
            },
            json => {
                dispatch({
                    type: COUPON_APPLY_STORE_LIST,
                    data:json
                })
            });
    }
}


/**
 *  改变tab按钮
 */
export function changeTabButtonAction(type) {
    return (dispatch) => {
        dispatch({
            type: CHANGE_TAB_BUTTON,
            data:type
        })
    }
}


/**
 *  好友赠送优惠券
 */
export function sendCouponToFriendFun(couponPermissionId) {
    return (dispatch) => {
        const url = 'wap/couponGiftLog/sendCouponToFriend?couponPermissionId='+couponPermissionId;
        window.textFetch(
            url,
            {},
            json => {
               /* dispatch({})*/
            });
    }
}


/**
 *  撤销优惠卷
 */
export function receiveCouponFromFriendAction(couponPermissionId,callback) {
    return (dispatch) => {
        const url = 'wap/couponGiftLog/withdrawCouponGift?couponPermissionId='+couponPermissionId;
        window.textFetch(
            url,
            {},
            json => {
                callback();
            });
    }
}
