/**
 * Created by olx on 2018/9/27.
 */
import * as types from "../constants/ActionTypes";


export function getBargainActivityInfo(data, callBack = () => {}) {
    const {mutualBargainShareRecordId} = data;
    return (dispatch) => {
        const url = '/wap/mutualBargainActivity/getMutualBargainActivityDetail?mutualBargainShareRecordId='+mutualBargainShareRecordId;
        window.textFetch(
            url,
            {
                method: 'Get',

            },
            json => {
                if(json&&json.mutualBargainActivityId){
                    dispatch({
                        type: types.BARGAIN_ACTIVITY_INFO,
                        bargainActivityInfo: json
                    });
                }else {
                    window.warningTip("系统错误,请确认活动信息是否有误");
                }
                callBack();
            },
            error => {
                return true;
            }
        );
    }
}
export function updateMutualBargainBoostState(data,callBack=()=>{}) {
    let {mutualBargainShareRecordId,isAllow} = data;
    if(isAllow){
        return;
    }
    isAllow = true;
    return (dispatch) => {
        const url = '/wap/mutualBargainBoostRecord/updateMutualBargainBoostState?mutualBargainShareRecordId='+mutualBargainShareRecordId;
        window.textFetch(
            url,
            {
                method: 'Get',

            },
            json => {
                dispatch({
                    type: types.BARGAIN_SET_FIRST_BARGAIN_AMOUNT,
                    data: json
                });
                dispatch({
                    type: types.BARGAIN_SET_SHOW_PRIZE_RECEIVE_LAYER,
                    data: true
                });
                callBack();
                isAllow = undefined;
            }
        );
    }
}
/**
 * 输入框变化监听
 */
export function commonSetBargainState(type, data) {
    return (dispatch) => {
        dispatch({
            type: type,
            data: data
        });
    }
}

