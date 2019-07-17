import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import dinbusekuai from "../../../media/images/dinbusekuai.png";
import "../style/IndexHead.css";
/**
 * 首页 眉
 * @param shopId 首页
 * @param history
 * @param locationName
 * @returns {*}
 * @constructor
 */
const IndexHead = ({shopDetail,indexShopIsExit, history, locationName,activityCallbackFunc, callbackFunc,isShowCode=false,isShowNearByShop=false}) => {
    return (
        <div className="index-head bg_top indexHeadDivBlock">
            <img src={dinbusekuai}/>
            <Link  to='/index/selectAddr' className="addr_text">
                <span className="spa1">{shopDetail.name}</span>
                <span className="spa2">|</span>
                <span className="spa3">{locationName}</span></Link>
            <div className="code_sm">
                {/*{isShowCode && indexShopIsExit && <a className="code_item" onClick={() => callbackFunc()}/>}*/}
                {isShowNearByShop && indexShopIsExit && <a className="nearby" onClick={() => history.push('/index/nearBy')}>附近门店</a>}
            </div>
        </div>
    );
};
IndexHead.propTypes = {
    /*方法类型*/
    activityCallbackFunc: PropTypes.func,
    callbackFunc: PropTypes.func,
    locationName:PropTypes.string.isRequired,
    indexShopIsExit:PropTypes.bool.isRequired,
    shopDetail:PropTypes.object.isRequired,
};

export default IndexHead