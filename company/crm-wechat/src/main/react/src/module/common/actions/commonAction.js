/**
 * @author chencheng
 * @date 2018/4/2
 */
import {COMMON_GET_LOGISTICS_INFO,
    COMMON_CONFIRM,
    COMMON_SET_SHOW_SHARE_GUIDE,
    COMMON_SET_PROMPT,
    COMMON_SEND_SMS_FREQUENCY} from '../constants/ActionTypes';

/**
 * 获取服务器时间
 */
export function getSystemTime(callbackFunc){
    const url = '/wap/systemTime';
    window.textFetch(
        url,
        {},
        timeStr=>{
            if (typeof callbackFunc === "function") {
                callbackFunc(new Date(timeStr));
            }
        }
    );
}

/**
 * 获取物流信息
 * @param logisticsCompanyCode 物流公司编码
 * @param logisticsOrderNum 物流单号
 */
export function findLogistics(logisticsCompanyCode, logisticsOrderNum) {
    return(dispatch) => {
        const url = '/wap/findLogistics?logisticsCompanyCode='+logisticsCompanyCode+'&logisticsOrderNum='+logisticsOrderNum;
        window.jsonFetch(
            url,
            {},
            text => {
                const action = {
                    type: COMMON_GET_LOGISTICS_INFO,
                    data: text
                };
                dispatch(action);
            }
        );
    }
}

/**
 * 显示确认框
 * @param tips          确认信息
 * @param confirmFunc   确认回调方法
 * @param cancelFunc    取消回调方法
 * @returns {Function}
 */
export function showConfirm(tips = '', confirmFunc = () => {},cancelFunc = () => {}) {
    return(dispatch) => {
        const action = {
            type: COMMON_CONFIRM,
            confirmInfo: {
                showConfirm: 'Y',
                tips: tips,
                confirmFunc: confirmFunc,
                cancelFunc: cancelFunc
            }
        };

        dispatch(action);
    }
}

/**
 * 隐藏确认框
 * @returns {Function}
 */
export function hideConfirm() {
    return(dispatch) => {
        const action = {
            type: COMMON_CONFIRM,
            confirmInfo: {
                showConfirm: 'N',
                tips: '',
                confirmFunc: () => {}
            }
        };

        dispatch(action);
    }
}
/**
 * 隐藏/显示 微信分享指导弹窗
 * @returns {Function}
 */
export function setShowShareGuide(data) {
    return(dispatch) => {
        const action = {
            type: COMMON_SET_SHOW_SHARE_GUIDE,
            data: data
        };
        dispatch(action);
    }
}
/**
 * 隐藏/显示 离开确认弹窗
 * @returns {Function}
 */
export function setPrompt(data) {
    return(dispatch) => {
        const action = {
            type: COMMON_SET_PROMPT,
            data: data
        };
        dispatch(action);
    }
}

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
                    type: COMMON_SEND_SMS_FREQUENCY,
                    sendSmsFrequency: json
                };

                dispatch(action);
            }
        );
    }
}