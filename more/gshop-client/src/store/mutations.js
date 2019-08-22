
import {
	GET_ADDRESS,
	GET_FOOD_CATEGORY,
	GET_SHOPS,
	GET_USER_INFO,
	RESET_USER_INFO
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
	[GET_USER_INFO](state,{userInfo}){
		state.userInfo = userInfo;
	},
	[RESET_USER_INFO](state){
		state.userInfo = {};
	}
}