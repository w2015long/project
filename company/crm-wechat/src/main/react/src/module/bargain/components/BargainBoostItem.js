/**
 * @author olx
 * @date 2018/12/28/028
 * 砍价助力项
 */

import React from 'react';
import PropTypes from 'prop-types';
import futou from "../../../media/images/futou.png";
import default_head from "../../../media/images/default_head.png";

// 第一种，简介写法-无状态函数式组件

const BargainBoostItem = ({item}) => {
    if(!item||!item.mutualBargainBoostRecordId){
        return (
            <div className="invitation_item"   >
                <div className="invitation_pic">
                    <span>?</span>
                </div>
                <div className="bargain_icon">
                    砍价
                </div>
                <div className="bargain_amount">??</div>
            </div>
        );
    }else {
        return (
            <div className="invitation_item"  >
                <div className="invitation_pic">
                    <img src={item.boostHeadIcon?item.boostHeadIcon:default_head}alt={"图片"}/>
                </div>
                <div className="bargain_icon">
                    <img src={futou}alt={"图片"}/>
                    {item.isReceive==="Y"&&<img src={futou}alt={"图片"}/>}
                </div>
                <div className="bargain_amount">-{item.bargainTotalAmountDouble}元</div>
            </div>
        );
    }

};


BargainBoostItem.propTypes = {
    item: PropTypes.object,

};

export default BargainBoostItem;




