/**
 * Created by lcl on 2019/6/21
 */
//引入Action类型
import {
    MEMBER_STORED_VALUE_BALANCE,
    STORED_VALUE_RULE_DETAILS,
    STORED_VALUE_OPTIMAL_AMOUNT,
    CHANGE_REGISTER_ID_CARD_STATE
} from "../constants/ActionTypes";

/**
 * 初始化数据中心
 */
const storedValueState = {
    memberStoredValueBalance:0,
    ruleDetails:[],
    optimalAmount:0,
    registerIDCardState:'N',
};

export default function (state = storedValueState, action) {
    switch (action.type) {
        case MEMBER_STORED_VALUE_BALANCE:
            return Object.assign({}, state, {
                memberStoredValueBalance: action.memberStoredValueBalance,
            });
        case STORED_VALUE_RULE_DETAILS:
            return Object.assign({}, state, {
                ruleDetails: action.ruleDetails,
            });
        case STORED_VALUE_OPTIMAL_AMOUNT:
            return Object.assign({}, state, {
                optimalAmount: action.optimalAmount,
            });
        case CHANGE_REGISTER_ID_CARD_STATE:
            return Object.assign({}, state, {
                registerIDCardState: action.registerIDCardState,
            });
        default:
            return state;
    }
}
