// 引入react组件
import React, {Component} from "react";
// 引入css
import '../style/CommentPoint.css';
// 引入方法
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
//引入link，用来做页面跳转，实际上它会被渲染成a标签

//自动加载下一页
import {
    changeCommentPointSearchPage,
    changeCurrentGrade,
    getAllProductComment,
    getProductDetail,
    pageProductCommentByGrade,
} from "../actions/productActions";
import Img from "../../common/components/Img.js"
import customer from "../../../media/images/customer.png"
import StarItem from "./StarItem";
import AutoLoadMore from "../../../module/common/components/AutoLoadMore";

class CommentPoint extends Component {

    //组件作用域内的一个组件状态，react的核心
    state = {};

    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount() {
        document.title = '商品评价';
        let self = this;
        const {productId, platformType} = self.props.match.params;
        const {commentPointSearchPage} = this.props.productState;
        self.props.actions.getProductDetail(productId, platformType, '', () => {
            let params = Object.assign({}, commentPointSearchPage, {productId: productId, platformType: platformType});
            self.props.actions.changeCommentPointSearchPage(params);
            self.props.actions.pageProductCommentByGrade(params, 0, 10);//通过评价等级查找商品全部评价
        });
    }

    changeCurrentGrade(gradeLevelType) {
        const { commentPointSearchPage} = this.props.productState;
        console.log(commentPointSearchPage);
        this.props.actions.pageProductCommentByGrade(Object.assign({}, commentPointSearchPage, {gradeLevelType: gradeLevelType}), 0, 10);//通过评价等级查找商品全部评价
        this.props.actions.changeCurrentGrade(gradeLevelType);
    }

    //加载更多商品
    loadMoreProduct = () => {
        let {commentPointSearchPage} = this.props.productState;
        this.props.actions.pageProductCommentByGrade(commentPointSearchPage, commentPointSearchPage.page + 1, commentPointSearchPage.size, commentPointSearchPage.productGradeComments);
    };

    render() {
        const {productDetailData, gradeLevelType, commentPointSearchPage} = this.props.productState;
        let productGradeComments = commentPointSearchPage.productGradeComments;
        console.log(commentPointSearchPage);
        let productPicture = productDetailData.picture || "";
        let pictureArr = [];
        if (productPicture.length > 0) {
            pictureArr = productPicture.split(",");
        }
        const isHaveNextPage = commentPointSearchPage.size * (commentPointSearchPage.page + 1) < commentPointSearchPage.recordsFiltered;
        return (
            <div className="comment-point">
                <div className="detail-main">
                    <div className="dt-box" id="commentPoint">
                        <div className="evaluate-cont">
                            <div className="mt">
                                <div className="mt-hd">
                                    <div className="pic"><Img src={pictureArr[0]} alt="商品主图"/></div>
                                    <p>用户满意度<span>{productDetailData.satisfaction}%</span></p>
                                </div>
                                <div className="mt-bd">
                                    <span className={gradeLevelType ? "" : "cur"}
                                          onClick={() => this.changeCurrentGrade('')}>全部&nbsp;{productDetailData.totalNum}</span>
                                    <span className={gradeLevelType === "GOOD_GRADE" ? "cur" : ""}
                                          onClick={() => this.changeCurrentGrade("GOOD_GRADE")}>好评&nbsp;{productDetailData.goodGradeNum}</span>
                                    <span className={gradeLevelType === "MIDDLE_GRADE" ? "cur" : ""}
                                          onClick={() => this.changeCurrentGrade("MIDDLE_GRADE")}>中评&nbsp;{productDetailData.middleGradeNum}</span>
                                    <span className={gradeLevelType === "BAD_GRADE" ? "cur" : ""}
                                          onClick={() => this.changeCurrentGrade("BAD_GRADE")}>差评&nbsp;{productDetailData.badGradeNum}</span>
                                </div>
                            </div>
                            <div className="mc" id="productGradeComments">
                                {
                                    productGradeComments.map((comment, index) => {
                                        return (
                                            <div className="item" key={index}>
                                                <div className="item-hd">
                                                    <div className="pic"><img
                                                        src={comment.headPict == null ? customer : comment.headPict}
                                                        alt=""/></div>
                                                    <StarItem comment={comment}/>
                                                    <div
                                                        className="time">{comment.commentTimeStr.replace("-", ".").replace("-", ".")}</div>
                                                </div>
                                                <div className="item-bd">{comment.content}</div>
                                                {
                                                    comment.imgFileUrls && comment.imgFileUrls.split(",").length > 0 &&
                                                    <div className="item-ft">
                                                        {
                                                            comment.imgFileUrls.split(",").map((url, index) => {
                                                                return (
                                                                    <div className="pic" key={index}><img src={url}
                                                                                                          alt=""/></div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })
                                }
                                <AutoLoadMore container={'productGradeComments'} isHaveNextPage={isHaveNextPage}
                                              loadMoreFunc={this.loadMoreProduct}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

CommentPoint.propTypes = {};

CommentPoint.contextTypes = {};

const mapStateToProps = (store, ownProps) => {
    return {
        productState: store.productState,
        normalCartState: store.normalCartState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            changeCommentPointSearchPage,
            changeCurrentGrade,
            pageProductCommentByGrade,
            getAllProductComment,
            getProductDetail
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentPoint);