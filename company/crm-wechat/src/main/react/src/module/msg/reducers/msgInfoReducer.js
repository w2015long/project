/**
 * @author zhongzheng
 * @date 2018/8/15
 * 咨询列表操作方法
 */

import {
    MSG_INFO_LIST,
    MSG_INFO_CATEGORY,
    MSG_INFO_CATEGORY_TITLE_SHOW_STATE,
    CATEGORY_STATE,
} from "../constants/ActionTypes";


// 定义初始化数据，这里面的数据最终是给组件去使用的
const msgInfoSate = {

    //咨询分页
    infoPage:{
        page:0,
        size:2,
        infoCategoryId:-1,//咨询分类Id
        infoS:[]
    },

    infoCategory:[],//咨询分类
    isShowTitle:false, //是否显示头部下拉框
    categoryId:-1,  //咨询分类id

};

/**
 * reducer方法
 * @param state 上次的state
 * @param action
 * @returns {*}
 */
export default function (state = msgInfoSate, action) {
    switch (action.type) {
        case MSG_INFO_LIST:
            //当动作类型为 MSG_INFO_LIST 的时候，改变msgInfoSate里面的InfoPage
            return Object.assign({}, state, {
                infoPage: action.data
            });
        case MSG_INFO_CATEGORY:
            return Object.assign({}, state, {
                infoCategory: action.data,
                categoryId: action.data.length>0?(state.categoryId===-1?action.data[0].infoCategoryId:null):null,
            });
        case MSG_INFO_CATEGORY_TITLE_SHOW_STATE:
            return Object.assign({},state,{
                isShowTitle:action.data
            });
        case CATEGORY_STATE:
            return Object.assign({},state,{
                categoryId:action.data
            });
        default:
            return state;
    }
}

