/**
  @author lcl  我的评价-列表
  @data 2018/8/15
 */

// 引入定义常量
import {ORDER_PRODUCT_COMMENT_PAGE} from "../constants/ActionTypes";


/**
 * 请求我的评价列表
 * 需要添加dispatch函数，才能与仓库关联起来
 * 相当于原来的ajax 发送请求，这里用 fetch  -> 2次封装
 * @param page
 * @param size
 * @param oldComment
 */
export function  pageComment(page,size,oldComment=[]) {
    return(dispatch)=>{
        let url = "/wap/orderProductComment/pageOrderProductComment";
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
            (json) =>{
                let data = {
                    page:page,
                    size:size,
                    oderComments:oldComment.concat(json.data),
                    recordsFiltered:json.recordsFiltered
                };

                dispatch({
                    type:ORDER_PRODUCT_COMMENT_PAGE,
                    data:data
                })
            }
        )
    }
}