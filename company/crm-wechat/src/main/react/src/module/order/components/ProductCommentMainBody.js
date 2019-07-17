/**
 * 商品评论主体
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LoadingPicture from './LoadingPicture';
import Img from "../../common/components/Img";
import {Link} from "react-router-dom";


const ProductCommentMainBody = ({orderProductComment , platformType}) => {

    return (
        <div className="item">
            <div className="score-box">
                <span>{orderProductComment.commentTimeStr}</span>
                <LoadingPicture grade={orderProductComment.grade}/>
            </div>
            <div className="cont">{orderProductComment.content}</div>
            <div className="pic-box" style={orderProductComment.isHasImg === 'Y' ? {} : {display: 'none'}}>
                {
                    orderProductComment.isHasImg === "Y" && orderProductComment.picturesStr.split(',').map((pic , index) => {
                        return (
                            <div className="pic" key={index} ><Img  src={pic}/></div>
                        )
                    })
                }
            </div>
            <div className="m-bot">
                <div className="pic"> <Link to={"/product/detail/"+orderProductComment.productId+"/"+platformType}><img src={orderProductComment.pictureStr} alt=""/></Link></div>
                <Link to={"/product/detail/"+orderProductComment.productId+"/"+platformType}>{orderProductComment.productNm} </Link>
                <div className="price">
                    <i>￥</i>
                    <span>{orderProductComment.priceDouble.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

ProductCommentMainBody.propTypes = {
    grade: PropTypes.number
};

export default ProductCommentMainBody;




