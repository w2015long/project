import { createStore ,applyMiddleware } from 'redux'
import redurcer from './reducers.js'
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'

const middleware = [thunk];

// console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV != 'production'){
	const logger = createLogger({
  		// ...options
	});

	middleware.push(logger)
}




let store = createStore(redurcer, applyMiddleware(...middleware))



export default store