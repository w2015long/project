/**
 * @author chencheng
 * @date 2018/3/19
 */

import React, {Component}from 'react';
import {Link} from 'react-router-dom'
import '../style/Example2.css'
import logo from '../../../media/images/exampleLogo.svg'

class Example2 extends Component{

    render() {
        return (
            <div className={'example2'}>
                <a className='base-css-example test'>这里是example2，我使用私有样式test覆盖了公用样式base-css-example</a>
                <p>获取到路径参数是：{this.props.match.params.name}</p>
                <p>获取到查询参数是：{this.props.location.search}</p>
                <Link to='/example1'>标签类型的页面跳转，点我跳转到example1</Link>
                <p/>
                <button onClick={() => {this.props.history.push('/example1') }}>js类型的页面跳转，点我跳转到example1</button>
                <p/>
                <button onClick={() => {this.props.history.push('/example1') }}>返回上一页</button>
                <img src={logo} alt={'logo'}/>
            </div>
        )
    }
}

export default Example2



