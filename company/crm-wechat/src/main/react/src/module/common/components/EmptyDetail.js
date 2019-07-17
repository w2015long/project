/**
 * @author lcl
 * @date 2019/05/29
 * 空商品详情预加载页
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import "../style/EmptyDetail.css"
const EmptyDetail = ({type}) => {
    return (
        <div className={"empty-detail"}>
            {type === "shop" && <div className="hello-main">
                <div className="bg1"/>
                <div className="bg2"/>
                <div className="bg3">
                    <div className="bg3-l"/><div className="bg3-r"><div className="gb3r-t"/><div className="gb3r-c"/><div className="gb3r-b"/></div>
                </div>
                <div className="bg4"/>
                <div className="bg5"/>
                <div className="bg6"/>
                <div className="bg7"/>
            </div>}
            {type === "product" &&
            <div className="loading-main">
                <div className="topbig-gb"/>
                <div className="bottom-bg">
                    <div className="bottom-bg1"/>
                    <div className="bottom-bg2"/>
                    <div className="bottom-bg3"/>
                    <div className="bottom-bg4"/>
                    <div className="bottom-bg5"/>
                </div>
                <div className="bottom-bg2">
                    <div className="bg1-left"/>
                    <div className="bg1-right">
                        <div className="right-bgt"/>
                        <div className="right-bgb"/>
                    </div>
                </div>
            </div>}
        </div>

    )
};


EmptyDetail.propTypes = {
    type: PropTypes.string,  //商品或门店
};

export default EmptyDetail;




