
import {
	reqAddress,
	reqFoodCategorys,
	reqShops,
} from '../api';

import {
	GET_ADDRESS,
	GET_FOOD_CATEGORY,
	GET_SHOPS
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
}