import React,{Component,Fragment} from 'react';
import {
	// HashRouter as Router, 
	BrowserRouter as Router,
	Route,
	Link,
	Switch,
	Redirect

} from "react-router-dom"


import './App.css';


class Index extends Component{
	render(){
		return <h1>this is Index page </h1>
	}
}

class Login extends Component{
	render(){
		return <h1>please login !</h1>
	}
}

// class About extends Component{
// 	render(){
// 		return <h2>this is About page </h2>
// 	}
// }
class Users extends Component{
	render(){
		return (

			<Switch>
			  <Route exact path="/users" render={() => <h2>This is users page</h2>}/>
			  <Route path="/users/about"  render={() => <h2>This is users about page</h2>}/>
			  <Route path="/users/:id" render={(route) => <h2>This is users:{route.match.params.id} page</h2>}/>
			</Switch>
		)
	}
}

class App extends Component{
	constructor(props){
		super(props);
		this.state = {
			isLogin:false
		}
	}


	render() {
		const ProtectRoute = ({component:Users,...rest})=>(
			<Route
				{...rest}
				render={(props)=>(
					this.state.isLogin
					? <Users {...props} />
					// : <Login />
					: <Redirect to="/login" />
				)}
			 />
		)
		return (
			<Router>
				<div className = "app">
			       <nav>
			          <ul>
			            <li>
			              <Link to="/">Home</Link>
			            </li>
			            <li>
			              <Link to="/about/">About</Link>
			            </li>
			            <li>
			              <Link to="/users/">Users</Link>
			            </li>
			            <li>
			              <Link to="/users/about">Users/about</Link>
			            </li>
			            <li>
			              <Link to="/users/123">Users/123</Link>
			            </li>			            			            
			          </ul>
			        </nav>



			        <Route path="/" exact component={Index} />
			        <Route path="/about/" render={() => <h3>Please select a topic</h3>} />
			        <Route path="/login" component={Login} />
			        <ProtectRoute path="/users/" component={Users} />

				</div>
			</Router>


		)
	}
}


export default App