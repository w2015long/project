import {
    MEMBER_SIGN_IN_OR_SIGN_UP_TIPS,
    MEMBER_SIGN_IN_OR_SIGN_UP_RESEND_SMS,
    MEMBER_SIGN_IN_OR_SIGN_UP_SMS_RESEND_LIMIT_SECOND,
    MEMBER_SIGN_IN_OR_SIGN_UP_SHOW_MEMBER_NAME,
    MEMBER_SIGN_IN_OR_SIGN_UP_RESET_INPUT,
    MEMBER_SIGN_IN_OR_SIGN_UP_RESET_STATE_BEFORE_LEAVE
} from '../constants/ActionTypes';

const memberSignInOrSignUpState = {
    tipsText: '',
    resendSmsSecond: 0,
    smsResendLimitSecond: 60,
    showMemberName: false,
    mobile: '',
    validateCode: '',
    name: ''
};

export default function (state = memberSignInOrSignUpState, action) {
    switch (action.type){
        case MEMBER_SIGN_IN_OR_SIGN_UP_TIPS:
            return Object.assign({}, state, {
                tipsText: action.tipsText
            });
        case MEMBER_SIGN_IN_OR_SIGN_UP_RESEND_SMS:
            return Object.assign({}, state, {
                resendSmsSecond: action.resendSmsSecond
            });
        case MEMBER_SIGN_IN_OR_SIGN_UP_SMS_RESEND_LIMIT_SECOND:
            return Object.assign({}, state, {
                smsResendLimitSecond: action.smsResendLimitSecond
            });
        case MEMBER_SIGN_IN_OR_SIGN_UP_SHOW_MEMBER_NAME:
            return Object.assign({}, state, {
                showMemberName: action.showMemberName,
                mobile: action.mobile
            });
        case MEMBER_SIGN_IN_OR_SIGN_UP_RESET_INPUT:
            return Object.assign({}, state, {
                mobile: action.mobile,
                validateCode: action.validateCode,
                name: action.name
            });
        case MEMBER_SIGN_IN_OR_SIGN_UP_RESET_STATE_BEFORE_LEAVE:
            return Object.assign({}, state, {
                tipsText: action.tipsText,
                resendSmsSecond: action.resendSmsSecond,
                smsResendLimitSecond: action.smsResendLimitSecond,
                showMemberName: action.showMemberName,
                mobile: action.mobile,
                validateCode: action.validateCode,
                name: action.name
            });
        default:
            return state;
    }
}