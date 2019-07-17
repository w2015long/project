/**
 * @author chencheng
 * @date 2018/3/31
 */

import {
    COMMON_AFFIX_FOR_LIST_CHANGE_INDEX,
    COMMON_ADDRESS_INIT,
    COMMON_ADDRESS_ADD,
    COMMON_GET_LOGISTICS_INFO,
    COMMON_CONFIRM,
    COMMON_SET_SHOW_SHARE_GUIDE,
    COMMON_SET_PROMPT,
    COMMON_SEND_SMS_FREQUENCY
} from '../constants/ActionTypes';
import * as types from "../../bargain/constants/ActionTypes";


const commonState = {
    affixIndex: -1,
    addressList: [],
    showAddressAdd: false,
    logisticsInfo: {
        Traces:[]
    },
    confirmInfo: {
        showConfirm: 'N',
        tips: '',
        confirmFunc: () => {},
        cancelFunc: () => {}
    },
    sendSmsFrequency: 60,
    isShowShareGuide: false,
    isPrompt: true,

};


export default function (state = commonState, action) {
    switch (action.type) {
        case COMMON_AFFIX_FOR_LIST_CHANGE_INDEX:
            return Object.assign({}, state, {
                affixIndex: action.affixIndex
            });
        case COMMON_ADDRESS_INIT://公共地址初始化
            return Object.assign({}, state, {
                addressList: action.addressList,
                showAddressAdd: action.showAddressAdd
            });
        case COMMON_ADDRESS_ADD://地址新增
            return Object.assign({}, state, {
                showAddressAdd: action.showAddressAdd
            });
        case COMMON_GET_LOGISTICS_INFO://获取物流信息
            return Object.assign({}, state, {
                logisticsInfo: action.data
            });
        case COMMON_CONFIRM://确认框
            return Object.assign({}, state, {
                confirmInfo: action.confirmInfo,
                cancelFunc: action.cancelFunc
            });
        case COMMON_SEND_SMS_FREQUENCY://短信发送时间间隔
            return Object.assign({}, state, {
                sendSmsFrequency: action.sendSmsFrequency
            });
        case COMMON_SET_SHOW_SHARE_GUIDE://分享指导箭头
            return Object.assign({}, state, {
                isShowShareGuide: action.data
            });
        case COMMON_SET_PROMPT://离开确认
            return Object.assign({}, state, {
                isPrompt: action.data
            });
        default:
            return state;
    }
}
