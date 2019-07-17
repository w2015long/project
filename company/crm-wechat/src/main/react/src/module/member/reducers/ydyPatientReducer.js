/**
 * Created by kwy on 2019/5/17
 */
//引入Action类型
import {
   YDY_PATIENT_LIST,
   YDY_PATIENT_DETAIL
} from "../constants/ActionTypes";

/**
 * 初始化数据中心
 */
const ydyPatientState = {
    ydyPatientList:[],
    ydyPatientDetail:{}
};

export default function (state = ydyPatientState, action) {
    switch (action.type) {
        case YDY_PATIENT_LIST:
            return Object.assign({}, state, {
                ydyPatientList: action.ydyPatientList
            });
        case YDY_PATIENT_DETAIL:
            return Object.assign({}, state, {
                ydyPatientDetail: action.ydyPatientDetail
            });
        default:
            return state;
    }
}

