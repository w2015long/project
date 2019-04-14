

import React,{Component,Fragment} from 'react';
import { connect } from 'react-redux'
import './index.css';
import {  Row, Col ,Button,Input,List} from 'antd'

import {actionTypes} from './store/'


//容器组件
class Todolist extends Component{

	componentDidMount(){
		this.props.handleInit()
	}
		
	render() {
		const {val,list,handleChange,handleAdd,handleDle} = this.props;
		return (
			<div className = "Todolist">
			    <Row>
			      <Col span={18}>
			      	<Input 
			      		placeholder="Basic usage"
			      		onChange={handleChange}
			      		value={val}
			      	/>
			      </Col>
			      <Col span={6} push={1}>
			      	<Button 
			      		type="primary"
			      		onClick={handleAdd}
			      	>新增</Button>
			      </Col>
			      <Col span={24}>
				    <List
				      style={{ marginTop: 16 }}
				      bordered
				      dataSource={list}
				      renderItem={(item,index) => (
				      	<List.Item
				      		onClick={()=>{handleDle(index)}}
				      	>
				      		 {item}
				      	</List.Item>
				      )}
				    />
			      </Col>
			    </Row>
			</div>


		)
	}
}

const mapStateToProps = state => {
	console.log('map',state.get('todolistReducer'))
	return {
		val:state.get('todolistReducer').get('val'),
		list:state.get('todolistReducer').get('list')
	}
}

const mapDispatchToProps = dispatch=>{
	return{

		handleChange:(ev)=>{
			const value = ev.target.value;
			const action = actionTypes.getChangeAction(value)
			dispatch(action)			
		},
		handleAdd:()=>{
			const action = actionTypes.getAddAction()
			dispatch(action)			
		},
		handleDle:(index)=>{
			const action = actionTypes.getDelAction(index)
			dispatch(action)			
		},
		handleInit:()=>{
			const action = actionTypes.loadInitDataAction()
			dispatch(action)				
		}

	}
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Todolist)