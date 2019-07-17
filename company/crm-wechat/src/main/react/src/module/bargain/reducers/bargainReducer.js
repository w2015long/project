import * as types from "../constants/ActionTypes";


const bargainState = {
    bargainActivityInfo: null,
    isShowPrizeReceiveLayer: false,
    isShowRuleInstructionLayer: false,
    firstBargainAmount: 0,

};

export default function (state = bargainState, action) {
    switch (action.type) {
        case types.BARGAIN_ACTIVITY_INFO:
            return Object.assign({}, state, {
                bargainActivityInfo: action.bargainActivityInfo
            });
        case types.BARGAIN_SET_SHOW_PRIZE_RECEIVE_LAYER:
            return Object.assign({}, state, {
                isShowPrizeReceiveLayer: action.data
            });
        case types.BARGAIN_SET_SHOW_RULE_INSTRUCTION_LAYER:
            return Object.assign({}, state, {
                isShowRuleInstructionLayer: action.data
            });
        case types.BARGAIN_SET_FIRST_BARGAIN_AMOUNT:
            return Object.assign({}, state, {
                firstBargainAmount: action.data
            });



        default:
            return state;
    }
}

