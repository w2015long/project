/**
 * @author chencheng
 * @date 2018/3/27
 *  门店
 */
import {SHOP_GET_SHOP_DETAIL} from '../constants/ActionTypes';

/**
 * 获取门店详情
 * @param shopId 门店ID
 */
export function getShopDetail(shopId) {
    return dispatch =>{
        const url = '/wap/shop/findShopDetail?shopId='+shopId;
        window.jsonFetch(
            url,
            {},
            shop => {
               const action = {
                   type:SHOP_GET_SHOP_DETAIL,
                   shopDetail:shop
               };
               dispatch(action);
            }
        )
    }
}


