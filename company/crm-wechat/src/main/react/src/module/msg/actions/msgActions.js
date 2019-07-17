/**
 * @author zhongzheng
 * @date 2018/8/15
 * 咨询列表操作方法
 */

import {
    CATEGORY_STATE,
    MSG_INFO_CATEGORY,
    MSG_INFO_CATEGORY_TITLE_SHOW_STATE,
    MSG_INFO_LIST,
} from "../constants/ActionTypes";


/**
 * 请求咨询列表
 * 需要添加dispatch函数，才能与仓库关联起来
 * @param infoCategoryId 咨询分类id
 * @param page
 * @param size
 * @param oldInfo
 *
 */
export function pageInfo(infoCategoryId,page, size, oldInfo=[]) {
    return(dispatch) => {
        let url = "/wap/info/pageInfo";
        let data = {
            page:page,
            size:size,
            infoCategoryId:infoCategoryId
        };
        window.jsonFetch(
            url,
            {
                method:'post',
                body:JSON.stringify(data)
            },
            (json) => {
                let data = {
                    page:page,
                    size:size,
                    infoCategoryId:infoCategoryId,
                    infoS:oldInfo.concat(json.data),
                    recordsFiltered:json.recordsFiltered
                };

                dispatch({
                    type:MSG_INFO_LIST,
                    data:data
                })
            }
        )
    }
}

/**
 * 请求咨询分类
 * 需要添加dispatch函数，才能与仓库关联起来
 */
export function getInfoCategory(page, size) {
    return(dispatch) => {
        let url = "/wap/info/listInfoCategory";

        window.jsonFetch(
            url,
            {},
            (json) => {
                dispatch({
                    type:MSG_INFO_CATEGORY,
                    data:json
                });

                if (page === null || size == null) {
                    return;
                }

                dispatch(pageInfo(json[0].infoCategoryId,page, size));
            }
        )
    }
}


/**
 * 改变咨询分类
 * @returns {Function}
 */
export function changeOrderState(data) {
    return function (dispatch) {
        dispatch({
            type:CATEGORY_STATE,
            data:data
        })
    }
}


/**
 * 表页标题下拉框显示隐藏状态
 * @returns {Function}
 */
export function changeShowTitleState(data) {
    return function (dispatch) {
        dispatch({
            type:MSG_INFO_CATEGORY_TITLE_SHOW_STATE,
            data:data
        })
    }
}