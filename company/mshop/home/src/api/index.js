import axios from 'axios';
const SERVER = 'http://127.0.0.1:3000';
export const getProducts = ()=>{
	return axios({
		url:SERVER+'/products/homeProducts'
	})
	.then(result=>{
		console.log(result)
		if(result.data.code==0){
			return result.data.data
		}else{
			throw 'no data'
		}
	})
	.catch(err=>{
		console.log(err)
	})
}