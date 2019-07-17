/**
 * 个人中心-我的积分
 * Created by caixuan on 2018/3/28.
 */
import * as type from '../constants/ActionTypes';

/**
 * 积分记录列表
 * @param pageIntegralRecord 分页对象
 * @param transType 类型:全部/充值/扣费
 * @returns {function(*)}
 */
export function pageIntegralRecord(pageIntegralRecord, transType) {
    return (dispatch) => {
        const url = '/wap/integral/pageAccountTransLog?page=' + pageIntegralRecord.page + "&size=" + pageIntegralRecord.size + "&transType=" + transType;
        window.jsonFetch(
            url, {method:"POST"}, json => {
                dispatch({
                    type: type.INTEGRAL_RECORD_GET_PAGE,
                    data: {
                        page: pageIntegralRecord.page,
                        size: pageIntegralRecord.size,
                        content: pageIntegralRecord.content.concat(json.data),
                        recordsFiltered: json.recordsFiltered
                    }
                })
            }
        );
    }
}

/**
 * 切换积分兑换页面右上角下拉框显示隐藏
 * @returns {Function}
 */
export function changeRecordTypeIsShow() {
    return function (dispatch) {
        dispatch({
            type:type.INTEGRAL_RECORD_RECORD_TYPE_IS_SHOW,
        })
    }
}

/**
 * 改变积分操作类型
 * @param transType 积分类型
 * @returns {Function}
 */
export function changeTransType(transType) {
    return function (dispatch) {
        dispatch({
            type:type.INTEGRAL_RECORD_CHANGE_TRANS_TYPE,
            data:transType
        })
    }
}

/**
 * 积分商品
 * @param pageIntegralProduct 分页对象
 * @returns {function(*)}
 */
export function pageIntegralProduct(pageIntegralProduct) {
    return (dispatch) => {
        const url = '/wap/integral/pageIntegralProduct?page=' + pageIntegralProduct.page + "&size=" + pageIntegralProduct.size;
        window.jsonFetch(
            url, {}, json => {
                dispatch({
                    type: type.MEMBER_CENTER_INTEGRAL_GET_INTEGRAL_PRODUCT,
                    data: {
                        page: pageIntegralProduct.page,
                        size: pageIntegralProduct.size,
                        content: pageIntegralProduct.content.concat(json.data),
                        recordsFiltered: json.recordsFiltered
                    }
                })
            }
        );
    }
}
/**
 * 会员积分
 * @returns {function(*)}
 */
export function getMemberIntegral() {
    return (dispatch) => {
        const url = '/wap/integral/getMemberIntegral';
        window.textFetch(
            url, {}, json => {
                dispatch({
                    type: type.MEMBER_CENTER_INTEGRAL_GET_MY_INTEGRAL,
                    data: json
                })
            }
        );
    }
}
