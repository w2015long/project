import ajax from './ajax.js';
const BASE_URL = '/api';
//1、根据经纬度获取位置详情
export const reqAddress = (geohash) => ajax({url:`${BASE_URL}/position/${geohash}`});
//2、获取食品分类列表
export const reqFoodCategorys = () => ajax({url:BASE_URL+'/index_category'});
// 3、根据经纬度获取商铺列表
export const reqShops = (longitude, latitude) => ajax({url:BASE_URL+'/shops',data:{longitude,latitude}});
//7、发送短信验证码
export const reqSendCode = (phnoe) => ajax({url:`${BASE_URL}/sendcode?phone=${phnoe}`})
//6、用户名密码登陆
export const reqPwdLogin = ({name,pwd,captcha}) => ajax({url:`${BASE_URL}/login_pwd`,data:{name,pwd,captcha},method:'post'})
//8、手机号验证码登陆
export const reqSmsLogin = ({phone,code}) => ajax({url:BASE_URL+'login_sms',data:{phone,code},method: 'post'})
//9、根据会话获取用户信息
export const reqUserInfo = () => ajax({url:BASE_URL+'/userinfo'});
//10、用户登出
export const reqLogout = () => ajax({url:BASE_URL+'/logout'});


/**
 * 获取商家信息
 */
export const reqShopInfo = () => ajax({url:'/info'})

/**
 * 获取商家评价数组
 */
export const reqShopRatings = () => ajax({url:'/ratings'})

/**
 * 获取商家商品数组
 */
export const reqShopGoods = () => ajax({url:'/goods'});


