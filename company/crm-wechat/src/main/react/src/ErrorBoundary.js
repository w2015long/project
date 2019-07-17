/**
 * @author chencheng
 * @date 2018/3/19
 * 错误边界，捕捉渲染过程出现的错误，
 */

import React, { Component } from 'react';

class ErrorBoundary extends Component{
    constructor(props){
        super(props);
        this.state = {
            hasError:false
        }
    }

    componentDidCatch(error, info){
        this.setState({hasError:true});
        console.error('componentDidCatch>>>>' + error);
    }

    //todo chencheng：后续需要改成特定样式
    render(){
        if (this.state.hasError){
            return (
                <div>
                    <p>哎呀，当前页面出错了</p>
                    <button onClick={() => {window.location.href = '/';}}>返回首页</button>
                </div>
            )
        }else {
            return this.props.children;
        }
    }
}

export default ErrorBoundary