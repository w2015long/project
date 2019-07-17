/**
 * @author olx
 * @date 2018/12/27/027
 * 分享者信息
 */

import React from 'react';
import PropTypes from 'prop-types';
import default_head from "../../../media/images/default_head.png";

// 第一种，简介写法-无状态函数式组件

const SharerMemberInfo = ({memberHeadIcon,memberName,activityPriceDouble}) => {
    return (
        <div className="share-message">
            <div className="avatar">
                <img src={memberHeadIcon?memberHeadIcon:default_head} alt={"头像"}/>
            </div>
            <div className="i_name">{memberName}</div>
            <div className="bargaining_together"><span>"</span>我发现一件好货，一起砍价{activityPriceDouble}元拿<span>"</span></div>
        </div>
    );
};



SharerMemberInfo.propTypes = {
    memberHeadIcon: PropTypes.string,
    memberName: PropTypes.string,
    activityPriceDouble: PropTypes.number,
};

export default SharerMemberInfo;




