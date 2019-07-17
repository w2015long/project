/**
 * @author chencheng
 * @date 2018/3/27
 * 门店详情
 */

import {SHOP_GET_SHOP_DETAIL} from '../constants/ActionTypes'

const shopDetailState = {
    shopDetail:{}
};


export default function (state = shopDetailState, action) {
    switch (action.type) {
        case SHOP_GET_SHOP_DETAIL:
            return Object.assign({}, state, {
               shopDetail:action.shopDetail
            });
        default:
            return state;
    }
}
