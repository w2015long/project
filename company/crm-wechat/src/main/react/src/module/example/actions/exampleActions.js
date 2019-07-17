/**
 * @author chencheng
 * @date 2018/3/19
 *  Action 本质上是 JavaScript 普通对象，action 内必须使用一个字符串类型的 type 字段来表示将要执行的动作。
 *  Action 只是用来描述发生了什么
 *
 *  示例action
 */

//引入action的类型
import {EXAMPLE_TEST_SET_NAME, EXAMPLE_TEST_PAGE_PRODUCT} from '../constants/ActionTypes';

/**
 * 所有的方法都需要写注释，表明用途
 * 设置名称
 * @param name 新的名称
 */
export function setName(name) {
    return (dispatch) => {
        //在这里搞点事情，然后封装一个action
        const action = {
            type: EXAMPLE_TEST_SET_NAME,
            name: name
        };
        dispatch(action);
    }
}

/**
 * 分页加载商品列表
 */

export function pageProduct(page, size) {
    return (dispatch) => {
        //发起一个fetch请求
        const url = '/wap/product/pageProduct?page=' + page + "&size=" + size;
        window.jsonFetch(
            url,
            {},
            json => {
                const action = {
                    type: EXAMPLE_TEST_PAGE_PRODUCT,
                    productPage: {
                        currentPage: page,
                        pageSize: size,
                        products: json.data
                    }
                };
                //更新state
                dispatch(action)
            },
            error =>{
                //可以在发生错误时搞点事情
                return true;//返回false可以阻止默认的错误弹窗，除非你进行了其他的友好提示或者备用方案。否则绝不允许隐藏错误！！！
            }
        );
    }
}


