import React,{Component,Fragment} from 'react';
import Login from './pages/login'

import './App.css';


class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			isLogin:false
		}
	}


	render() {

		return <Login />
	}
}


export default App