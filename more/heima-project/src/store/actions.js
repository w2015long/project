
import { ADD_CARS,UPLOAD_CAR,DEL_CAR ,UPDATE_SELECTED} from './actionTypes.js'

export default {
	addCar ({commit},goodsInfo) {
		commit(ADD_CARS,goodsInfo);
	},
	uploadCar ({commit},goodsInfo) {
		commit(UPLOAD_CAR,goodsInfo);
	},
	delCar ({commit},id) {
		commit(DEL_CAR,id);
	},
	updateSelected ({commit},info) {
		commit(UPDATE_SELECTED,info)
	}
}