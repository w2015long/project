import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {Affix} from 'antd';

/**
 *  门店 眉目 展示门店基本信息
 * @param shopDetail 门店详情
 * @param funcCloseTip 关闭门店状态Tip
 * @param history
 * @param isShowTip 是否显示门店状态Tip
 * @returns {*}
 * @constructor
 */
const IndexShopHead = ({shopDetail, funcCloseTip,history,isShowTip}) => {
    const shopIsExit = shopDetail && shopDetail.shopId !=null;
    return (

        <div className="no_information indexShopHeadDivBlock">
            {shopIsExit && <div className="no_top">
                <a >
                    <div className="top_l"onClick={() => history.push('/shop/detail/' + shopDetail.shopId)}>
                        <img src={shopDetail.wechatPhoto} alt=""/>
                        {shopDetail.isNormalOpening === "N" ? <span>停业中</span> : ""}
                        {shopDetail.isNormalOpening === "Y" && shopDetail.isRest === "Y" ? <span>休息中</span> : ""}
                    </div>
                    <div className="top_r" onClick={() => history.push('/shop/detail/' + shopDetail.shopId)}>
                        <h5 className="top_title">{shopDetail.name}</h5>
                        <span
                            className="psf">配送费：{shopDetail.distributionAmount && shopDetail.distributionAmount > 0 ? shopDetail.distributionAmount + '元' : "免配送费"}</span>
                        <span>公告：{shopDetail.notice}</span>
                    </div>
                    <div className="tips"  style={{display: isShowTip ? 'block' : 'none'}}>亲！当前门店不在配送范围内。<span onClick={()=>funcCloseTip()} className="close"/></div>

                    <div className="top_f"></div>
                </a>
            </div>}
            {!shopIsExit && <div className="no_top"><a >
                <div className="top_l">
                </div>
                <div className="top_r">
                    <h5>暂无支持当天达的门店</h5>
                    <p>可以看周边门店，也可以选择去商城购药</p>
                </div>
            </a></div>}
            {!shopIsExit && <div className="no_bottom">
                <Link to={'/mall/index'} className="b_item color-blue">金康商城(3-5天送达)</Link>
                <Link to={'/index/selectAddr'} className="b_item">手动设置收货地址</Link>
            </div>}
        </div>

    );
};
IndexShopHead.propTypes = {
    shopDetail:PropTypes.object.isRequired,
    funcCloseTip:PropTypes.func.isRequired,
    isShowTip:PropTypes.bool.isRequired,
};

export default IndexShopHead