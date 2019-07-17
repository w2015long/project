/**
 * 个人中心-大转盘
 * Created by olx on 2018/4/2.
 */
import * as type from '../constants/ActionTypes';

/**
 * 获取初始信息
 */
export function findTurntableInitData(){
    return (dispatch) => {

        const url = '/wap/turntable/findWeChatCurrentBigTurntableActivity';
        window.jsonFetch(
            url,
            {},
            json => {
                dispatch({
                    type:  type.INTEGRAL_TURNTABLE_GET_INIT_WINPRIZE,
                    initData: {
                        balance:json.balance,//用户积分
                        deductIntegral:json.deductIntegral,// 扣减积分
                        userWinningRecord:json.userWinningRecordProtocols,//用户奖品
                        winningRecords:json.winningRecordProtocols,//中奖记录
                        bigTurntablePrizeProtocols:json.bigTurntablePrizeProtocols,//活动奖品
                    }
                })
            },
            error =>{
                if(typeof error==='object' && error.errCode ==="ACTIVITY_IS_ERROR"){
                    window.warningTip("暂无活动,请浏览其他活动");
                    return false;
                }else
                {
                    return true;
                }
            }
        );
    }
}
/**
 * 抽奖
 */
export function prizeDraw(callBackFunc){
    return (dispatch) => {

        const url = '/wap/turntable/joinCurrentBigTurntableActivity';
        window.jsonFetch(
            url,
            {},
            json => {
                const winPrize = {
                    bigTurntablePrizeId: json.bigTurntablePrizeId,//奖品 ID
                    prizeName: json.prizeName,//奖品名称
                    prizePicUrl: json.prizePicUrl,// 奖品图片
                    prizeType: json.prizeType,//奖品类型
                    receiveNtegralNum: json.receiveNtegralNum,//获得积分
                    couponAmount: json.couponAmount,//购物券面额
                };
                dispatch({
                    type: type.INTEGRAL_TURNTABLE_GET_RESULT,
                    winPrize: winPrize
                });
                callBackFunc(winPrize.bigTurntablePrizeId);
                findTurntableInitData();
            },
            error =>{
                if(typeof error==='object' && error.errCode ==="SYS_USER_NOT_FOUND"){
                    window.warningTip("账户异常,请稍后再试");
                    return false;
                }
                if(typeof error==='object' && error.errCode ==="INTEGRAL_BALANCE_NOT_ENOUGH"){
                    window.warningTip("积分不足,欢迎签到获取积分");
                    return false;
                }else{    window.warningTip("活动异常,请稍后再试");
                    return false;
                }
            }
        );
    }
}
/**
 * 显示中奖结果
 * @returns {Function}
 */
export function changeIsShowUserWinningRecordLayer() {
    return function (dispatch) {
        dispatch({
            type:type.INTEGRAL_TURNTABLE_SET_IS_SHOW_USER_WINNING_RECORD_LAYER,
        })
    }
}
export function changeSelectPoint(selectPoint) {
    return function (dispatch) {
        dispatch({
            type:type.INTEGRAL_TURNTABLE_SET_SELECT_POINT,
            selectPoint:selectPoint
        })
    }
}
export function changeWinPrize(winPrize) {
    return function (dispatch) {
        dispatch({
            type:type.INTEGRAL_TURNTABLE_GET_RESULT,
            winPrize:winPrize
        })
    }
}
