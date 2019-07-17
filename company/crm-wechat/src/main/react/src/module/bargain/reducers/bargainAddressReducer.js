// 引入定义常量
import {MUTUAL_BARGAIN_ADDRESS_INIT} from '../../activity/constants/ActionTypes';

const bargainAddressState = {
    addressList: [],
};

export default function (state = bargainAddressState, action) {
    switch (action.type) {
        case MUTUAL_BARGAIN_ADDRESS_INIT:
            return Object.assign({}, state, {addressList: action.addressList});
        default:
            return state;
    }
}