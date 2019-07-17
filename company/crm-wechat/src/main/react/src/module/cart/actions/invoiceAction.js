import {NORMAL_CART_SETTLEMENT_INFO} from "../constants/ActionTypes";

/**
 * 更新账户余额使用信息
 * @param isNeedInvoice
 * @param invoiceTitle
 * @param taxNum
 * @param history
 */
export function updateInvoiceInfo(isNeedInvoice = 'N', invoiceTitle, taxNum) {
    return (dispatch) => {
        const url = '/wap/normalCart/updateInvoiceInfo?isNeedInvoice='+isNeedInvoice+'&invoiceTitle='+invoiceTitle+'&taxNum='+taxNum;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: NORMAL_CART_SETTLEMENT_INFO,
                    normalCart: json
                };

                dispatch(action);
            }
        );
    };
}