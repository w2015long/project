import {INIT_NEW_MEMBER_EXCLUSIVE_INFO} from "../constants/ActionTypes";

/**
 * 初始化
 */
export function getNewMemberExclusiveInitData(callBackFun = () => {
}) {
    return (dispatch) => {
        const url = '/wap/newMemberExclusive/getNewMemberExclusiveInitData';
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: INIT_NEW_MEMBER_EXCLUSIVE_INFO,
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