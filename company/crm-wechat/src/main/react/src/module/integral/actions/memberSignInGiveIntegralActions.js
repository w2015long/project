/**
 * Created by admin on 2018/4/2.
 */
import {
    INTEGRAL_IS_SHOW_SIGN_IN_SUCCESS_VIEW,
    INTEGRAL_MEMBER_SIGN_IN_INTEGRAL_INFO,
    INTEGRAL_RECOMMEND_PRODUCT
} from "../constants/ActionTypes";

/**
 * 会员签到积分信息
 */
export function getMemberSignInIntegralInfo(callBack) {
    return (dispatch) => {
        const url = '/wap/integral/findMemberSignInIntegralInfo';
        window.textFetch(
            url, {}, json => {
                dispatch({
                    type: INTEGRAL_MEMBER_SIGN_IN_INTEGRAL_INFO,
                    signInInfo: json
                })
                callBack();
            }
        );
    }
}

/**
 * 是否展示签到成功弹层
 */
export function isShowSignInSuccessView(isShow) {
    return function (dispatch) {
        dispatch({
            type: INTEGRAL_IS_SHOW_SIGN_IN_SUCCESS_VIEW,
            isShowSignInSuccessView: isShow
        })
    }
}

/**
 * 签到
 */
export function signIn(callback) {
    return (dispatch) => {
        const url = '/wap/integral/signIn';
        window.textFetch(
            url, {}, json => {
                callback();
            },
            error=>{
                if(typeof error==='object' && error.errCode ==="MEMBER_SIGN_REPEAT_SIGN"){
                    window.warningTip("您今天已经签到过了");
                    return false;
                }else
                    return true;
            }
        );
    }
}

/**
 * 积分推荐商品
 */
export function pageIntegralRecommendProduct(pageIntegralProduct) {
    return (dispatch) => {
        const url = '/wap/integral/pageIntegralProduct?page=' + pageIntegralProduct.page + "&size=" + pageIntegralProduct.size;
        window.jsonFetch(
            url, {}, json => {
                dispatch({
                    type: INTEGRAL_RECOMMEND_PRODUCT,
                    data: {
                        page: pageIntegralProduct.page,
                        size: pageIntegralProduct.size,
                        content: pageIntegralProduct.content.concat(json.data),
                        recordsFiltered: json.recordsFiltered
                    }
                })
            }
        );
    }
}