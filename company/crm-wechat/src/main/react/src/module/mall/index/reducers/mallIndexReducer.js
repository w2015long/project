/**
 * @author zhongzheng
 * @date 2018/8/17
 * mall 首页 操作 方法
 */

import {CATEGORY, INFO_LIST, MODULE_TAB_LIST, PAGE_MODULE_OBJECT_LIST, TAB_STATE,} from "../constants/ActionTypes";

// 定义初始化数据，这里面的数据最终是给组件去使用的
const mallIndexState = {
    moduleTabList:[],//商品tab
    moduleTabId:-1,  //商品tab id

    //商品分页
    productCategoryPage:{
        page:0,
        size:2,
        pageModuleTabId:-1,//tabId
        products:[],//公告
        category:[]//轮播
    },
    infoS:[]
};


/**
 * reducer方法
 * @param state 上次的state
 * @param action
 * @returns {*}
 */
export default function (state = mallIndexState, action) {
    switch (action.type) {
        case MODULE_TAB_LIST:
            //当动作类型为 MODULE_TAB_LIST 的时候，改变mallIndexSate里面的moduleTabList
            return Object.assign({}, state, {
                moduleTabList: action.data,
                moduleTabId: action.data.length > 0 ? (state.moduleTabId === -1 ? action.data[0].pageModuleTabId : state.moduleTabId) : null,
            });
        case TAB_STATE:
            return Object.assign({}, state, {
                moduleTabId: action.data,
            });
        case PAGE_MODULE_OBJECT_LIST:
            return Object.assign({}, state, {
                productCategoryPage: action.data,
            });
        case INFO_LIST:
            return Object.assign({}, state, {
                infoS: action.data,
            });
        case CATEGORY:
            return Object.assign({}, state, {
                category: action.data,
            });
        default:
            return state;
    }
}

