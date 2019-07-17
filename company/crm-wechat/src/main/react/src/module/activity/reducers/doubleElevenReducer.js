import {DOUBLE_ELEVEN_COUNT_DOWN, INIT_DOUBLE_ELEVEN_INFO} from '../constants/ActionTypes';

const doubleElevenState = {
    timer: {
        hours: 0,
        minutes: 0,
        seconds: 0
    },
    discountProductList: [],
    secondKillProductList: []
};

export default function (state = doubleElevenState, action) {
    switch (action.type){
        case INIT_DOUBLE_ELEVEN_INFO:
            return Object.assign({}, state, action.data);
        case DOUBLE_ELEVEN_COUNT_DOWN:
            return Object.assign({}, state, action.timer);
        default:
            return state;
    }
}