/**
 * Created by admin on 2018/3/27.
 * 会员信息详情
 */
import React, {Component} from "react";
import "../style/card.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {activateMemberCard,getRewardList, commonSetCardState, getMemberRegisterInfo} from "../actions/cardAction";

import * as types from "../constants/ActionTypes";


class Card extends Component {

    componentWillMount() {


        document.title = '激活中';

        const cardState = this.props.cardState;
        const memberRegister = cardState.memberRegister ;
        if(memberRegister){
            return;//防止用户返回页面重新发起激活会员卡请求
        }
        let card = this.props.location.search || "";
        let paramList = card.split("&");
        if (paramList.length < 4) {
            this.checkUrlParams();
            return;
        }
        let map = {};
        for (let item in paramList) {
            let value = this.getParamsValue(paramList[item]);
            map[value[0]] = value[1];
        }

        let cardInfo = {
            cardId: this.checkUrlParams(map["card_id"], "卡号"),
            encryptCode: this.checkUrlParams(map["encrypt_code"], "编码"),
            openId: this.checkUrlParams(map["openid"], "微信会员id"),
            outer_str: map["outer_str"],
            activateTicket: this.checkUrlParams(map["activate_ticket"], "密钥")
        };
        this.props.actions.commonSetCardState(types.MEMBER_CARD_INFO, cardInfo);
        this.props.actions.commonSetCardState(types.MEMBER_SUBMIT_STATE,{submitState:"isSubmitting"});
        this.props.actions.getMemberRegisterInfo(map["activate_ticket"],()=>{this.activateMemberCard()});
    }

    getParamsValue(data) {
        let values = data.split("=");
        if (values.length < 2) {
            this.checkUrlParams();
            return;
        }
        if (values[0].indexOf("?") === 0) {
            values[0] = values[0].substring(1, values[0].length)
        }
        return values;
    }

    checkUrlParams(data = "", tip = "数据缺失") {
        if (!data) {
            window.errorAlert(tip);
            return;
        }
        return data;
    }

    activateMemberCard() {
        const cardState = this.props.cardState;
        if (!cardState.cardInfo) {
            this.checkUrlParams();
            return
        }
        const {cardId, encryptCode, openId, outer_str, activateTicket} = cardState.cardInfo;
        this.props.actions.activateMemberCard(cardId, encryptCode, openId, outer_str, activateTicket, ()=>{this.props.actions.getRewardList()})
    }

    render() {
        const cardState = this.props.cardState;
        const submitState = cardState.submitState;
        const isNewMember = cardState.isNewMember;
        const cardNumber = cardState.cardNumber;
        const memberRegister = cardState.memberRegister||{} ;
        const errorMsg = cardState.errorMsg ;
        const rewardList = cardState.rewardList ||[];


        return (
            <div className="card">
                <div className="get-coupon">
                    <div className="mt">

                        {submitState ==="success"&&
                        <div>
                            <div className="icon-box"></div>
                            <h4>激活成功</h4>
                            {memberRegister["会员卡"] && isNewMember ==="Y" && <p>卡号错误,已为您领取新的卡号,如需更绑卡号,请留意后续功能升级</p>}
                            {memberRegister["会员卡"] && isNewMember ==="N"  && <p>卡号正确,已为您同步积分与余额</p>}
                            {!memberRegister["会员卡"] && isNewMember ==="Y" && <p>您是新会员,已为您激活并领取卡号成功:{cardNumber}</p>}
                            {!memberRegister["会员卡"] && isNewMember ==="N" && <p>您是老会员,已为您同步积分与余额 卡号:{cardNumber}</p>}

                            <a className="weui-btn" onClick={()=>{this.returnToCard()}}>去首页</a>
                        </div>}
                        {submitState ==="isSubmitting"&&
                        <div className="activation-main">
                            <div className="icon-box-ing"></div>
                            <p>努力激活中…</p>
                        </div>}

                        {submitState ==="fail"&& <h4>开卡失败了,请亲把该信息拿给店员...(错误信息:{errorMsg})</h4>}
                    </div>
                    {submitState ==="success" &&
                    <div>
                        <h5><span>获得奖品</span></h5>
                        {rewardList.map((item)=>{
                            return(
                                <div className="coupon-box">
                                    <div className="box-left">
                                        <div className="cont">
                                            {item.rewardType !=="INTEGRAL"&& item.couponType === 'FULL_REDUCE' &&<i>￥</i>}
                                            {item.rewardType !=="INTEGRAL"&& item.couponType === 'FULL_REDUCE' && <span>{item.couponAmountDouble}</span>}
                                            {item.rewardType !=="INTEGRAL"&& item.couponType === 'DISCOUNT' && <span>{item.couponDiscount}折</span>}
                                            {item.rewardType ==="INTEGRAL"&&<span>{item.rewardValue}分</span>}
                                        </div>
                                    </div>
                                    <div className="box-right">
                                        <div className="title">{item.rewardName}</div>
                                        {item.rewardType ==="COUPON"&&<div className="full">{item.couponUseFilterDes}</div>}
                                        {item.rewardType ==="COUPON"&&<div className="time">{item.couponUseTimeDes}</div>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
                </div>
            </div>
        )
    }

    returnToCard() {
        // window.wx.closeWindow();
        this.props.history.push('/')
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        cardState: store.cardState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            commonSetCardState,
            activateMemberCard,
            getRewardList,
            getMemberRegisterInfo
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
