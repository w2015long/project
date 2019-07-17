// 引入定义常量
import {MUTUAL_BARGAIN_SETTLEMENT_DETAIL} from '../../activity/constants/ActionTypes';

const bargainSettlementState = {
    mutualBargainSettlementDetail: {},
};

export default function (state = bargainSettlementState, action) {
    switch (action.type) {
        case MUTUAL_BARGAIN_SETTLEMENT_DETAIL:
            return Object.assign({}, state, {mutualBargainSettlementDetail: action.data});
        default:
            return state;
    }
}