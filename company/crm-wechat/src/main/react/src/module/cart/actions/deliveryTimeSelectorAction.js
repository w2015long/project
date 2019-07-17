import {
    NORMAL_CART_SETTLEMENT_DELIVERY_TIME_SELECT,
    NORMAL_CART_SETTLEMENT_DELIVERY_TIME_SELECTOR_INFO
} from "../constants/ActionTypes";

/**
 * 显示配送时间选择器
 * @param expectArriveTime  默认配送时间
 * @param shopId            门店id 砍价
 * @param callbackFunc      回调方法
 * @returns {Function}
 */
export function showDeliveryTimeSelector(expectArriveTime, shopId, callbackFunc = () => {
}) {
    return((dispatch) => {
        let url = "";
        if (shopId) {
            url = '/wap/normalCart/getDeliveryTime?shopId=' + shopId;
        } else {
            url = '/wap/normalCart/getDeliveryTime';
        }
        window.jsonFetch(
            url,
            {},
            json => {
                let selectedDayStr = '';
                let selectedTimeStr = '';
                if(expectArriveTime){
                    selectedDayStr = expectArriveTime.substring(0, expectArriveTime.indexOf(' '));
                    selectedTimeStr = expectArriveTime.substring(expectArriveTime.indexOf(' ') + 1);
                } else if(json){
                    if (json.length <= 0){
                        window.warningTip('门店营业时间异常,请联系店员');
                    }
                    selectedDayStr = json[0].dayStr;
                    if(json[0].timeStrList){
                        selectedTimeStr = json[0].timeStrList[0];
                    }
                }

                const action = {
                    type: NORMAL_CART_SETTLEMENT_DELIVERY_TIME_SELECTOR_INFO,
                    deliveryTimeSelectorInfo: {
                        showDeliveryTimeSelector: 'Y',
                        itemList: json,
                        callbackFunc: callbackFunc,
                        selectedDayStr: selectedDayStr,
                        selectedTimeStr: selectedTimeStr
                    }
                };

                dispatch(action);
            });
    });
}

/**
 * 隐藏配送时间选择器
 * @returns {Function}
 */
export function hideDeliveryTimeSelector(selectedDayStr, selectedTimeStr, callbackFunc) {
    return((dispatch) => {
        const action = {
            type: NORMAL_CART_SETTLEMENT_DELIVERY_TIME_SELECTOR_INFO,
            deliveryTimeSelectorInfo: {
                showDeliveryTimeSelector: 'N',
                itemList: [],
                callbackFunc: () => {},
                selectedDayStr: '',
                selectedTimeStr: ''
            }
        };

        if(callbackFunc){
            if(!selectedDayStr){
                window.warningTip('请选择配送日期');
                return;
            }

            if(!selectedTimeStr){
                window.warningTip('请选择配送时间');
                return;
            }
        }

        dispatch(action);
        if (typeof callbackFunc === 'function'){
            callbackFunc();
        }
    });
}

/**
 * 选择配送时间
 * @param selectedDayStr    配送日期
 * @param selectedTimeStr   配送时间
 */
export function selectDeliveryTime(selectedDayStr, selectedTimeStr) {
    return((dispatch) => {
        const action = {
            type: NORMAL_CART_SETTLEMENT_DELIVERY_TIME_SELECT,
            selectedDayStr: selectedDayStr,
            selectedTimeStr: selectedTimeStr
        };

        dispatch(action);
    });
}