
import {
	reqAddress,
	reqFoodCategorys,
	reqShops,
	reqUserInfo
} from '../api';

import {
	GET_ADDRESS,
	GET_FOOD_CATEGORY,
	GET_SHOPS,
	GET_USER_INFO,
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
	}
}