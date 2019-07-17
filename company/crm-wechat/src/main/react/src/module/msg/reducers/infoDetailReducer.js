/**
 * @author kwy
 * @date 2018/8/15
 * 资讯中心
 */
import {INFO_DETAIL_DATE} from "../constants/ActionTypes"

const infoDetailState = {
    infoDetail: {}
};

export default function (state = infoDetailState, action) {
    switch (action.type) {
        case INFO_DETAIL_DATE:
            return Object.assign({}, state, {
                infoDetail: action.data
            });
        default:
            return state;
    }
}
