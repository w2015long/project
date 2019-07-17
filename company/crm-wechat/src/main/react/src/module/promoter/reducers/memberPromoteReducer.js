import * as types from "../constants/ActionTypes";


const memberPromoteState = {
    publicNumberPicture: "",
    isShowInviteLayer: "", //是否展示邀请弹窗
    isLogin: "", //是否登录
    sharerId: "", //
    loginMemberId: "", //
    promoterList: ""
};

export default function (state = memberPromoteState, action) {
    switch (action.type) {
        case types.MEMBER_PROMOTE_GET_PUBLIC_NUMBER_PICTURE:
            return Object.assign({}, state, {
                publicNumberPicture: action.publicNumberPicture,

            });
        case types.MEMBER_PROMOTE_GET_PROMOTER_LIST:
            return Object.assign({}, state, {
                promoterList: action.promoterList?action.promoterList:memberPromoteState.promoterList,
                isLogin: action.isLogin,
            });
        case types.MEMBER_PROMOTE_CHANGE_LAYER_STATE:
            return Object.assign({}, state, {
                isShowInviteLayer: action.data,
            });
        case types.MEMBER_PROMOTE_SET_SHARER_ID:
            return Object.assign({}, state, {
                sharerId: action.data,
            });
        case types.MEMBER_PROMOTE_GET_LOGIN_MEMBER_ID:
            return Object.assign({}, state, {
                loginMemberId: action.loginMemberId,
            });
        default:
            return state;
    }
}

