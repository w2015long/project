import {INIT_NORMAL_CART_INFO} from '../constants/ActionTypes';

const normalCartState = {
    normalCart:{}
};

export default function (state = normalCartState, action) {
    switch (action.type){
        case INIT_NORMAL_CART_INFO:
            return Object.assign({}, state, {
                normalCart: action.normalCart
            });
        default:
            return state;
    }
}