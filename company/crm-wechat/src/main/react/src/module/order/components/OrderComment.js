/**
 * @author liezihao
 * @date 2018/8/15
 * 发表评价
 */
// 引入react组件
import React, {Component} from "react";
// 引入css
import '../style/order-comment.css';
// 引入方法
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
//引入星星组件
import Star from '../../common/components/Star';
//超链接
import {Link} from "react-router-dom";
//引入图片
import Img from "../../common/components/Img";
//上传图片
import PicturesWall from "../../common/components/PicturesWall";

import {
    emptyObject,
    orderCommentList,
    changeGetOrderId,
    changeGetIsAnonymity,
    changeGetServiceGrade,
    changeGetDeliveryGrade,
    changeGetLogisticsGrade,
    orderProductCommentList,
    publishCommentOrderInformation,
    savePublishComment
} from '../actions/orderCommentAction';

import {
    pageOrder
} from "../actions/orderListActions";



class OrderComment extends Component {
    state = {
        isAnonymity : true
    };

    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        document.title = '发表评论';
        //初始化时先清空数据
        this.props.actions.emptyObject();
        //获取订单评论列表
        this.props.actions.orderCommentList(this.props.match.params.orderId,(data)=>{this.callBack(data)});
    }

    //回调函数
    callBack(data={}) {
        const self = this;
        let list = data.productInformationProtocolList || [];
        list.map((product) => {
            self.newOrderProductCommentList(product);
        })
    }

    //发表评价 -服务评分
    changeOrderServiceGradeStar(starValue) {
        this.props.actions.changeGetServiceGrade(starValue);
    }

    //发表评价 -发货评分
    changeOrderDeliveryGradeStar(starValue) {
        this.props.actions.changeGetDeliveryGrade(starValue);
    }

    //发表评价 -物流评分
    changeOrderLogisticsGradeStar(starValue) {
        this.props.actions.changeGetLogisticsGrade(starValue);
    }

    //商品评分
    changeProductStar(starValue ,index){
        let orderProductCommentList = this.props.orderCommentListState.publishComment.orderProductComments;
        for (let i = 0; i < orderProductCommentList.length; i++) {
            if (i === index) {
                orderProductCommentList[i].grade = starValue;
            }
        }
    }



    //初始化对象
    newOrderProductCommentList(product) {
        const {publishComment} = this.props.orderCommentListState;
        let orderProductCommentsList = publishComment.orderProductComments || [];
        let orderProductComment = new Object();
        orderProductComment.productId = product.productId;
        orderProductComment.grade = 5;
        orderProductComment.content = '';
        orderProductComment.imgFileIds = '';
        orderProductCommentsList.push(orderProductComment);
       this.props.actions.orderProductCommentList(orderProductCommentsList);
    }

    //添加图片时 拼接图片路径
    onFileUploadSuccess(file) {
        console.log(file);
        let orderProductCommentList = this.props.orderCommentListState.publishComment.orderProductComments;
        for (let i = 0; i < orderProductCommentList.length; i++) {
            if (i === file.sign) {
                orderProductCommentList[i].imgFileIds += file.file.fileId+",";
            }
        }
    }

    //删除图片时 更改图片路径
    handleFileDelete(file) {
        let orderProductCommentList = this.props.orderCommentListState.publishComment.orderProductComments;
        for (let i = 0; i < orderProductCommentList.length; i++) {
            if (i === file.sign) {
                let productCommentList = orderProductCommentList[i].imgFileIds;
                let productList = productCommentList.substring(0, productCommentList.length - 1).split(',');
                for (let t = 0; t < productList.length; t++) {
                    if (productList[t] === file.file.fileId) {
                        productList.splice(t, 1);
                    }
                }
                let newOrderProductCommentList = '';
                for (let e = 0; e < productList.length; e++) {
                    newOrderProductCommentList += productList[e]+",";
                }
                orderProductCommentList[i].imgFileIds = newOrderProductCommentList;
            }
        }
        console.log(orderProductCommentList);
    }

    //输入框数据时触发
    handleInputChange(event,_this,index){
        event.target.nextSibling.innerHTML=event.target.value.length +'/250';
        let orderProductCommentList = this.props.orderCommentListState.publishComment.orderProductComments;
        for (let i = 0; i < orderProductCommentList.length; i++) {
            if (i === index) {
                orderProductCommentList[i].content = event.target.value;
            }
        }
    }



    //提交
    submissionForm(orderId,_this){
        const {publishComment} = this.props.orderCommentListState;
        publishComment.orderId = orderId;
        publishComment.isAnonymity = _this.state.isAnonymity?'N':'Y';
        let orderProductCommentsList = publishComment.orderProductComments;
        for(let i=0; i<orderProductCommentsList.length;i++){
            if(orderProductCommentsList[i].imgFileIds){
                publishComment.orderProductComments[i].imgFileIds = orderProductCommentsList[i].imgFileIds.substring(0, orderProductCommentsList[i].imgFileIds.length - 1);
            }
            if(!orderProductCommentsList[i].content){
                publishComment.orderProductComments[i].content = '物流速度很快,好评!';
            }
        }
        this.props.actions.publishCommentOrderInformation(publishComment,()=>{this.implementSavePublishComment()});
    }

    //提交回调函数，发送请求
    implementSavePublishComment(){
        const {publishComment} = this.props.orderCommentListState;
        this.props.actions.savePublishComment(publishComment,()=>{this.loadPageCallBack()});
    }

    //评论成功，加载订单列表页面 回调函数
    loadPageCallBack(){
        this.props.history.goBack()
    }





    render() {

        const {orderCommentList} = this.props.orderCommentListState;
        let orderDetailsEntity = orderCommentList || [];
        let productInformation = orderCommentList.productInformationProtocolList || [];

        const _this = this;
        return (
            <div className={'order-comment'}>
                <div className="evaluation">
                    <div className="mt">
                        <a href="javascript:" className="back" onClick={()=>{this.loadPageCallBack()}}> </a>
                        <span>发表评价</span>
                        <a className="rt-btn color-blue" onClick={()=>{this.submissionForm(orderDetailsEntity.orderId,_this)}}>提交</a>
                    </div>
                    <div className="hold-div-top"> </div>
                    <div className="mc">
                        <div className="mc-hd">
                            <p>订单: {orderDetailsEntity.orderNum}</p>
                            <span>{orderDetailsEntity.createTimeStr}</span>
                        </div>
                        <div className="mc-bd"
                             style={{display: orderDetailsEntity.platformType === 'O2O' ? 'none' : ''}}>
                            <div className="bot-title"><span>订单评分</span></div>
                            <div className="bot-score">
                                <div className="score-box">
                                    <span className="label">服务态度</span>
                                    <Star canClick={true} callbackFunc={(value) => {
                                        this.changeOrderServiceGradeStar(value)
                                    }}/>
                                </div>
                                <div className="score-box">
                                    <span className="label">发货速度</span>
                                    <Star canClick={true} callbackFunc={(value) => {
                                        this.changeOrderDeliveryGradeStar(value)
                                    }}/>
                                </div>
                                <div className="score-box">
                                    <span className="label">物流态度</span>
                                    <Star canClick={true} callbackFunc={(value) => {
                                        this.changeOrderLogisticsGradeStar(value)
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="mc-anony" style={this.state.isAnonymity ?  {display: "block"} : {display: "none"}}>
                            <a className="anonymity cur"  onClick={() => {
                                this.setState({isAnonymity: false})
                            }}>匿名</a>
                            <span>评价以匿名的形式展现</span>
                        </div>
                        <div className="mc-anony" style={this.state.isAnonymity ? {display: "none"} : {display: "block"}} >
                            <a className="anonymity" onClick={() => {
                                this.setState({isAnonymity: true})
                            }}>匿名</a>
                            <span>你的评价能帮助其他小伙伴哦~</span>
                        </div>
                        <div className="mc-ft">

                            {

                                productInformation.map((product,index) => {

                                    return (
                                        <div className="mc-ft prodictBody" key={index} >

                                            <div className="item">
                                                <div className="item-hd">
                                                    <div className="pic"><Link
                                                        to={"/product/detail/" + product.productId + "/" + orderDetailsEntity.platformType}><Img
                                                        src={product.pictureStr}/></Link>
                                                    </div>
                                                    <Link
                                                        to={"/product/detail/" + product.productId + "/" + orderDetailsEntity.platformType}>{product.productNm}</Link>
                                                    <Star canClick={true} callbackFunc={(value) => {
                                                        this.changeProductStar(value,index);
                                                    }}/>
                                                </div>
                                                <div className="item-bd">
                                                    <textarea placeholder="说说您对购买商品的评价"  maxLength={250}
                                                         onChange={(e)=> {this.handleInputChange(e, _this,index)}}>
                                                    </textarea><span>0/250</span>
                                                </div>
                                                <div className="item-ft">
                                                    <PicturesWall
                                                        onSuccess= {this.onFileUploadSuccess.bind(this)}
                                                        onRemove= { this.handleFileDelete.bind(this)}
                                                        numberOfLimit= {4}
                                                        numberOfSize= {10}
                                                        sign= {index}
                                                    />
                                                </div>
                                            </div>


                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                </div>
                <div className="compile-layer" style={{display: "none"}}>
                    <div className="compile-box">
                        <div className="mc"><span>确定放弃此次编辑？</span></div>
                        <div className="md">
                            <a href="javascript:" className="cancel">取消</a>
                            <a href="javascript:" className="confirm">确定</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        orderCommentListState: store.orderCommentListState,
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            emptyObject,
            orderCommentList,
            changeGetOrderId,
            changeGetIsAnonymity,
            changeGetServiceGrade,
            changeGetDeliveryGrade,
            changeGetLogisticsGrade,
            orderProductCommentList,
            publishCommentOrderInformation,
            savePublishComment,
            pageOrder
        }, dispatch),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderComment);
