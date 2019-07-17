/**
 * @author olx
 * @date 2018/12/27/027
 * 历史砍价成功记录
 */

import React from 'react';
import PropTypes from 'prop-types';
import jixing from "../../../media/images/jixing.png";
import default_head from "../../../media/images/default_head.png";

// 第一种，简介写法-无状态函数式组件

const HistorySuccessRecord = ({bargainActivityInfo}) => {
    const getTime = (data) => {
        const now = new Date().getTime();
        const diff = now-data;
        const minute = 60*1000;
        const hour = 60 * minute;
        const day = 24 * hour;
       if(diff<=hour){
        //小于一小时内显示分钟
           return Number((diff) / minute).toFixed(0) + "分钟前";
       }
       if(hour<diff && diff<=day){
        //小于一天内显示小时
           return Number(diff/hour).toFixed(0) + "小时前";
       }
       //超过一天显示天数
        return Number(diff / day ).toFixed(0)+ "天数前";
    };
    return (
        <div className="winning_list">
            <div className="winning_bg"></div>
            <div className="list_winners">
                <div className="list_winners_bg">
                    <img src={jixing} alt={"背景"}/>
                </div>
                <div className="winners_title">砍价能手</div>
                <p>已有<span>{bargainActivityInfo.allActivitySuccessNum}</span>人成功拿到好货</p>
                <div className="list_winners_item">
                    {
                        bargainActivityInfo.wapMutualBargainHistoryRecordProtocols.map((item,index)=>{
                            return(
                                <div className="award" key={index}>
                                    <div className="award_pic">
                                        <img src={item.memberHeadIcon?item.memberHeadIcon:default_head} alt={"图片"}/>
                                    </div>
                                    <div className="award_content">
                                        <h5>{item.memberName} {item.activitySite?"- "+item.activitySite:""}</h5>
                                        <p>成功砍下了【{item.productNm} 】</p>
                                        <div className="dtime">{getTime(item.bargainSuccessTime)}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="award">
                        <div className="empty"> 邀请朋友帮你砍价(ง •̀_•́)ง你会是下一个哟</div>
                    </div>
                </div>
            </div>
        </div>
    );
};


HistorySuccessRecord.propTypes = {
    bargainActivityInfo: PropTypes.object,
};

export default HistorySuccessRecord;




