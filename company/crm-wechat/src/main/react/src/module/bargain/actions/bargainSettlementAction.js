import {MUTUAL_BARGAIN_SETTLEMENT_DETAIL} from "../../activity/constants/ActionTypes";
import {wxPay} from "../../common/actions/jssdkAction";

/**
 * 初始化砍价结算页
 * @returns {function(*)}
 */
export function showBargainSettlementDetail(mutualBargainShareRecordId, mutualBargainActivityId) {
    return (dispatch) => {
        const url = '/wap/mutualBargainSettlement/showBargainSettlementDetail?mutualBargainShareRecordId=' + mutualBargainShareRecordId + '&mutualBargainActivityId=' + mutualBargainActivityId;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: MUTUAL_BARGAIN_SETTLEMENT_DETAIL,
                    data: json
                };

                dispatch(action);
            }
        );
    }
}

/**
 * 订单提交
 * @param submitData
 * @param state
 * @param history
 * @returns {function()}
 */
export function saveOrder(submitData, state, history) {
    return () => {
        if (state.isPay) {
            return;
        }

        state.isPay = true;

        window.textFetch(
            '/wap/mutualBargainSettlement/saveOrder',
            {
                method: 'POST',
                body: JSON.stringify(submitData)
            },
            json => {
                if (json.orderState === 'UNPAID') {
                    wxPay(
                        'NORMAL',
                        json.orderId,
                        function () {//支付成功
                            //支付一笔订单
                            history.push('/order/detail/' + json.orderId);
                            window.successTip('支付成功');
                        },
                        function () {//支付失败
                            history.push('/order/list/all');
                            window.warningTip('支付失败');
                        },
                        function () {//取消支付
                            history.push('/order/list/all');
                            window.warningTip('您已取消支付');
                        }
                    );
                } else {
                    history.push('/order/list/all');
                }
            },
            () => {//下单失败
                state.isPay = false;
            }
        );
    }
}
