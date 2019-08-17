
import {
	GET_ADDRESS,
	GET_FOOD_CATEGORY,
	GET_SHOPS
}from './mutation-types.js'
export default{
	[GET_ADDRESS](state,{address}){
		state.address = address;
	},
	[GET_FOOD_CATEGORY](state,{categorys}){
		state.categorys = categorys;
	},
	[GET_SHOPS](state,{shops}){
		state.shops = shops;
	},
}