/**
 * Created by liezihao on 2018/8/16
 * 订单评论详情
 * OrderProductCommentDetails
 */


// 引入react组件
import React, {Component} from "react";
// 引入css
import '../style/orderProductCommentDetails.css';
// 引入方法
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import LoadingPicture from './LoadingPicture';
import ProductCommentMainBody from './ProductCommentMainBody';
import {getOrderProductCommentDetails} from '../actions/orderProductCommentDetailsAction';
//引入图片


class OrderProductCommentDetails extends Component {

    //组件作用域内的一个组件状态，react的核心
    state = {};


    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        document.title = '评价详情';
        this.props.actions.getOrderProductCommentDetails(this.props.match.params.id);
    }


    render() {
        const {productCommentDetails} = this.props.productCommentDetailsSate;
        let productCommentDetailsList = productCommentDetails || [];
        let productCommentDetailsContentList = productCommentDetailsList.orderProductCommentList || [];

        return (
            <div className={'comment-details'}>
                <div className="comment-detail">
                    <div className="detail-hd">
                        <div className="hd-top">
                            <p>订单:{productCommentDetailsList.orderNum} </p>
                            <span>{productCommentDetailsList.commentTimeStr}</span>
                        </div>
                        <div className="hd-bot">
                            <div className="bot-title"><span>订单评分</span></div>
                            <div className="bot-score">
                                <div className="score-box">
                                    <span>服务态度</span>
                                    <LoadingPicture grade={productCommentDetailsList.serviceGrade} />
                                </div>
                                <div className="score-box">
                                    <span>发货速度</span>
                                    <LoadingPicture grade={productCommentDetailsList.deliveryGrade} />
                                </div>
                                <div className="score-box">
                                    <span>物流评分</span>
                                    <LoadingPicture grade={productCommentDetailsList.logisticsGrade} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="detail-bd">
                        {
                            productCommentDetailsContentList.map((orderProductComment, index) => {
                                return (
                                    <ProductCommentMainBody key={index} orderProductComment={orderProductComment} platformType={productCommentDetailsList.platformType} />
                                );
                            })
                        }
                    </div>
                </div>

            </div>
        );
    }

}

const mapStateToProps = (store, ownProps) => {
    return {
        productCommentDetailsSate: store.productCommentDetailsSate

    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getOrderProductCommentDetails}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderProductCommentDetails);

