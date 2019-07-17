import {
    MEMBER_SIGN_IN_OR_SIGN_UP_TIPS,
    MEMBER_SIGN_IN_OR_SIGN_UP_RESEND_SMS,
    MEMBER_SIGN_IN_OR_SIGN_UP_SMS_RESEND_LIMIT_SECOND,
    MEMBER_SIGN_IN_OR_SIGN_UP_SHOW_MEMBER_NAME,
    MEMBER_SIGN_IN_OR_SIGN_UP_RESET_INPUT,
    MEMBER_SIGN_IN_OR_SIGN_UP_RESET_STATE_BEFORE_LEAVE
} from '../constants/ActionTypes';

import {
    REG_MOBILE_PHONE
} from '../../../util/common-reg';

/**
 * 获取短信重发时间间隔
 * @returns {function(*)}
 */
export function getSendSmsFrequency() {
    return(dispatch) => {
        window.textFetch(
            '/wap/chainSysSetting/getSendSmsFrequency',
            {},
            json => {
                const action = {
                    type: MEMBER_SIGN_IN_OR_SIGN_UP_SMS_RESEND_LIMIT_SECOND,
                    smsResendLimitSecond: json
                };

                dispatch(action);
            }
        );
    }
}

/**
 * 显示提示语
 * @param dispatch
 * @param tipsText
 */
function showTips(dispatch, tipsText) {
    const action = {
        type: MEMBER_SIGN_IN_OR_SIGN_UP_TIPS,
        tipsText: tipsText
    };

    dispatch(action);
    setTimeout(() => hiddenTips(dispatch), 3000);
}

/**
 * 隐藏提示语
 * @returns {function(*)}
 */
function hiddenTips(dispatch) {
    const action = {
        type: MEMBER_SIGN_IN_OR_SIGN_UP_TIPS,
        tipsText: ''
    };

    dispatch(action);
}

/**
 * 发送验证码
 * @param mobile
 * @param smsResendLimitSecond
 * @param callbackFuc
 * @returns {function(*)}
 */
export function sendSmsCode(mobile, smsResendLimitSecond, callbackFuc) {
    return(dispatch) => {
        if(REG_MOBILE_PHONE.test(mobile)===false){
            showTips(dispatch, '手机号码格式错误');
            return;
        }

        const url = '/wap/validateCode/sendNormalValidateCode?mobile=' + mobile;
        window.textFetch(
            url,
            {},
            json => {
                showTips(dispatch, '验证码已发送');

                const action = {
                    type: MEMBER_SIGN_IN_OR_SIGN_UP_RESEND_SMS,
                    resendSmsSecond: smsResendLimitSecond
                };

                dispatch(action);
                callbackFuc();
            }
        );
    }
}

/**
 * 重置倒计时
 * @param resendSmsSecond
 * @returns {function(*)}
 */
export function resetResendSecond(resendSmsSecond) {
    return(dispatch) => {
        const action = {
            type: MEMBER_SIGN_IN_OR_SIGN_UP_RESEND_SMS,
            resendSmsSecond: resendSmsSecond
        };

        dispatch(action);
    }
}

/**
 * 检查会员是否存在，已存在直接登录，不存在继续后面的流程
 * @param mobile
 * @param validateCode
 * @param history
 * @param pageSate
 * @returns {function(*)}
 */
export function checkMember(mobile, validateCode, history, pageSate) {
    return(dispatch) => {
        if(pageSate.hadSubmit){
            return;
        }

        pageSate.hadSubmit = true;
        if(REG_MOBILE_PHONE.test(mobile)===false){
            showTips(dispatch, '手机号码格式错误');
            pageSate.hadSubmit = false;
            return;
        }

        if(!validateCode){
            showTips(dispatch, '请填写短信验证码');
            pageSate.hadSubmit = false;
            return;
        }

        const data = {
            mobile: mobile,
            validateCode: validateCode
        };

        const url = '/wap/member/checkMember';
        window.textFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data)
            },
            json => {
                if(json==='Y'){
                    history.push('/#/');
                }else{
                    pageSate.hadSubmit = false;
                    dispatch(
                        {
                            type: MEMBER_SIGN_IN_OR_SIGN_UP_SHOW_MEMBER_NAME,
                            showMemberName: true,
                            mobile: mobile
                        }
                    );
                }
            },
            () => {
                pageSate.hadSubmit = false;
            }
        );
    }
}

/**
 * 保存并登录
 * @param mobile
 * @param name
 * @param history
 * @param pageSate
 * @returns {function(*)}
 */
export function saveAndLogin(mobile, name, history, pageSate) {
    return(dispatch) => {
        if(pageSate.hadSubmit){
            return;
        }

        pageSate.hadSubmit = true;
        if(REG_MOBILE_PHONE.test(mobile)===false){
            showTips(dispatch, '手机号码格式错误');
            pageSate.hadSubmit = false;
            return;
        }

        if(!name){
            showTips(dispatch, '会员名称不能为空');
            pageSate.hadSubmit = false;
            return;
        }

        const data = {
            mobile: mobile,
            name: name
        };

        const url = '/wap/member/saveAndLogin';
        window.textFetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(data)
            },
            json => {
                history.push('/#/');
            },
            () => {
                pageSate.hadSubmit = false;
            }
        );
    }
}

/**
 * 输入框变化监听
 * @param mobile
 * @param validateCode
 * @param name
 * @returns {function(*)}
 */
export function resetInput(mobile, validateCode, name) {
    return(dispatch) => {
        const action = {
            type: MEMBER_SIGN_IN_OR_SIGN_UP_RESET_INPUT,
            mobile: mobile,
            validateCode: validateCode,
            name: name
        };

        dispatch(action);
    }
}

/**
 * 重置状态
 * @returns {function(*)}
 */
export function resetStateBeforeLeave() {
    return(dispatch) => {
        const action = {
            type: MEMBER_SIGN_IN_OR_SIGN_UP_RESET_STATE_BEFORE_LEAVE,
            tipsText: '',
            resendSmsSecond: 0,
            smsResendLimitSecond: 60,
            showMemberName: false,
            mobile: '',
            validateCode: '',
            name: ''
        };

        dispatch(action);
    }
}




