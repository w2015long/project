// 引入定义常量
import {FULL_REDUCTION_PRODUCT} from "../constants/ActionTypes";

// 定义初始化数据，对应Reducer.js内定义的key，数据最终给fullReductionProductState组件使用
const fullReductionProductState = {
    // 活动商品
    fullReductionProduct:[],
    // 活动规则
    fullRules:[]
};

/**
 *  reducer 方法
 * @param state
 * @param action
 * @returns {*}
 */
export default  function (state = fullReductionProductState,action ) {
    switch (action.type) {
        case FULL_REDUCTION_PRODUCT:
            // 当动作类型为 FULL_REDUCTION_PRODUCT 的时候，改变productDemoState里面的productPage
            // 方法合并--合成一个新的对象
            return Object.assign({},state,action.data);
        default:
            return state;
    }
}