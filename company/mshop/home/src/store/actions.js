
import {getProducts} from '../api'
import {GET_PRODUCTS}from './types.js'
export default{
	async getProducts({commit}){
		const products = await getProducts();
		commit(GET_PRODUCTS,{homeProducts:products})
	}
}