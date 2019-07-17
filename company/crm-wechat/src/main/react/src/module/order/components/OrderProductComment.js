/**
 * @author lcl
 * @data 2018/8/15
 */

// 引入react组件
import React, {Component} from "react";
// 引入css
import '../style/my-comments.css';
// 交给redux管理
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
// 导入时间格式化
import moment from 'moment';
// 引入方法
import {pageComment} from '../actions/orderCommentListAction';
//自动加载下一页
import AutoLoadMore from "../../../module/common/components/AutoLoadMore";
import {Link} from "react-router-dom";

class OrderProductComment extends Component {
    //组件作用域内的一个组件状态，react的核心
    state={

    };
    //构造方法，基本没有使用
    constructor(prosp){
        super(prosp);
        document.title='我的评价-列表';
    }
    // 生命状态之一：在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount(){
        this.reloadComment();//加载评论
    }
    // 加载评论列表
    reloadComment(){
        let {oderCommentPage} = this.props.orderProductCommentState;
        this.props.actions.pageComment(0,oderCommentPage.size);
    }
    // 加载下一页
    loadMoreFunc(){
        let {oderCommentPage} =this.props.orderProductCommentState;
        this.props.actions.pageComment(oderCommentPage.page+1,oderCommentPage.size,oderCommentPage.oderComments);
    }
  /*  // 跳转--> 评论详情
    goToSearch(){
        let {commentSearchParams} = this.props.oderCommentPage;
        // MenuRouter 中的地址：
        this.props.history.push(''+commentSearchParams.keywords)
    }*/

    render(){
        // 从仓库得到值 赋值 给当前变量
        let {oderCommentPage,commentSearchParams} = this.props.orderProductCommentState;
        let comments = oderCommentPage.oderComments || [];
        // 获取动作-->行为方法
        const actions = this.props.actions;
        const isHaveNextPage = oderCommentPage.size * (oderCommentPage.page + 1) < oderCommentPage.recordsFiltered;
        return(
            /*防止样式污染，加入顶层div*/
            <div className={'order-product-comment'}>
            <div className="my-comment"id={'commentList'}>
                    {
                        comments.map(comment=>{
                            let products = comment.productList || [];
                            return(
                                <div className="item" key={comment.orderId}>
                                    <div className="item-hd"><a href="javascript:">订单: {comment.orderNum}</a></div>
                                {
                                    products.map(product => {
                                    return(
                                        <Link to={"/order/commentDetails/" + comment.orderCommentId}>
                                            <div className="item-bd" key={product.productId}>
                                                <div className="pic"><img src={product.pictureStr} alt=""/></div>
                                            </div>
                                        </Link>
                                    )
                                    })
                                }
                            <div className="item-ft">
                                <div className="ft-lt">{comment.name}</div>
                                <div className="ft-rt">{moment(comment.commentTime).format('YYYY.MM.DD HH:mm:ss')}</div>
                            </div>
                                </div>
                            )
                        })
                    }
                <AutoLoadMore container={'commentList'} isHaveNextPage = {isHaveNextPage} loadMoreFunc={this.loadMoreFunc.bind(this)}/>
            </div>
            </div>
        );
    }
}
// 类型检测
OrderProductComment.propTypes = {};

OrderProductComment.contextTypes = {};

// 将方法交给redux中央仓库管理
const mapStateToProps = (store, ownProps) => {
    return {
        orderProductCommentState:store.orderProductCommentState,
        normalCartState:store.normalCartState
    }
};

// 页面提交方法 -> 交给redux
const  mapDispatchToProps = (dispatch,ownProps) => {
    return{
        actions:bindActionCreators({pageComment},dispatch)
    }
};
/**
 * 把orderProdcutCommentList 转换为组件转换为容器组件
 * 第一个括号有两个参数：
 *      第一个参数是一个函数，返回一个对象，对象的键是该组件的prop属性，值是该prop的值；
 *      第二个参数也是一个函数，返回一个对象，对象的键同样是prop的属性名，值是一个redux的dispatch，
 *      当这个prop属性被用于触发时，dispatch会改变redux中state的值
 *  第二个括号是要添加prop的react组件
 */
export default connect(mapStateToProps, mapDispatchToProps)(OrderProductComment);