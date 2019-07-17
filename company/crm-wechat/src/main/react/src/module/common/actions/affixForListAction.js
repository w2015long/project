/**
 * @author chencheng
 * @date 2018/3/31
 */
import {COMMON_AFFIX_FOR_LIST_CHANGE_INDEX} from '../constants/ActionTypes'

/**
 * 改变固钉下标
 * @param affixIndex 当前固钉下标
 */
export function changeAffixIndex(affixIndex) {
    return dispatch =>{
        const action = {
            type:COMMON_AFFIX_FOR_LIST_CHANGE_INDEX,
            affixIndex:affixIndex
        };
        dispatch(action);
    }
}