import {INIT_DOUBLE_TWELVE_INFO} from "../../activity/constants/ActionTypes";

/**
 * 初始化
 */
export function getDoubleTwelveInitData(callBackFun = () => {
}) {
    return (dispatch) => {
        const url = '/wap/doubleTwelve/getDoubleTwelveInitData';
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: INIT_DOUBLE_TWELVE_INFO,
                    data: json
                };

                dispatch(action);

                if (typeof callBackFun === 'function') {
                    callBackFun();
                }
            }
        );
    }
}