import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

//引入jq模块
import $ from 'jquery';

import jiazai from '../../../media/images/loding1.gif';
import '../style/AutoLoadMore.css'
/**
 * 自动加载下一页-滚动到列表最后自动加载更多
 * 参数列表：
 *          loadMoreFunc：必须，加载更多function ，各自页面自己实现自己的加载更多方法
 *          isHaveNextPage: 必填，是否还有下一页
 *          container: 必填，下拉加载的容器id
 */
class AutoLoadMore extends PureComponent {
    state={
        props:{}
    };

    componentDidMount() {
        this.initLoadMore();
    }

    componentWillMount(){
        this.state.props = this.props;
    }
    componentWillUpdate(newProps){
        this.state.props = newProps;
    }

    //加载更多数据
    initLoadMore() {
        let self = this;
        window.addEventListener("touchend", function () {
            if ($(document).scrollTop() >= ($(document).height() - $(window).height() - 20)) {//滚动到最下方了
                let props = self.state.props;
                let $container = $('#' + props.container);
                if ($container.is(":visible")) {//容器是可见的
                    let loadMoreFunc = props.loadMoreFunc;//加载更多方法
                    let isHaveNextPage = props.isHaveNextPage;//是否还有下一页
                    let $loading = $(self.refs.loading);//加载中样式
                    //还有下一页
                    if (isHaveNextPage) {
                        $loading.show();
                        setTimeout(
                            () => {
                                loadMoreFunc();//执行真正的加载更多方法
                                $loading.hide();
                            }, 200);
                    }
                }
            }
        });
    }

    render() {
        if (this.props.isHaveNextPage) {
            return (
                <div className="loding" ref="loading" style={{display: 'none'}}>
                    <img src={jiazai} alt=""/>
                </div>
            )
        }else {
            return (
                <div style={{margin:'0 auto', textAlign:'center'}}>
                    暂无更多
                </div>
            )
        }
    }

}

AutoLoadMore.propTypes = {
    loadMoreFunc: PropTypes.func.isRequired,
    isHaveNextPage: PropTypes.bool.isRequired,
    container: PropTypes.string.isRequired,
};


export default AutoLoadMore;



