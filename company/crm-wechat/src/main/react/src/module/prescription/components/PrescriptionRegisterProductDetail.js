/**
 * @author olx
 * @date 2018/8/16/016
 * 商品简单详情
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import Img from "../../common/components/Img";
const PrescriptionRegisterProductDetail = ({history,platformType,productId, picture, productNm, priceDouble=0.00}) => {
    return (
        <div className="mt">
            <div className="cont" onClick={()=>history.push(productId?('/product/detail/' + productId + '/' + platformType):"/index")}>
                    <div className="pic"><a >
                        <Img src={picture} alt={productNm}/>
                    </a></div>
                    <div className="title"><a >{productNm}</a></div>
                    <div className="price">{priceDouble}</div>
            </div>
        </div>
    );
};

Img.propTypes = {
    priceDouble: PropTypes.number,
    platformType: PropTypes.string,
    productId: PropTypes.string,
    picture: PropTypes.number,
    productNm: PropTypes.func
};

export default PrescriptionRegisterProductDetail;