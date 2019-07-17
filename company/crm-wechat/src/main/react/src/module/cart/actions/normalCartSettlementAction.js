import {NORMAL_CART_SETTLEMENT_INFO} from '../constants/ActionTypes';
import {wxPay} from '../../common/actions/jssdkAction';


/**
 * 获取购物车
 */
export function getNormalCartSettlementInfo(goBackFunc = () => {}, initPageState = () => {}) {
    return (dispatch) => {
        const url = '/wap/normalCart/getCart?isCartRequest=N';
        window.jsonFetch(
            url,
            {},
            json => {

                const action = {
                    type: NORMAL_CART_SETTLEMENT_INFO,
                    normalCart: json
                };

                dispatch(action);

                if (typeof initPageState === 'function'){
                    initPageState();
                }
            }
        );
    }
}

/**
 * 地址选择回调
 * @param receiverAddrId    收货地址Id
 * @param callBackFunc   回调函数
 */
export function addressSelectCallback(receiverAddrId, callBackFunc = () => {}) {
    return(dispatch) => {
        const url = '/wap/normalCart/updateDeliveryAddr?receiverAddrId='+receiverAddrId;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: NORMAL_CART_SETTLEMENT_INFO,
                    normalCart: json
                };

                dispatch(action);
                callBackFunc();
            }
        );
    };
}

/**
 * 更新优惠券信息
 * @param couponPermissionId    优惠券使用权限Id
 * @returns {Function}
 */
export function updateCouponInfo(couponPermissionId,history) {
    return (dispatch) => {
        const url = '/wap/normalCart/updateCouponInfo?couponPermissionId='+couponPermissionId;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: NORMAL_CART_SETTLEMENT_INFO,
                    normalCart: json
                };

                dispatch(action);
                history.goBack();
            }
        );
    };
}

/**
 * 更新账户余额使用信息
 * @param isUseBalance
 */
export function updateBalanceDeductionInfo(isUseBalance = 'N') {
    return (dispatch) => {
        const url = '/wap/normalCart/updateBalanceDeductionInfo?isUseBalance='+isUseBalance;
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

/**
 * 修改期望送达日期
 * @param expectArriveTime
 * @returns {function(*)}
 */
export function updateExpectArriveTime(expectArriveTime = '') {
    return(dispatch) => {
        const url = '/wap/normalCart/updateExpectArriveTime?expectArriveTime='+expectArriveTime;
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

/**
 * 修改订单自提状态
 * @returns {Function}
 */
export function changeSelfExtractState(callBackFunc = () => {}) {
    return(dispatch) => {
        const url = '/wap/normalCart/changeSelfExtractState';
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: NORMAL_CART_SETTLEMENT_INFO,
                    normalCart: json
                };

                dispatch(action);
                callBackFunc();
            }
        );
    }
}

export function afterPay(orderIds, history) {
    //支付一笔订单
    if(orderIds.indexOf(',')===-1){
        history.push('/order/detail/' + orderIds);
    }else{//支付多笔订单
        history.push('/order/list/all');
    }
}

/**
 * 订单提交
 * @param normalCart
 * @param state
 * @param history
 * @returns {function()}
 */
export function saveOrder(normalCart, state, history) {
    return() => {
        if(state.isPay){
            return;
        }

        state.isPay = true;
        if(normalCart.isSelfExtract==='N' && !normalCart.receiverAddrId){
            window.warningTip('请选择收货地址');
            state.isPay = false;
            return;
        }

        if(state.platformOfO2O==='Y' && !normalCart.expectArriveTime){
            window.warningTip('请选择送货时间');
            state.isPay = false;
            return;
        }

        if(normalCart.orderTotalAmount===0){
            window.warningTip('购物车无可结算商品');
            state.isPay = false;
            return;
        }

        window.textFetch(
            '/wap/normalCart/saveOrder',
            {
                method: 'POST',
                body: JSON.stringify({memberRemark: state.memberRemark})
            },
            json => {
                if(json.orderState==='UNPAID'){
                    wxPay(
                        'NORMAL',
                        json.orderIds,
                        function () {//支付成功
                            window.successTip('支付成功');
                            afterPay(json.orderIds, history);
                        },
                        function () {//支付失败
                            window.warningTip('支付失败');
                            afterPay(json.orderIds, history);
                        },
                        function () {//取消支付
                            window.warningTip('您已取消支付');
                            afterPay(json.orderIds, history);
                        }
                    );
                }else{
                    window.successTip('订单提交成功');
                    afterPay(json.orderIds, history);
                }
            },
            () => {//下单失败
                state.isPay = false;
            }
        );
    }
}

/**
 * 离开页面前，清理购物车
 */
export function clearCart() {
    return (dispatch) => {
        const url = '/wap/normalCart/clearCart';
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
    }
}
