/**
 @author lcl  满立减参与商品列表
 @data 2018/12/27
 */

// 引入定义常量
import {FULL_REDUCTION_PRODUCT} from "../constants/ActionTypes";

/**
 * 发送请求：查询参与活动的商品
 * 需要添加dispatch函数，才能与仓库关联起来
 * @param fullReductionActivityId
 */
export function commentList(fullReductionActivityId) {
    return(dispatch) =>{
      let url = "/wap/fullReduction/findFullReductionProduct?fullReductionActivityId="+fullReductionActivityId;
      window.jsonFetch(
          url,
          {
              method:'get',
          },
          (json) =>{
              let data = {
                  fullReductionProduct:json['fullProductComment'],
                  fullRules: json['fullRules']
              };
              dispatch({
                  type:FULL_REDUCTION_PRODUCT,
                  data:data
              })
          },
          error =>{
              if( error.errCode ==="ACTIVITY_PRODUCT_ALL" ){
                  window.warningTip("全场参与");
                  window.history.back('/index');
                  return false;
              }else if (error.errCode ==="ACTIVITY_PRODUCT_ERROR"){
                  window.warningTip("活动结束");
                  window.history.back('/index');
                  return false;
              }else
              {
                  return true;
              }
          }

      );
    }
}



