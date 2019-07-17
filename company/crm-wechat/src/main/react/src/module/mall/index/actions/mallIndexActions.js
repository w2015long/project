/**
 * @author zhongzheng
 * @date 2018/8/15
 * 咨询列表操作方法
 */

import {
    MODULE_TAB_LIST,//商品tab列表
    TAB_STATE,//选中的商品
    PAGE_MODULE_OBJECT_LIST,//商品page
    INFO_LIST,//商城公告
    CATEGORY,//轮播
} from "../constants/ActionTypes";


/**
 * 请求 商品 tab
 * 需要添加dispatch函数，才能与仓库关联起来
 */

export function getModuleTabList(moduleInnerCode,size,callBack) {
    return(dispatch) => {
        let url = "/wap/mall/index/getModuleTabList?moduleInnerCode="+moduleInnerCode;

        window.jsonFetch(
            url,
            {},
            (json) => {
                if(json.length!==0) {
                    dispatch({
                        type: MODULE_TAB_LIST,
                        data: json
                    });
                    dispatch(
                        pageProductCategory(json[0].pageModuleTabId, 0, size)
                    );
                    if (typeof callBack === 'function') {
                        callBack();
                    }
                }
            }
        )
    }
}
/**
 * 改变tab
 * @returns {Function}
 */
export function changeTabState(data) {
    return function (dispatch) {
        dispatch({
            type:TAB_STATE,
            data:data
        })
    }
}


/**
 * 请求商品列表
 * 需要添加dispatch函数，才能与仓库关联起来
 * @param pageModuleTabId 咨询分类id
 * @param lastPageModuleTabId 上一次咨询分类id
 * @param page
 * @param size
 * @param oldInfo
 *
 */
export function pageProductCategory(pageModuleTabId,lastPageModuleTabId,page, size, oldInfo=[]) {
    console.log('lastPageModuleTabId = ' + lastPageModuleTabId );
    console.log('pageModuleTabId = ' + pageModuleTabId );
    console.log('page = ' + page );
    console.log('size = ' + size );

    return(dispatch) => {
        let url = "/wap/mall/index/pagePageModuleObject";
        let data = {
            page:page,
            size:size,
            pageModuleTabId:pageModuleTabId
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
                    pageModuleTabId:pageModuleTabId,
                    products: pageModuleTabId === lastPageModuleTabId ? oldInfo.concat(json.data) : json.data,
                    recordsFiltered:json.recordsFiltered
                };

                dispatch({
                    type:PAGE_MODULE_OBJECT_LIST,
                    data:data
                })
            }
        )
    }
}
/**
 * 请求 商城公告
 * 需要添加dispatch函数，才能与仓库关联起来
 */

export function getInfo(categoryCode,callBack) {
    return(dispatch) => {
        let url = "/wap/mall/index/findByInfoList?categoryCode="+categoryCode;

        window.jsonFetch(
            url,
            {},
            (json) => {
                dispatch({
                    type:INFO_LIST,
                    data:json
                });
                if(typeof callBack === 'function'){
                    callBack();
                }
            }
        )
    }
}

/**
 * 请求 首页图片轮播
 * 需要添加dispatch函数，才能与仓库关联起来
 */

export function getCategory(moduleInnerCode,callBack) {
    return(dispatch) => {
        let url = "/wap/mall/index/findAdvertisingPageModuleObject?moduleInnerCode="+moduleInnerCode;

        window.jsonFetch(
            url,
            {},
            (json) => {
                dispatch({
                    type:CATEGORY,
                    data:json
                });
                if(typeof callBack === 'function'){
                    callBack();
                }
            }
        )
    }
}


