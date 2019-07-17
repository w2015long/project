/**
 * Created by olx on 2018年12月27日21:02:10
 * 砍价活动
 */
import React, {Component} from "react";
import "../style/bargain.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as types from "../constants/ActionTypes";

import {commonSetBargainState, getBargainActivityInfo, updateMutualBargainBoostState} from "../actions/bargainAction";
import banne_bg from "../../../media/images/banner@2x.png";
import SharerMemberInfo from "./SharerMemberInfo";
import ProductBargainInfo from "./ProductBargainInfo";
import BargainShareButton from "./BargainShareButton";
import HistorySuccessRecord from "./HistorySuccessRecord";
import BargainBoostList from "./BargainBoostList";
import RuleInstructionLayer from "./RuleInstructionLayer";
import BargainBoostButton from "./BargainBoostButton";
import PrizeReceiveLayer from "./PrizeReceiveLayer";
import {initJsSdk} from "../../common/actions/jssdkAction";
import ShareGuide from "../../common/components/ShareGuide";
import {setShowShareGuide} from "../../common/actions/commonAction";
import {saveMutualBargainShareRecord} from "../actions/bargainActivityAction";

class Bargain extends Component {

    componentWillMount(){
        let mutualBargainShareRecordId = this.props.match.params.mutualBargainShareRecordId;
        this.props.actions.getBargainActivityInfo({mutualBargainShareRecordId: mutualBargainShareRecordId}, () => {this.shareActivity()  });

    }
    componentWillUnmount() {
        this.setPrizeReceiveLayer(false);
        this.setRuleInstructionLayer(false);
    }
    toBargainReceiveAddress = (data) => {
        const {bargainActivityInfo} = this.props.bargainState;
        if(!bargainActivityInfo||bargainActivityInfo.isLogin==="N"){
            this.props.history.push('/member/memberLoginIn');
        }

        this.props.history.push('/bargain/againBargainReceive/'+bargainActivityInfo.mutualBargainActivityId+"/"+bargainActivityInfo.mutualBargainShareRecordId);
    };

    setPrizeReceiveLayer = (data) => {
        this.props.actions.commonSetBargainState(types.BARGAIN_SET_SHOW_PRIZE_RECEIVE_LAYER,  data);
    };
    setRuleInstructionLayer = (data) => {
        this.props.actions.commonSetBargainState(types.BARGAIN_SET_SHOW_RULE_INSTRUCTION_LAYER,  data);
    };

    toMemberLoginIn() {
        this.props.history.push('/member/memberLoginIn');
    }

    toMutualBargainActivity(mutualBargainShareRecordId) {
        this.props.history.push("/bargain/mutualBargain/"+mutualBargainShareRecordId);
        this.props.actions.getBargainActivityInfo({mutualBargainShareRecordId: mutualBargainShareRecordId}, () => {this.shareActivity()  });
    }
    saveMutualBargainShareRecord(data) {
        const {mutualBargainActivityId,productId} = data;
        const self = this;
        this.props.actions.saveMutualBargainShareRecord(mutualBargainActivityId,productId ,(mutualBargainShareRecordId)=>{self.toMutualBargainActivity(mutualBargainShareRecordId)},()=>{self.toMemberLoginIn()});
    };

    toProductDetail(productId) {
      this.props.history.push("/product/detail/"+ productId)
    };
    updateMutualBargainBoostState = () => {
        const {bargainActivityInfo} = this.props.bargainState;
        this.props.actions.updateMutualBargainBoostState({isAllow:this.isAllow,mutualBargainShareRecordId: bargainActivityInfo.mutualBargainShareRecordId},  ()=>{ this.props.actions.getBargainActivityInfo({mutualBargainShareRecordId:bargainActivityInfo.mutualBargainShareRecordId})});
    };
    updateShowShareGuide = (data) => {
        this.props.actions.setShowShareGuide(data);
    };
    render() {
        const {bargainActivityInfo,isShowPrizeReceiveLayer,firstBargainAmount,isShowRuleInstructionLayer} = this.props.bargainState;
        const {
            loginMemberId,
            memberName,
            productNm,
            productPriceDouble,
            activityPriceDouble,
            receiveNum,
            memberHeadIcon,
            productMainPic ,
            activityProductStock,
            boostPrizeNm,
            ruleDescription,
            boostPrizePic,
            sharerMemberId,
            productId
        } = bargainActivityInfo||{};
        return (
            <div className=" mutual_bargain share-bargain-main">
                <div className="banner" >
                    <img src={banne_bg} alt={"砍价背景"}/>
                        <div className="rule_of_activity" onClick={()=>{this.setRuleInstructionLayer(true)}}>活动规则</div>
                </div>
                <div className="information">
                    <div className="item">
                        {bargainActivityInfo&& sharerMemberId!==loginMemberId&&<SharerMemberInfo memberHeadIcon={memberHeadIcon} memberName={memberName}  activityPriceDouble={activityPriceDouble}/>}
                        <ProductBargainInfo callBack={()=>{this.toProductDetail(productId)}} productMainPic={productMainPic} productNm={productNm} productPriceDouble={productPriceDouble} activityPriceDouble={activityPriceDouble} receiveNum={receiveNum} activityProductStock={activityProductStock}/>
                        {bargainActivityInfo && loginMemberId === sharerMemberId && <BargainShareButton history={this.props.history} bargainActivityInfo={bargainActivityInfo} updateShowShareGuide={this.updateShowShareGuide}/>}
                        {bargainActivityInfo && loginMemberId !== sharerMemberId && <BargainBoostButton saveMutualBargainShareRecord={(data)=>{this.saveMutualBargainShareRecord(data)}} setPrizeReceiveLayer={this.setPrizeReceiveLayer} toBargainReceiveAddress={this.toBargainReceiveAddress} updateMutualBargainBoostState={this.updateMutualBargainBoostState} bargainActivityInfo={bargainActivityInfo} />}
                        {bargainActivityInfo && <BargainBoostList bargainActivityInfo={bargainActivityInfo}/>}
                        {bargainActivityInfo && <RuleInstructionLayer  isShowRuleInstructionLayer={isShowRuleInstructionLayer} ruleDescription={ruleDescription} callBackFunc={this.setRuleInstructionLayer}/>}
                        {bargainActivityInfo && <PrizeReceiveLayer boostPrizeNm={boostPrizeNm} firstBargainAmount={firstBargainAmount} isShowPrizeReceiveLayer={isShowPrizeReceiveLayer} boostPrizePic={boostPrizePic}  closeLayer={this.setPrizeReceiveLayer} toBargainReceiveAddress={this.toBargainReceiveAddress}/>}
                    </div>
                    {bargainActivityInfo &&<HistorySuccessRecord bargainActivityInfo={bargainActivityInfo}/>}
                    <ShareGuide />
                </div>
            </div>
        )
    }


    shareActivity() {
        const {bargainActivityInfo} = this.props.bargainState;
        const mutualBargainShareRecordId = bargainActivityInfo.mutualBargainShareRecordId;
        const productMainPic = bargainActivityInfo.productMainPic;

        let dataMap = {
            onMenuShareAppMessage: true,
            onMenuShareTimeline: true,
            title: "金康砍价活动邀请",
            desc: "金刀银刀,不如你替我砍一刀,快来!",
            link: window.location.href.split('#')[0] + "/wap/redirect/bargain/mutualBargain/"+mutualBargainShareRecordId ,
            imgUrl: productMainPic,
        };

        initJsSdk(() => {
            console.log("初始化成功")
        }, () => {
            console.log("初始化失败")
        }, dataMap);



    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        bargainState: store.bargainState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getBargainActivityInfo,
            updateMutualBargainBoostState,
            commonSetBargainState,
            saveMutualBargainShareRecord,
            setShowShareGuide
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Bargain);
