import * as types from "../constants/ActionTypes";


const cardState = {
    cardInfo: null,
    memberRegister: null,
    isNewMember: "",//是否新会员
    cardNumber: "",//会员卡号
    submitState: "",// 提交状态
    errorMsg: "",// 错误信息
    rewardList: "",//
};

export default function (state = cardState, action) {
    switch (action.type) {
        case types.MEMBER_CARD_INFO:
            return Object.assign({}, state, {
                cardInfo: action.data
            });
        case types.MEMBER_REGISTER_INFO:
            return Object.assign({}, state, {
                memberRegister: action.data
            });
        case types.MEMBER_CARD_GET_NEW_MEMBER_REWARD_LIST:
            return Object.assign({}, state, {
                rewardList: action.rewardList
            });

        case types.MEMBER_SUBMIT_STATE:
            return Object.assign({}, state, {
                submitState: action.data.submitState ? action.data.submitState : cardState.submitState,
                isNewMember: action.data.isNewMember ? action.data.isNewMember : cardState.isNewMember,
                cardNumber: action.data.cardNumber ? action.data.cardNumber : cardState.cardNumber,
                errorMsg: action.data.errorMsg ? action.data.errorMsg : cardState.errorMsg,
            });

        default:
            return state;
    }
}

