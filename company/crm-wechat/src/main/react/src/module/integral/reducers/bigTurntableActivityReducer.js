import * as type from '../constants/ActionTypes';
const INITDATA = {
    balance:"",//用户积分
    deductIntegral:"",// 扣减积分
    userWinningRecord:[],//用户奖品
    winningRecords:[],//中奖记录
    bigTurntablePrizeProtocols:[],//活动奖品

};
const turntableState={

    initData:INITDATA,
    isShowUserWinningRecordLayer:false,
    winPrize:{
        bigTurntablePrizeId: "",//奖品 ID
        prizeName: "",//奖品名称
        prizePicUrl: "",// 奖品图片
        prizeType: "",//奖品类型
        receiveNtegralNum: "",//获得积分
        couponAmount: "",//购物券面额
    },
    selectPoint:null//指针

};

export default function (state = turntableState, action) {
    switch (action.type) {
        case type.INTEGRAL_TURNTABLE_GET_INIT_WINPRIZE:
            return Object.assign({},state,{
                initData:action.initData
            });
        case type.INTEGRAL_TURNTABLE_SET_IS_SHOW_USER_WINNING_RECORD_LAYER:
            return Object.assign({},state,{
                isShowUserWinningRecordLayer:!state.isShowUserWinningRecordLayer
            });
        case type.INTEGRAL_TURNTABLE_GET_RESULT:
            return Object.assign({},state,{
                winPrize:action.winPrize
            });
        case type.INTEGRAL_TURNTABLE_SET_SELECT_POINT:
            return Object.assign({},state,{
                selectPoint:action.selectPoint
            });
        // case type.INTEGRAL_RECORD_CHANGE_TRANS_TYPE:
        //     return Object.assign({},state,{
        //         transType:action.data
        //     });
        // case type.MEMBER_CENTER_INTEGRAL_GET_INTEGRAL_PRODUCT:
        //     return Object.assign({},state,{
        //         pageIntegralProduct:action.data
        //     });
        // case type.MEMBER_CENTER_INTEGRAL_GET_MY_INTEGRAL:
        //     return Object.assign({},state,{
        //         myIntegral:action.data
        //     });
        default:
            return state;
    }
}
