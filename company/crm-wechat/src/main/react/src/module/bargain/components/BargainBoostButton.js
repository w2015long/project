/**
 * @author olx
 * @date 2018/12/27/027
 * 助力与分享按钮
 */

import React, {PureComponent} from "react";
import PropTypes from 'prop-types';
import anniuGray from "../../../media/images/anniu-gray.png";
import anniu1 from "../../../media/images/anniu1.png";
import CountDown from '../../common/components/CountDown';



// 第二种，基本写法-带状态组件
class BargainBoostButton extends PureComponent {
    refreshCurrentPage(){

    }

    render() {
        const rendering = (
            <p>还剩 <span>@day@</span>日<span>@hour1@@hour2@</span>:<span>@minute1@@minute2@</span>:<span>@second1@@second2@</span> 过期，快来砍价吧~</p>
        );
        const {
             activityEndTime,
             isEnabled,
             isReceived,
             memberBargainState, //该活动状态
             bargainAmountDouble,
             bargainAmountRadio,
             bargainAmountDifferenceDouble,
             haveBoosted,
             haveBoostedThisBargain,
            activityActorTypeOfBoost,
            activityActorType,
            activityActorTypeName,
            mutualBargainActivityId,
            productId,

        } = this.props.bargainActivityInfo||{};
        const now = new Date().getTime();
        const rendered =   "该活动已结束,欢迎参加其他活动";
        const activityActorTypeFilter = activityActorType === activityActorTypeOfBoost || activityActorType === "ALL";//砍价者身份
        const activityIsNormal = (activityEndTime > now && isEnabled === "Y");
        return (
            <div className="mutual_bargain invitation_content">
                {memberBargainState ==="UNSUCCESSFUL"&&<h5>商品已砍<span>{bargainAmountDouble}元</span>，还剩<span>{bargainAmountDifferenceDouble}元</span></h5>}
                {memberBargainState ==="SUCCESSFUL"&&<h5>您的好友砍价成功</h5>}
                {memberBargainState ==="ORDERED"&&<h5>您的好友下单成功</h5>}
                <div className="progress_bar">
                    <div className="bar_item" style={{width: memberBargainState !=="UNSUCCESSFUL"?100+ "%":bargainAmountRadio + "%"}}/>
                </div>
                {!(haveBoosted==="Y"&&haveBoostedThisBargain==="N")&&activityActorTypeFilter&&<div className="help_bargain">
                    <img src={activityIsNormal?anniu1:anniuGray} alt={""}/>
                    {haveBoostedThisBargain==="N"&&memberBargainState ==="UNSUCCESSFUL"&&<span  onClick={activityIsNormal?()=>{this.props.updateMutualBargainBoostState()}:{}}>帮好友砍价，收获礼品</span>}
                    {haveBoostedThisBargain==="N"&&memberBargainState !=="UNSUCCESSFUL"&&<span>您的好友已砍价成功</span>}
                    {haveBoostedThisBargain==="Y"&&isReceived ==="N"&&<span onClick={()=>{activityIsNormal?this.props.toBargainReceiveAddress():{}}}>领礼品,再砍一次</span>}
                    {haveBoostedThisBargain==="Y"&&isReceived ==="Y"&&<span >您已领取礼品</span>}

                </div>}
                {activityActorTypeFilter&&haveBoosted==="Y"&&haveBoostedThisBargain==="N"&&<div className="help_bargain ">
                    <img src={anniuGray}  alt={""}/>
                      <span>您已为他人砍价</span>
                </div>}
                {!activityActorTypeFilter&&<div className="help_bargain">
                    <img src={anniuGray}  alt={""}/>
                      <span>仅支持{activityActorTypeName}砍价助力</span>
                </div>}
                {activityIsNormal&&<a className="initiate" onClick={()=>{this.props.saveMutualBargainShareRecord({mutualBargainActivityId:mutualBargainActivityId,productId:productId})}}>我也要发起砍价</a>}
                {activityEndTime&&<p> <CountDown endDateStr={activityEndTime} callBackFunc={this.refreshCurrentPage} rendering={ activityIsNormal?rendering:"该活动已临时下线,请等待处理"} rendered={rendered} /></p>}
            </div>
        )
    }
}

BargainBoostButton.propTypes = {
    bargainActivityInfo: PropTypes.object,

};

export default BargainBoostButton;




