import {DOUBLE_ELEVEN_COUNT_DOWN, INIT_DOUBLE_ELEVEN_INFO} from "../../activity/constants/ActionTypes";

/**
 * 初始化
 */
export function getDoubleElevenInitData(callBackFun = () => {}) {
    return (dispatch) => {
        const url = '/wap/doubleEleven/getDoubleElevenInitData';
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: INIT_DOUBLE_ELEVEN_INFO,
                    data: json
                };

                dispatch(action);

                if (typeof callBackFun === 'function'){
                    callBackFun();
                }
            }
        );
    }
}

/**
 * 倒计时
 * @param timer
 * @returns {Function}
 */
export function countDown(timer) {
    return (dispatch) => {
        if(timer.seconds > 0){
            timer.seconds = timer.seconds - 1;
        }

        if(timer.seconds===0 && timer.minutes > 0){
            timer.seconds = 59;
            timer.minutes = timer.minutes - 1;
        }

        if(timer.seconds===0 && timer.minutes===0 && timer.hours > 0){
            timer.seconds = 59;
            timer.minutes = 59;
            timer.hours = timer.hours - 1;
        }

        const action = {
            type: DOUBLE_ELEVEN_COUNT_DOWN,
            timer: timer
        };

        dispatch(action);
    }
}