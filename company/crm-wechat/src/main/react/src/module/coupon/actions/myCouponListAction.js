import {
    MY_COUPON_LIST_PAGE_COUPON_LIST,
    MY_COUPON_DETAIL_GET_DATA,
    MY_COUPON_LIST_SWITCH_CURRENT_COUPON_TYPE
} from "../constants/ActionTypes"

/**
 * 优惠券 -分页
 */
export function pageMyCoupon(pageNumber, pageSize, memberCouponPageType, oldContent = []) {
    return (dispatch) => {
        const url = 'wap/member/pageNewMemberCoupon';
        let data = {
            page: pageNumber,
            memberCouponPageType: memberCouponPageType,
            size: pageSize
        };
        window.jsonFetch(
            url, {
                method: 'POST',
                body: JSON.stringify(data)
            }, json => {
                const action = {
                    type: MY_COUPON_LIST_PAGE_COUPON_LIST,
                    data: {
                        page: pageNumber,
                        size: pageSize,
                        content: pageNumber>0?oldContent.concat(json.data):json.data,
                        total: json.recordsFiltered,

                    }
                };
                dispatch(action);
            }
        );
    }
}

/**
 * 查询优惠券详情
 * @param couponPermissionId 优惠券 使用 权限 ID
 * @param couponApplyProductCallbackFuns
 * @param couponApplyStoreListCallbackFuns
 */
export function getDetail(couponPermissionId,couponApplyProductCallbackFuns = () => {},couponApplyStoreListCallbackFuns= () => {}) {
    return (dispatch) => {
        const url = 'wap/member/findMemberCouponDetails?couponPermissionId=' + couponPermissionId;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: MY_COUPON_DETAIL_GET_DATA,
                    data: json
                });
                couponApplyProductCallbackFuns(json);
                couponApplyStoreListCallbackFuns(json);
            });
    }
}

/**
 *  改变tab按钮
 */
export function changeType(type) {
    return (dispatch) => {
        dispatch({
            type: MY_COUPON_LIST_SWITCH_CURRENT_COUPON_TYPE,
            data:type
        })
    }
}
