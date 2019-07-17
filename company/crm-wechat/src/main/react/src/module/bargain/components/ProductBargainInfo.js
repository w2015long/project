/**
 * @author olx
 * @date 2018/12/27/027
 * 砍价商品详情
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

// 第一种，简介写法-无状态函数式组件

const ProductBargainInfo = ({productMainPic,productNm, productPriceDouble, activityPriceDouble, receiveNum, activityProductStock,callBack=()=>{}}) => {
    return (
        <div className="product_information" onClick={()=>callBack()}>
            <div className="product_pic">
                <img src={productMainPic}alt={"商品主图"}/>
            </div>
            <div className="product_description">
                <h5>{productNm}</h5>
                <div className="bot-flex">
                    <p style={{marginBottom:"0em"}}><span>￥</span>{productPriceDouble}</p>
                    <div className="mutual_bargain take_away">{activityPriceDouble}元拿</div>
                    <div className="mutual_bargain remaining_text">已拿{receiveNum}份,剩{activityProductStock}份</div>
                </div>

            </div>
        </div>
    );
};


ProductBargainInfo.propTypes = {
    productMainPic: PropTypes.string,
    callBack: PropTypes.func,
    productNm: PropTypes.string,
    productPriceDouble: PropTypes.number,
    activityPriceDouble: PropTypes.number,
    receiveNum: PropTypes.number,
    activityProductStock: PropTypes.number,
};

export default ProductBargainInfo;




