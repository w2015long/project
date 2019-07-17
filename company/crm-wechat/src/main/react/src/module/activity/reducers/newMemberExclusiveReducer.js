import {INIT_NEW_MEMBER_EXCLUSIVE_INFO} from '../constants/ActionTypes';

const newMemberExclusiveState = {
    couponList: [],
    discountProductList: []
};

export default function (state = newMemberExclusiveState, action) {
    switch (action.type) {
        case INIT_NEW_MEMBER_EXCLUSIVE_INFO:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}