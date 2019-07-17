/**
 * Created by admin on 2018/4/2.
 */
import {
    INTEGRAL_IS_SHOW_SIGN_IN_SUCCESS_VIEW,
    INTEGRAL_MEMBER_SIGN_IN_INTEGRAL_INFO,
    INTEGRAL_RECOMMEND_PRODUCT
} from "../constants/ActionTypes";

const integralSignInState = {
    signInInfo: {signInGiveIntegrals: []},
    isShowSignInSuccessView: false,
    pageIntegralProduct: {//推荐商品分页
        page: 0,
        size: 10,
        content: [],
        recordsFiltered: 0
    }
};

export default function (state = integralSignInState, action) {
    switch (action.type) {
        case INTEGRAL_MEMBER_SIGN_IN_INTEGRAL_INFO:
            return Object.assign({}, state, {
                signInInfo: action.signInInfo
            });
        case INTEGRAL_IS_SHOW_SIGN_IN_SUCCESS_VIEW:
            return Object.assign({}, state, {
                isShowSignInSuccessView: action.isShowSignInSuccessView
            });
        case INTEGRAL_RECOMMEND_PRODUCT:
            return Object.assign({}, state, {
                pageIntegralProduct: action.data
            });
        default:
            return state;
    }
}
