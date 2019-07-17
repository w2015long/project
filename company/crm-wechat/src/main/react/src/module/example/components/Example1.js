/**
 * @author chencheng
 * @date 2018/3/19
 */
//基本组件
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
//redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
//引入jq模块
import $ from 'jquery'
//引入私有样式
import '../style/Example1.css'
//引入本页面需要用到方法
import {setName, pageProduct} from "../actions/exampleActions";
//引入子组件
import Example333333 from './Example3'
import Example3 , {Example4}from './Example3'

class Example1 extends Component {

    componentWillMount() {
        this.props.actions.pageProduct(1, 10);//获取商品列表
    }
    componentDidMount() {

    }
    componentDidUpdate (){

    }
    componentWillUnmount(){
    }

    setName(){
        //这里示范如何使用ref获取dom节点
        let nameInput = this.refs.nameInput;
        //这里示范如何使用jQuery
        console.log($(nameInput).val());
        this.props.actions.setName(nameInput.value);
    }

    render() {
        const {name,  productPage} = this.props.exampleState;
        return (
            <div >
                <a className='base-css-example example1'>这里是example1，我使用了公用样式base-css-example，也是用了私有样式example1</a>
                <br/>
                <br/>
                ################################################################################################
                <br/>
                输入任意内容触发 exampleState 更新：<input onChange={this.setName.bind(this)} ref={'nameInput'}/>
                <p>读取到 exampleState 中的name：{name}</p>
                <br/>
                ################################################################################################
                <br/>
                <Link to='/example2?age='>点我跳转到example2</Link>
                <br/>
                <br/>
                <Example333333 name={name} age={188}/>
                <Example3 name={name} age={188}/>
                <Example4/>
                <br/>
                ################################################################################################
                <br/>
                商品列表：
                <br/>
                <ul>
                    {
                        productPage.products.map(product => {
                            return(
                                <li key={product.productId}>
                                    {product.productNm}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

Example1.propTypes = {
};

Example1.contextTypes = {
};

/**
 * 这个方法决定了当前组件能够从 store 中读取什么内容，以及组件何时会更新
 * 比如现在这里只读取了 store 中的 exampleState，所以当 exampleState 变化时当前组件会刷新，其他 state 更新时当前组件不刷新
 * @param store 整个store仓库
 * @param ownProps 当前组件的props属性
 */
const mapStateToProps = (store, ownProps) => {
    return {
        exampleState:store.exampleState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({setName, pageProduct}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Example1);




