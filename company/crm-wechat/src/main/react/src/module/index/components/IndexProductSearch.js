import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import sousuo from "../../../media/images/sousuo.png";
import { Affix } from 'antd';
import "../style/IndexProductSearch.css";
/**
 * 首页 搜索
 * @param shopId 首页
 * @param history
 * @param locationName
 * @returns {*}
 * @constructor
 */
const IndexProductSearch = ({history, searchProductUrl,isStickySearchInput}) => {
    return (
        <div className={"index-Product-Search"}>
            <div className="search_for">
                <i><img src={sousuo}/></i>
                <input onClick={() => history.push(searchProductUrl)} type="text" placeholder="搜索疾病/商品名称"/>
            </div>
            {
                isStickySearchInput==="Y" &&
                    <div className="fix-box"  style={{ position: "fixed", zIndex: 9999, right: "0px", left: "0px", top:" 0px", width: "100%"}}>
                        <div className="search_box">
                            <i><img src={sousuo}/></i>
                            <input onClick={() => history.push(searchProductUrl)} type="text" placeholder="搜索搜索疾病/商品名称"/>
                        </div>
                    </div>
            }
        </div>

    );
};
IndexProductSearch.propTypes = {
    searchProductUrl: PropTypes.string.isRequired,

};

export default IndexProductSearch