/**
 * @author chencheng
 * @date 2018/3/19
 */

//引入action类型
import {EXAMPLE_TEST_SET_NAME, EXAMPLE_TEST_PAGE_PRODUCT} from '../constants/ActionTypes';

/**
 * 初始化的exampleState
 */
const exampleState = {
    name: "chencheng",
    productPage: {
        currentPage: 1,
        pageSize: 10,
        products: []
    }
};

/**
 * 这种方法叫做reducer，唯一的作用是用来更新state的，接收旧的 state 和 action，返回新的 state。
 *
 * 保持 reducer 纯净非常重要。永远不要在 reducer 里做这些操作：
 *        修改传入参数（即不能在这里修改state！！！）；
 *        执行有副作用的操作，如 API 请求和路由跳转；
 *        调用非纯函数，如 Date.now() 或 Math.random()。
 *
 * @param state 旧的state
 * @param action action对象，描述发生了什么事情
 * @returns {*} 新的state
 */
export default function (state = exampleState, action) {
    switch (action.type) {
        case EXAMPLE_TEST_SET_NAME:
            return Object.assign({}, state, {
                name: action.name
            });
        case EXAMPLE_TEST_PAGE_PRODUCT:
            return Object.assign({}, state, {
                productPage: action.productPage
            });
        //一定要有一个default，当action匹配不上时返回旧的state，否则整个 exampleState 的数据就丢失了。
        default:
            return state;
    }
}
