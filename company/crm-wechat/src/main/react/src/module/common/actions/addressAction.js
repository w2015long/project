import {COMMON_ADDRESS_ADD, COMMON_ADDRESS_INIT} from "../constants/ActionTypes";

/**
 * 初始化收货地址
 * @returns {function(*)}
 */
export function getAddressList(needJudgeDistributionRange = 'N') {
    return(dispatch) => {
        const url = '/wap/receiverAddr/listReceiverAddr?needJudgeDistributionRange='+needJudgeDistributionRange;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: COMMON_ADDRESS_INIT,
                    addressList: json,
                    showAddressAdd: false
                };

                dispatch(action);
            }
        );
    }
}

/**
 *
 * @returns {function(*)}
 */
export function showAddressAddView(isShow) {
    return (dispatch) => {
        const action = {
            type: COMMON_ADDRESS_ADD,
            showAddressAdd: isShow
        };

        dispatch(action);
    }
}