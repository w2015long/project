import * as types from './actionTypes.js'
import axios from 'axios'

let getAddAction = (payload)=>{
	return {
		type:types.ADD_ITEM,
		payload		
	}
}

let getChangeAction = (payload)=>{
	return {
		type:types.CHANGE_ITEM,
		payload		
	}
}

let getDelAction = (payload)=>{
	return {
		type:types.DEL_ITEM,
		payload		
	}
}

let getInitAction = payload=>{
	return {
		type:types.INIT_ITEM,
		payload		
	}
}

let loadInitDataAction = ()=>{
	return dispatch=>{
		axios
		.get('http://127.0.0.1:3000/')
		.then(response=>{
			const action = getInitAction(response.data)
			dispatch(action)

		})
		.catch(err=>{
			console.log(err)
		})
	}
}

export {getAddAction,getChangeAction,getDelAction,loadInitDataAction}