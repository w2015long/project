/**
 * Created by admin on 2018/3/27.
 */
//引入Action类型
import {
    MEMBER_COUNT_DOWN_TIME,
    MEMBER_INDEX_INFO,
    MEMBER_INPUT_CHANGE,
    MEMBER_INTEREST_LIST,
    MEMBER_IS_SHOW_INTEREST_DETAIL,
    MEMBER_LEVEL_LIST,
    MEMBER_SEND_SMS_FREQUENCY
} from "../constants/ActionTypes";

/**
 * 初始化数据中心
 */
const memberState = {
    memberInfo: {mobile: ""},
    time: 0,
    memberLevelList: [],
    memberInterests: [],
    isShowInterestDetail: false,
    sendSmsFrequency: 60,
    mobile: '',
    validateCode: ''
};

export default function (state = memberState, action) {
    switch (action.type) {
        case MEMBER_INDEX_INFO:
            return Object.assign({}, state, {
                memberInfo: action.memberInfo
            });
        case MEMBER_COUNT_DOWN_TIME:
            return Object.assign({}, state, {
                time: action.time
            });
        case MEMBER_LEVEL_LIST:
            return Object.assign({}, state, {
                memberLevelList: action.memberLevelList
            });
        case MEMBER_INTEREST_LIST:
            return Object.assign({}, state, {
                memberInterests: action.memberInterests
            });
        case MEMBER_IS_SHOW_INTEREST_DETAIL:
            return Object.assign({}, state, {
                isShowInterestDetail: action.isShowInterestDetail
            });
        case MEMBER_SEND_SMS_FREQUENCY:
            return Object.assign({}, state, {
                sendSmsFrequency: action.sendSmsFrequency
            });
        case MEMBER_INPUT_CHANGE:
            return Object.assign({}, state, {
                mobile: action.mobile,
                validateCode: action.validateCode
            });
        default:
            return state;
    }
}

