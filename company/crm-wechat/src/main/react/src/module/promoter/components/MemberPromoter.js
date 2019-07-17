/**
 * Created by admin on 2018-11-30
 * 会员推广奖励
 */
import React, {Component} from "react";
import "../style/memberPromoter.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import shareADOldMember from "../../../media/images/shareADOldMember.jpg";
import shareADNewMember from "../../../media/images/shareADNewMember.jpg";
import anniu from "../../../media/images/anniu.png";
import jiantou from "../../../media/images/jiantou.png";
import profilePhoto from "../../../media/images/profile-photo.jpg";
import newExclusive from "../../../media/images/newExclusive.png";

import {
    getList,
    getLoginMemberId,
    getPublicNumberPicture,
    setMemberPromoteSetSharerId,
    setPromoterState
} from "../actions/memberPromoterAction";
import {Link} from 'react-router-dom';
import {initJsSdk} from "../../common/actions/jssdkAction";
import {getNewMemberExclusiveInitData} from "../../activity/actions/newMemberExclusiveAction";
import {qrcanvas} from 'qrcanvas'; //二维码生成
class MemberPromoter extends Component {

    state = {
        weChatParamQRCodeProtocol:null,//会员卡URL；
        qrCodeImg: null, //会员卡二维码
    };

    componentWillMount() {
        document.title = '会员推广奖励';
        const self = this;
        //拿不到列表,fail ,走获取推广二维码,拿到列表信息,success,获取登录会员
        this.props.actions.getList(
            ()=>{this.props.actions.getPublicNumberPicture((json)=>{self.initMemberShareParam(json)},this.props.match.params.sharerId||"")},
            ()=>{this.props.actions.getLoginMemberId((json)=>{self.initMemberShareParam(json)})}
        );
        const isLogin = this.props.memberPromoteState.isLogin;
        if (!isLogin) {
            this.props.actions.getNewMemberExclusiveInitData();
        }
        const memberPromoteState = this.props.memberPromoteState;
    }
    componentDidMount() {
        this.getWechatCardUrl()
    }
    getWechatCardUrl(){
        const context = this;
        const url = '/wap/member/getWechatCardUrl' ;
        window.textFetch(
            url,
            {},
            json => {
                context.setState({weChatParamQRCodeProtocol: json});
                this.initQrCode();
            }
        );
    }
    changeShowInviteLayer(state) {
        this.props.actions.setPromoterState(state);
    }

    initQrCode = () => {
        const qrcode = document.getElementById('qrcode');
        if (qrcode&&this.state.weChatParamQRCodeProtocol) {
            var canvas1 = qrcanvas({
                data: decodeURIComponent(this.state.weChatParamQRCodeProtocol), //分享链接（根据需求来）
                size: 117 //二维码大小
            });
            this.setState({qrCodeImg: canvas1})
            qrcode.innerHTML = '';
            qrcode.appendChild(canvas1);
        }
    };
    render() {
        const memberPromoteState = this.props.memberPromoteState;
        const promoterList = memberPromoteState.promoterList||[];
        const isShowInviteLayer = memberPromoteState.isShowInviteLayer;
        const isLogin = memberPromoteState.isLogin;
        const publicNumberPicture = memberPromoteState.publicNumberPicture;
        const notLogin = !isLogin;
        const {discountProductList} = this.props.newMemberExclusiveState;


        return (
            <div className="member_promote">
                <div className="share_main">
                    <div className="banner_pic">
                        {isLogin && <img src={shareADOldMember}/>}
                        {notLogin && <img src={shareADNewMember}/>}
                    </div>
                    <div className="main_box">
                        <div className="box_top">
                            {isLogin && <h5>分享就赠花旗参茶</h5>}
                            {isLogin && <p className="top_20">每成功邀请1位新用户</p>}
                            {isLogin && <p>您可得参茶1杯+3元红包优惠券</p>}
                            {notLogin && <h5>送你一杯花旗参茶品鉴</h5>}
                            {notLogin && <p className="top_20">长按二维码领取会员卡</p>}
                            {notLogin && <p>还有1000元优惠券赠送</p>}
                            {isLogin && <a onClick={() => {this.changeShowInviteLayer(true)}}>
                                <img src={anniu}/>
                                <span>立即邀请</span>
                            </a>}
                            {notLogin && <a id={"qrcode"}></a>}
                        </div>
                        {isLogin && <div className="box_boutotm">
                            <div className="hjxinx">
                                <div className="yihuojiang">已获奖</div>
                                <Link to={'/coupon/list'} className="wdyhj">我的优惠劵 <span className="arrows_right"></span>
                                </Link>
                            </div>

                            {promoterList.length === 0 && <div className="meiyouzhongjiang">还没有获得奖励，快赠送朋友花旗参保健品</div>}

                            <div className="box_list">
                                {promoterList.length > 0 &&
                                <div className="box_list_title">
                                    成功邀请<span>{promoterList.length}</span>名伙伴, 获得<span>{promoterList.length}</span>份礼物
                                </div>}

                                {promoterList.map((item, index) => {
                                    return (
                                        <div className="item" key={index}>
                                            <div className="items_l">
                                                <img src={item.wechatPic ? item.wechatPic : profilePhoto}/>
                                            </div>
                                            <div className="items_r">
                                                <h5>{item.name}</h5>
                                                <p>{item.createTimeString}</p>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>}
                        {notLogin && <div className="mc">
                            <div className="cont">
                                <div className="mc-hd"><span>赠送1000元优惠券</span></div>
                                <div className="coupon-box">
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>10</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满20可用</p>
                                            <p>全场可用</p>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>20</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满49可用</p>
                                            <p>全场可用</p>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>30</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满99可用</p>
                                            <p>全场可用</p>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>50</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满199可用</p>
                                            <p>全场可用</p>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>40</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满398可用</p>
                                            <p>指定商品可用</p>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>50</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满322可用</p>
                                            <p>指定商品可用</p>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>100</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满398可用</p>
                                            <p>指定商品可用</p>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>100</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满408可用</p>
                                            <p>指定商品可用</p>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>100</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满398可用</p>
                                            <p>指定商品可用</p>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="mlt">
                                            <i>￥</i>
                                            <span>500</span>
                                        </div>
                                        <div className="mrt">
                                            <p>满990可用</p>
                                            <p>指定商品可用</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mc-hd"><span>新人专享钜惠</span></div>
                                <div className="theme-box">
                                    {
                                        discountProductList.map((discountProduct, index) => {
                                            //价格格式化输出
                                            let firstSellPrice, secondSellPrice;
                                            let sellPriceDouble = discountProduct.couponAfterPrice || discountProduct.couponAfterPrice;
                                            if (sellPriceDouble) {
                                                const sellPriceDoubles = sellPriceDouble.toFixed(1).split(".");
                                                firstSellPrice = sellPriceDoubles[0];
                                                secondSellPrice = sellPriceDoubles[1];
                                            } else {
                                                firstSellPrice = 0;
                                                secondSellPrice = 0;
                                            }
                                            return <div className="item" key={index}>
                                                <div className="pic"><a href="javascript:void(0)"><img src={discountProduct.pictureUrl}/></a></div>
                                                <div className="title"><a
                                                    href="javascript:void(0)">{discountProduct.productNm}</a></div>
                                                <div className="price">
                                                    <i>¥</i>
                                                    <span>{firstSellPrice}</span>
                                                    <i>.{secondSellPrice}</i>
                                                    <img className="new-exclusive" src={newExclusive}/>
                                                </div>
                                                <div
                                                    className="original-price">原价￥{discountProduct.couponBeforePrice}</div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>}
                    </div>


                </div>
                {isShowInviteLayer &&
                <div className="pop_ups" onClick={() => {
                    this.changeShowInviteLayer(false)
                }}>
                    <div className="fengxiang_pic">
                        <img src={jiantou}/>
                    </div>
                    <div className="fengxiang_text">
                        <h5 style={{"color": "#fff"}}>点击&nbsp;&nbsp;<i></i> <i></i> <i></i><span>分享</span></h5>
                        <p>微信/朋友圈</p>
                    </div>
                </div>}

            </div>
        )
    }


    initMemberShareParam(loginMemberId) {
        let dataMap = {
            onMenuShareAppMessage: true,
            onMenuShareTimeline: true,
            title: "请你喝杯免费花旗参茶，祝你精神饱满一整天！",
            desc: "金康药房云店请你喝杯免费提神饮品，一天元气满满",
            link: window.location.href.split('#')[0] + "/wap/redirect/wxGoToPromoterReward/" + (loginMemberId ? loginMemberId : this.props.match.params.sharerId),
            imgUrl: "https://mmbiz.qpic.cn/mmbiz_png/Ed3hz2wicUPeWZRapYZtQns4d7LztZlHqwhibWJTMAv7uJ7WVgftzP5sElh5wKsNjlOib4BZNojr8k9iaYedbG1Vicw/0?wx_fmt=png",
        };


        initJsSdk(() => {
            console.log("初始化推广成功")
        }, () => {
            console.log("初始化推广失败")
        }, dataMap);
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        memberPromoteState: store.memberPromoteState,
        newMemberExclusiveState: store.newMemberExclusiveState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getPublicNumberPicture,
            getList,

            setPromoterState,
            setMemberPromoteSetSharerId,
            getLoginMemberId,
            // activateMemberCard,
            //
            // getMemberRegisterInfo
            getNewMemberExclusiveInitData,
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberPromoter);
