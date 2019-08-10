import { ADD_CARS,UPLOAD_CAR,DEL_CAR,UPDATE_SELECTED } from './actionTypes.js';
import _g from "../util";
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
		_g.setLS('car',state.car);
	},
	[UPLOAD_CAR] (state,goodsInfo) {
		state.car.some(elem=>{
			if (elem.id == goodsInfo.id) {
				elem.count = parseInt(goodsInfo.count);
				return true;
			}
		});
		_g.setLS('car',state.car)
	},
	[DEL_CAR](state,id){
		state.car.some((item,index)=>{
			if(item.id == id){
				state.car.splice(index,1);
				return true;
			}
		});
		_g.setLS('car',state.car)
	},
	[UPDATE_SELECTED] (state,info) {
		state.car.some(item=>{
			if (item.id == info.id) {
				item.selected = info.selected;
				return true;
			}
		});
		_g.setLS('car',state.car);
	}

}