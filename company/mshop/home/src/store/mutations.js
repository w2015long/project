
import {GET_PRODUCTS} from './types.js'
export default{
	[GET_PRODUCTS](state,payload){
		console.log(payload.homeProducts)
		state.homeProducts = payload.homeProducts;
	}
}