
import { ADD_CARS } from './actionTypes.js'

export default {
	addCar ({commit},goodsInfo) {
		commit(ADD_CARS,goodsInfo);
	}
}