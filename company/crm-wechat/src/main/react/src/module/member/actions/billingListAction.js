
import {
    ACCOUNT_TRANS_LOG_LIST,
    SYSTEM_TIME,
    ACCOUNT_TRANS_LOG_DETAILS
} from "../constants/ActionTypes";


/**
 * 获取服务器时间
 */
export function getSystemTimeAction(successCallback = ()=>{}) {
    return (dispatch) => {
        //发起一个fetch请求
        const url = '/wap/member/getSystemTime';
        window.textFetch(
            url,
            {},
            data => {
                dispatch({
                    type: SYSTEM_TIME,
                    data: data
                });
                successCallback(data);
            }
        );
    }
}

/**
 * 查询会员账单列表
 */
export function accountTransLogListAction(month,successCallback = ()=>{}) {
    return (dispatch) => {
        //发起一个fetch请求
        const url = '/wap/member/findAccountTransLog?month='+month;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: ACCOUNT_TRANS_LOG_LIST,
                    json: json
                });
                successCallback(json);
            }
        );
    }
}


/**
 * 查询会员账单详情
 */
export function accountTransLogDetailsAction(transLogId,successCallback = ()=>{}) {
    return (dispatch) => {
        //发起一个fetch请求
        const url = '/wap/member/findAccountTransLogDetails?transLogId='+transLogId;
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type: ACCOUNT_TRANS_LOG_DETAILS,
                    json: json
                });
                successCallback(json);
            }
        );
    }
}