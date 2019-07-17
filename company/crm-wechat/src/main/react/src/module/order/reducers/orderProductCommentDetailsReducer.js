// 引入定义常量
import {
    ORDER_PRODUCT_COMMENT_DETAILS
} from "../constants/ActionTypes";
/**
 * @author lcl
 * @data 2018/8/15
 */

// 定义初始化数据，对应Redycer.js内定义的key，数据最终给productCommentDetailsSate组件使用
const productCommentDetailsSate = {
    // 商品分页数据
    productCommentDetails:{
        commentDetails:[]
    }
};
/**
 *  reducer 方法
 * @param state
 * @param action
 * @returns {*}
 */
export default  function (state = productCommentDetailsSate,action ) {
    switch (action.type) {
        case ORDER_PRODUCT_COMMENT_DETAILS:
        // 方法合并--合成一个新的对象
        return Object.assign({},state,{
            productCommentDetails:action.data
        });
        default:
            return state;
    }
}