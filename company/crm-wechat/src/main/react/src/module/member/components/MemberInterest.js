/**
 * Created by admin on 2018/3/31.
 */
import React, {Component} from "react";
import "../style/MemberInterest.css";
import "../../common/style/swiper.min.css";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getMemberInterests, getMemberLevelList, isShowInterestDetail} from "../actions/memberAction";
import integral from "../../../media/images/huodejifen_s.png";
import apothecaryService from "../../../media/images/yaoshifuwu_s.png";
import freight from "../../../media/images/yunfeitequan.png";
import integralDouble from "../../../media/images/jifenjiabei.png";
import boilMedicine from "../../../media/images/jianyaotequan.png";
import coupon from "../../../media/images/fuliquan.png";
import memberDay from "../../../media/images/huiyuanri.png";

class MemberInterest extends Component {

    state = {
        index: 0,
        currentItem: -1
    };

    changeTab(index, levelId) {
        this.setState({index: index});
        this.props.actions.getMemberInterests(levelId);
    }

    changeCurrentItem(index) {
        this.setState({currentItem: index});
    }

    componentWillMount() {
        document.title = '会员权益';
        const props = this.props;
        props.actions.getMemberLevelList((data)=>{
            this.initSwiper();
            if (data.length > 0) {
                props.actions.getMemberInterests(data[0].levelId);

            }
        });
    }

    initSwiper() {
        new window.Swiper('.tab-tit', {
            freeMode: true,
            slidesPerView: 'auto'
        });
    }

    showInterestDetail(title, detail) {
        this.refs.title.innerHTML = title;
        this.refs.detail.innerHTML = detail;
        this.props.actions.isShowInterestDetail(true);
    }

    hideInterestDetail() {
        this.refs.title.innerHTML = "";
        this.refs.detail.innerHTML = "";
        this.props.actions.isShowInterestDetail(false);
    }

    render() {
        const {memberLevelList, isShowInterestDetail, memberInterests} = this.props.memberState;
        return (
            <div className="member-interest">
                <div className="member-interest-main">
                    <div className="tab-tit swiper-container">
                        <ul className="tab-nav swiper-wrapper clearfix">
                            {memberLevelList.map((level, index) => {
                                return (
                                    <li key={index}
                                        className={this.state.index === index ? " swiper-slide cur" : " swiper-slide"}
                                        onClick={() => this.changeTab(index, level.levelId)}>
                                        <a>{level.title}</a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="mc">
                        <div className="mc-box">
                            <div className={this.state.currentItem === -1 ? "item activated": "item"} onClick={()=> this.changeCurrentItem(-1)}>
                                <a
                                    onClick={() => this.showInterestDetail('获得积分', '购物、签到送积分')}>
                                    <div className="pic"><img src={integral} alt=""/></div>
                                    <span className="elli">获得积分</span>
                                    <p className="elli">购物、签到送积分</p>
                                </a>
                            </div>
                            <div className={this.state.currentItem === -2 ? "item activated": "item"} onClick={()=> this.changeCurrentItem(-2)}>
                                <a
                                    onClick={() => this.showInterestDetail('药事服务', '使用禁忌、用药提醒、康复回访')}>
                                    <div className="pic"><img src={apothecaryService} alt=""/></div>
                                    <span className="elli">药事服务</span>
                                    <p className="elli">使用禁忌、用药提醒、康复回访</p>
                                </a>
                            </div>

                            {memberInterests.map((interest, index) => {
                                return (
                                    <div className={this.state.currentItem === index ? "item activated": "item"} onClick={()=> this.changeCurrentItem(index)} key={index}>
                                        {
                                            interest.interestsType === 'INTEGRAL' &&
                                            <a onClick={() => this.showInterestDetail("积分加倍", "积分倍数：" + interest.integralTimes +"<br/>权益说明：" + interest.integralDescr )}>
                                                <div className="pic"><img src={integralDouble} alt=""/></div>
                                                < span className="elli">积分加倍</span>
                                                <p className="elli">{interest.integralDescr}</p>
                                            </a>
                                        }
                                        {
                                            interest.interestsType === 'FREIGHT' &&
                                            <a
                                                onClick={() => this.showInterestDetail("运费特权",
                                                    interest.integralDiscountType === 'DISCOUNT' ? "满" + interest.integralFullAmountDouble + "元减免" + interest.integralDiscountAmountDouble : "满" + interest.integralFullAmountDouble + "元免运费" )}>
                                                <div className="pic"><img src={freight} alt=""/></div>
                                                < span className="elli">运费特权</span>
                                                <p className="elli">
                                                    {
                                                        interest.integralDiscountType === 'DISCOUNT' ?
                                                            "满" + interest.integralFullAmountDouble + "元减免" + interest.integralDiscountAmountDouble :
                                                            "满" + interest.integralFullAmountDouble + "元免运费"
                                                    }
                                                </p>
                                            </a>
                                        }
                                        {
                                            interest.interestsType === 'BOIL_MEDICINE' &&
                                            <a
                                                onClick={() => this.showInterestDetail("煎药特权",
                                                    interest.boilMedicineDiscountType === 'DISCOUNT' ?
                                                        "满" + interest.boilMedicineFullAmountDouble + "元减免" + interest.boilMedicineDiscountAmountDouble :
                                                        "满" + interest.boilMedicineFullAmountDouble + "元免煎药费用")}>
                                                <div className="pic"><img src={boilMedicine} alt=""/></div>
                                                < span className="elli">煎药特权</span>
                                                <p className="elli">
                                                    {
                                                        interest.boilMedicineDiscountType === 'DISCOUNT' ?
                                                            "满" + interest.boilMedicineFullAmountDouble + "元减免" + interest.boilMedicineDiscountAmountDouble :
                                                            "满" + interest.boilMedicineFullAmountDouble + "元免煎药费用"
                                                    }
                                                </p>
                                            </a>
                                        }
                                        {
                                            interest.interestsType === 'COUPON' &&
                                            <a onClick={() => this.showInterestDetail("福利券", interest.couponDescr)}>
                                                <div className="pic"><img src={coupon} alt=""/></div>
                                                < span className="elli">福利券</span>
                                                <p className="elli">{interest.couponDescr}</p>
                                            </a>
                                        }
                                        {
                                            interest.interestsType === 'MEMBER_S_DAY' &&
                                            <a onClick={() => this.showInterestDetail("会员日特权", interest.memberSdayDescr)}>
                                                <div className="pic"><img src={memberDay} alt=""/></div>
                                                < span className="elli">会员日特权</span>
                                                <p className="elli">{interest.memberSdayDescr}</p>
                                            </a>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
                <div className="explain-layer" style={{display: isShowInterestDetail ? "block" : "none"}} onClick={()=> this.hideInterestDetail()}>
                    <div className="explain-box">
                        <div className="mc">
                            <p ref={'title'}>药事服务</p>
                            <span ref={'detail'}>使用禁忌、用药提醒、康复回访</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        memberState: store.memberState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({getMemberLevelList, getMemberInterests, isShowInterestDetail}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberInterest);