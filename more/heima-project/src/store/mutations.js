import { ADD_CARS } from './actionTypes.js';

export default {
	[ADD_CARS] (state,goodsInfo) {
		var flag = false;//默认购物车store中没有
		state.car.some(item=>{
			if (item.id == goodsInfo.id) {
				item.count += parseInt(goodsInfo.count);
				flag = true;
				return true;
			}
		});
		if (!flag) {
			state.car.push(goodsInfo);
		}
	}
}