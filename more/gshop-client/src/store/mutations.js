
import {
	GET_ADDRESS,
	GET_FOOD_CATEGORY,
	GET_SHOPS,
	GET_USER_INFO,
	RESET_USER_INFO,
	RECEIVE_INFO,
	RECEIVE_RATINGS,
	RECEIVE_GOODS,
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
	},
	//商品信息
	[RECEIVE_INFO](state, {info}) {
		state.info = info
	},

	[RECEIVE_RATINGS](state, {ratings}) {
		state.ratings = ratings
	},

	[RECEIVE_GOODS](state, {goods}) {
		state.goods = goods
	},
}