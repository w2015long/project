/**
 * @author chencheng
 * @date 2018/8/14
 * 商品列表操作方法
 */

import {
    PRODUCT_DEMO_PRODUCT_LIST
} from "../constants/ActionTypes";


// 版本1：这样子写，仅仅只是一个普通的函数，不会跟我们的数据仓库关联
/*export function pageProduct(page, size, products) {
    let url = "/wap/product/pageWapProduct";
    let data = {
        page:page,
        size:size
    };
    window.jsonFetch(
        url,
        {
            method:'post',
            body:JSON.stringify(data)
        },
        (json) => {
            products = json.data;
        }
    )
}*/


/**
 * 请求商品列表
 * 版本2：需要添加dispatch函数，才能与仓库关联起来
 * @param page
 * @param size
 * @param oldProducts
 */
export function pageProduct(page, size, oldProducts=[]) {
    return(dispatch) => {
        let url = "/wap/product/pageWapProduct";
        let data = {
            page:page,
            size:size
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
                    products:oldProducts.concat(json.data),
                    recordsFiltered:json.recordsFiltered
                };

                dispatch({
                    type:PRODUCT_DEMO_PRODUCT_LIST,
                    data:data
                })
            }
        )
    }
}