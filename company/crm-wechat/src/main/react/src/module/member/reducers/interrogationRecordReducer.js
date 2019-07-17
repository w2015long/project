/**
 * 问诊
 */
import {
    INTERROGATION_RECORD_LIST,
    INTERROGATION_RECORD_DETAILS,
    YDY_IN_SHOP_LIST,
} from "../constants/ActionTypes";

/** 定义数据 */
const interrogationRecordState = {
    // 问诊分页
    pageYdyPrescription : {
        page:0,
        size:10,
        prescriptionData:[],
    },

    // 问诊详情
    prescriptionDetails:[],

    // 会员问诊状态
    prescriptionDrugsState:"BOOKING",

    ydyInShopList:[],
}

/**
 * reducer方法
 * @param state 上次的state
 * @param action
 * @returns {*}
 */
export default function (state = interrogationRecordState, action) {
    switch (action.type) {
        case INTERROGATION_RECORD_LIST:
            return Object.assign({}, state, {
                pageYdyPrescription: action.data
            });
        case INTERROGATION_RECORD_DETAILS:
            return Object.assign({}, state, {
                prescriptionDetails: action.data,
                prescriptionDrugsState:action.data.prescriptionDrugsState,
            });
        case YDY_IN_SHOP_LIST:
            return Object.assign({}, state, {
                ydyInShopList: action.data,
            });
        default:
            return state;
    }
}