
import {
    ACCOUNT_TRANS_LOG_LIST,
    ACCOUNT_TRANS_LOG_DETAILS,
    SYSTEM_TIME
} from "../constants/ActionTypes";

/**
 * 初始化数据中心
 */
const accountTransLogState = {
    accountTransLogList:{},
    accountTransLogDetails:{},
    systemTime:''
};

export default function (state = accountTransLogState, action) {
    switch (action.type) {
        case ACCOUNT_TRANS_LOG_LIST:
            return Object.assign({}, state, {
                accountTransLogList: action.json
            });
        case ACCOUNT_TRANS_LOG_DETAILS:
            return Object.assign({}, state, {
                accountTransLogDetails: action.json
            });
        case SYSTEM_TIME:
            return Object.assign({}, state, {
                systemTime: action.data
            });
        default:
            return state;
    }
}

