
import {
	reqAddress,
	reqFoodCategorys,
	reqShops,
	reqUserInfo,
	reqLogout,
	reqShopRatings,
	reqShopGoods,
	reqShopInfo,
} from '../api';

import {
	GET_ADDRESS,
	GET_FOOD_CATEGORY,
	GET_SHOPS,
	GET_USER_INFO,
	RESET_USER_INFO,
	RECEIVE_GOODS,
	RECEIVE_RATINGS,
	RECEIVE_INFO,
	INCREMENT_FOOD_COUNT,
	DECREMENT_FOOD_COUNT,
}from './mutation-types.js'
export default{
	async getAddress({commit,state}){
		const geohash = state.latitude + ',' + state.longitude;

		const result = await reqAddress(geohash);
		if (result.code == 0) {
			const address = result.data;
			commit(GET_ADDRESS,{address})
		}

	},
	async getFoodCategory({commit}){
		const result = await reqFoodCategorys();
		if (result.code == 0) {
			const categorys = result.data;
			commit(GET_FOOD_CATEGORY,{categorys})
		}
	},
	async getShops({commit}){
		const result = await reqShops();
		if (result.code == 0) {
			const shops = result.data;
			commit(GET_SHOPS,{shops})
		}

	},
	recordUserInfo({commit},userInfo){
		commit(GET_USER_INFO,{userInfo})
	},
	async getUserInfo({commit}){
		const result = await reqUserInfo();
		if (result.code == 0) {
			const userInfo = result.data;
			commit(GET_USER_INFO,{userInfo})
		}
	},
	async goLogout({commit}){
		const result = await reqLogout();
		if (result.code == 0) {
			commit(RESET_USER_INFO)
		}
	},
	// 异步获取商家信息
	async getShopInfo({commit}) {
		const result = await reqShopInfo()
		if (result.code === 0) {
			const info = result.data
			commit(RECEIVE_INFO, {info})
		}
	},

	// 异步获取商家评价列表
	async getShopRatings({commit}) {
		const result = await reqShopRatings()
		if (result.code === 0) {
			const ratings = result.data
			commit(RECEIVE_RATINGS, {ratings})
			// 数据更新了, 通知一下组件
		}
	},

	// 异步获取商家商品列表
	async getShopGoods({commit},callback) {
		const result = await reqShopGoods()
		if (result.code === 0) {
			const goods = result.data
			commit(RECEIVE_GOODS, {goods})
			// 数据更新了, 通知一下组件
			callback && callback()
		}
	},
	// 同步更新food中的count值
	updateFoodCount ({commit}, {isAdd, food}) {
		if (isAdd) {
			commit(INCREMENT_FOOD_COUNT, {food})
		} else {
			commit(DECREMENT_FOOD_COUNT, {food})
		}
	},
}