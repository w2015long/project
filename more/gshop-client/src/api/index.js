import ajax from './ajax.js';
const BASE_URL = '/api';
//1、根据经纬度获取位置详情
export const reqAddress = (geohash) => ajax({url:`${BASE_URL}/position/${geohash}`});
//2、获取食品分类列表
export const reqFoodCategorys = () => ajax({url:BASE_URL+'/index_category'});
// 3、根据经纬度获取商铺列表
export const reqShops = (longitude, latitude) => ajax({url:BASE_URL+'/shops',data:{longitude,latitude}});