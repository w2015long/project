/**
 * 储值action
 * @author lcl
 */
import {
    MEMBER_STORED_VALUE_BALANCE,
    STORED_VALUE_RULE_DETAILS,
    STORED_VALUE_OPTIMAL_AMOUNT,
    CHANGE_REGISTER_ID_CARD_STATE
} from "../constants/ActionTypes";

/**
 * 查询会员余额以及身份
 * @returns {Function}
 */
export function findMemberStoredValueBalance() {
    return (dispatch) => {
        const url = '/wap/storedValue/findMemberStoredValueBalance';
        window.textFetch(
            url,
            {},
            json => {
                dispatch({
                    type: MEMBER_STORED_VALUE_BALANCE,
                    memberStoredValueBalance: json
                });
            }
        );
    }
}

/**
 * 改变是否登记身份证信息
 * @param isRegister 是否登记
 */
export function changeRegisterIDCardState(isRegister) {
    return (dispatch) => {
        dispatch({
            type: CHANGE_REGISTER_ID_CARD_STATE,
            registerIDCardState: isRegister
        })
    }
}

/**
 * 查询储值规则详情
 * @returns {Function}
 */
export function findStoreValueRuleDetails() {
    return (dispatch) => {
        const url = '/wap/storedValue/findStoreValueRuleDetails';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: STORED_VALUE_RULE_DETAILS,
                    ruleDetails: json
                });
            }
        );
    }
}

/**
 * 查询对应金额最优返利金额
 * @param storeValueRuleId 储值规则Id
 * @param amount 金额
 * @param callBack 回调函数
 * @returns {Function}
 */
export function findOptimalStoredValueRule(storeValueRuleId, amount,callBack=()=>{}) {
    return (dispatch) => {
        const url = '/wap/storedValue/findOptimalStoredValueRule?storeValueRuleId=' + storeValueRuleId + '&amount=' + amount;
        window.textFetch(
            url,
            {},
            json => {
                dispatch({
                    type: STORED_VALUE_OPTIMAL_AMOUNT,
                    optimalAmount: json
                });
                callBack();
            }
        );
    }
}