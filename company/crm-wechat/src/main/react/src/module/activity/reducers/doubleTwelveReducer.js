import {INIT_DOUBLE_TWELVE_INFO} from '../constants/ActionTypes';

const doubleTwelveState = {
    secondKillProductCodeList: [],
    redemptionProductCodeList: [],
    discountProductList: []
};

export default function (state = doubleTwelveState, action) {
    switch (action.type) {
        case INIT_DOUBLE_TWELVE_INFO:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}