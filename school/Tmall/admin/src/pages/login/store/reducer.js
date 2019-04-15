
import { fromJS } from 'immutable'

import {ADD_ITEM,CHANGE_ITEM,DEL_ITEM,INIT_ITEM} from './actionTypes.js'

//用fromJS生成一个immutable对象
const defaultState = fromJS({
		list:[],
		val:''
})

//1. reducer是一个纯函数(固定的输入就有固定的输出)
//2. reducer主要处理业务逻辑 接收(previosState,action),返回newState


export default (state=defaultState,action)=>{
	switch (action.type) {
		case CHANGE_ITEM:
	  		console.log('list>>>>',state.get('list'))
	  		return state.set('val',action.payload)

		case ADD_ITEM:
	  		const list = state.get('list')

	  		list.push(state.get('val'))
	  		return state.merge({
	  			list,
	  			val:''
	  		});
	  		
		case DEL_ITEM:

			const newlist = [...state.get('list')]
			newlist.splice(action.payload,1)
			return state.set('list',newlist)
			
		case INIT_ITEM:

	  		return state.set('list',action.payload)	 	  			  		
		default:
	  		return state
	}
}