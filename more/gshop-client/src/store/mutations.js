
import Vue from 'vue'

import {
	GET_ADDRESS,
	GET_FOOD_CATEGORY,
	GET_SHOPS,
	GET_USER_INFO,
	RESET_USER_INFO,
	RECEIVE_INFO,
	RECEIVE_RATINGS,
	RECEIVE_GOODS,
	INCREMENT_FOOD_COUNT,
	DECREMENT_FOOD_COUNT,
	CLEAR_CART,
	GET_SEARCH_LIST
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
	//搜索音乐
	[GET_SEARCH_LIST] (state,{searchResult}) {
		state.searchResult = searchResult
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

	[INCREMENT_FOOD_COUNT] (state,{food}) {
		if (!food.count) {//第一次点击
			//向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新
			Vue.set(food,'count',1);
			//添加到购物车
			state.shopCart.push(food)
		} else {
			food.count++
		}
	},

	[DECREMENT_FOOD_COUNT] (state,{food}) {
		if (food.count) {
			food.count--
			if (!food.count) {
				state.shopCart.splice(state.shopCart.indexOf(food),1)
			}
		}
	},

	[CLEAR_CART] (state) {
		state.shopCart.forEach((item) => {
			item.count = 0;
			delete item.count
		})
		state.shopCart = [];
	}
}