/**
 * @author olx
 * @date 2018/12/27/027
 * 参与者 活动进展
 */

import React from 'react';
import PropTypes from 'prop-types';

import BargainBoostItem from "./BargainBoostItem";
// 第一种，简介写法-无状态函数式组件

const BargainBoostList = ({bargainActivityInfo}) => {
    const array = [];
    const getList=()=>{
        for (let i = 0; i < bargainActivityInfo.mostBargainPeopleNum; i++) {
            array[i] = i;
        }
        return array;
    }
    return (
        <div className="mutual_bargain invitation_box">
            <div className="invitation_box_title">只需{bargainActivityInfo.leastTranslationNum}人完成"双刀"砍价, 即可{bargainActivityInfo.activityPriceDouble}元领取</div>
            <div className="invitation_list">
                {
                    getList().map(index=>{
                        return (<BargainBoostItem item={bargainActivityInfo.wapMutualBargainShareRecordDetailProtocols[index]} key={index}/>);
                    })
                }

            </div>
        </div>
    );
};


BargainBoostList.propTypes = {
    bargainActivityInfo: PropTypes.object,
};

export default BargainBoostList;




