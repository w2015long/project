// 引入定义常量
import {
    ORDER_PRODUCT_COMMENT_PAGE
} from "../constants/ActionTypes";
/**
 * @author lcl
 * @data 2018/8/15
 */

// 定义初始化数据，对应Reducer.js内定义的key，数据最终给orderCommentListSate组件使用
const orderProductCommentState = {
    // 商品分页数据
    oderCommentPage:{
        page:0,
        size:5,
        oderComments:[]
    }
};
/**
 *  reducer 方法
 * @param state
 * @param action
 * @returns {*}
 */
export default  function (state = orderProductCommentState,action ) {
    switch (action.type) {
        case ORDER_PRODUCT_COMMENT_PAGE:
        //当动作类型为 ORDER_PRODUCT_COMMENT_PAGE 的时候，改变productDemoState里面的productPage
        // 方法合并--合成一个新的对象
        return Object.assign({},state,{
            oderCommentPage:action.data
        });
        default:
            return state;
    }
}