import {MUTUAL_BARGAIN_ADDRESS_INIT} from "../../activity/constants/ActionTypes";

/**
 * 初始化收货地址
 * @returns {function(*)}
 */
export function getBargainAddressList(mutualBargainActivityId, mutualBargainShareRecordId) {
    return (dispatch) => {
        const url = '/wap/mutualBargainAddress/listReceiverAddr?mutualBargainActivityId=' + mutualBargainActivityId + "&mutualBargainShareRecordId=" + mutualBargainShareRecordId;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: MUTUAL_BARGAIN_ADDRESS_INIT,
                    addressList: json,
                };

                dispatch(action);
            }
        );
    }
}

