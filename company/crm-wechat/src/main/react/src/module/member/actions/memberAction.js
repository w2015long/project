/**
 * Created by admin on 2018/3/27.
 */
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
 * 获取会员中心首页信息
 */
export function getMemberInfo(successCallback = ()=>{}) {
    return (dispatch) => {
        //发起一个fetch请求
        const url = '/wap/member/findMemberInfo';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: MEMBER_INDEX_INFO,
                    memberInfo: json
                });
                successCallback(json);
            }
        );
    }
}

/**
 * 获取验证码
 */
export function getValidCode(mobile, callback) {
    return (dispatch) => {
        const url = '/wap/validateCode/sendNormalValidateCode?mobile=' + mobile;
        window.textFetch(
            url,
            {},
            json => {
                callback(true);
            }
        );
    }
}

/**
 * 获取验证码倒计时
 */
export function countDownTime(time) {
    return (dispatch) => {
        dispatch({
            type: MEMBER_COUNT_DOWN_TIME,
            time: time
        })
    }
}

/**
 * 校验验证码
 */
export function validateCode(mobile, validCode, callback) {
    return (dispatch) => {
        const url = '/wap/member/validateCode?mobile=' + mobile + "&validCode=" + validCode;
        window.textFetch(
            url,
            {},
            json => {
                callback(true);
            }
        );
    }
}

export function changeMobile(mobile, callback) {
    return (dispatch) => {
        const url = '/wap/member/changeMobile?mobile=' + mobile;
        window.textFetch(
            url,
            {method: 'POST'},
            json => {
                callback(true);
            }
        );
    }
}


/**
 * 获取会员等级列表
 */
export function getMemberLevelList(callback) {
    return (dispatch) => {
        const url = '/wap/member/memberLevelList';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: MEMBER_LEVEL_LIST,
                    memberLevelList: json
                });
                callback(json);
            }
        );
    }
}

/**
 * 获取会员权益
 */
export function getMemberInterests(levelId) {
    return (dispatch) => {
        const url = '/wap/member/findMemberInterestsByLevelId/' + levelId;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: MEMBER_INTEREST_LIST,
                    memberInterests: json
                });
            }
        );
    }
}

export function isShowInterestDetail(isShow) {
    return (dispatch) => {
        dispatch({
            type: MEMBER_IS_SHOW_INTEREST_DETAIL,
            isShowInterestDetail: isShow
        })
    }
}

export function getSendSmsFrequency() {
    return (dispatch) => {
        const url = '/wap/chainSysSetting/getSendSmsFrequency';
        window.textFetch(
            url, {},
            json => {
                dispatch({
                    type: MEMBER_SEND_SMS_FREQUENCY,
                    sendSmsFrequency: json
                });
            }
        );
    }
}

/**
 * 输入框变化监听
 */
export function inputChange(mobile, validateCode) {
    return(dispatch) => {
        dispatch({
            type: MEMBER_INPUT_CHANGE,
            mobile: mobile,
            validateCode: validateCode
        });
    }
}