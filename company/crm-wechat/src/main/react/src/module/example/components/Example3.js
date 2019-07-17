/**
 * @author chencheng
 * @date 2018/3/19
 * 展示组件示例
 * 展示组件仅仅是用来定义界面如何展示而已
 * 所有的数据应该来源于props，所以是不需要监听 store 的。
 * 需要保持展示组件的纯洁。如果需要读取某个 state 中的值 应该由父组件读取后通过props传递进来
 */

import React , {Component}from 'react';
import PropTypes from 'prop-types';

/**
 * 对于展示组件，使用简写语法即可，不需要render等方法
 * @param name 等价 this.props.name
 * @param age 等价 this.props.age
 */
// 第一种，简介写法
const Example3 = ({name, age}) =>{
    return(
        <div className={'Example3'}>
            #########################################################################
            <p>我是Example3，我是一个展示组件，我不需要监听redux，不需要绑定state。</p>
            <p>我读取不到state中的值，但是我能通过props向父组件要</p>
            <p>读取到props中的name={name}，age={age}</p>
            #########################################################################
        </div>
    );
};
// 第二种，基本写法
/*class Example3 extends Component{
    render(){
        return(
            <div className={'Example3'}>
                #########################################################################
                <p>我是Example3，我是一个展示组件，我不需要监听redux，不需要绑定state。</p>
                <p>我读取不到state中的值，但是我能通过props向父组件要</p>
                <p>读取到props中的name={this.props.name}，age={this.props.age}</p>
                #########################################################################
            </div>
        )
    }
}*/

/**
 * 这里定义了组件的propType，不是必须要定义的，但是定义后对我们开发有帮助，可以有代码提示
 *
 * 这里展示了PropTypes的用法
 * name:PropTypes.string.isRequired 表示name属性是字符串类型的，必传的
 * age:PropTypes.number 表示age属性是数字类型的，不是必传的
 */
Example3.propTypes = {
    name:PropTypes.string.isRequired,
    age:PropTypes.number
};

export class Example4 extends Component{

}
export default Example3;




