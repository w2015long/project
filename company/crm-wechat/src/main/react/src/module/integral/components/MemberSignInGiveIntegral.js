/**
 * Created by admin on 2018/4/2.
 * 会员签到送积分
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../../common/style/swiper.min.css";
import "../style/MemberSignInGiveIntegral.css";
import zhuanpan from "../../../media/images/zhuanpan.png";
import lihe from "../../../media/images/lihe.png";
import jifen3 from "../../../media/images/jifen3.png";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import {Link} from "react-router-dom";
import headPortrait from "../../../media/images/default_head.png";
import {
    getMemberSignInIntegralInfo,
    isShowSignInSuccessView,
    pageIntegralRecommendProduct,
    signIn
} from "../actions/memberSignInGiveIntegralActions";

class MemberSignInGiveIntegral extends Component {

    componentWillMount() {
        document.title = '领积分';
        this.props.actions.getMemberSignInIntegralInfo(()=>{this.initSwiper()});
        this.props.actions.pageIntegralRecommendProduct({page: 0, size: 4, content: [], recordsFiltered: 0});
    }

    initSwiper() {
        new window.Swiper('.swiper-container',{
            freeMode : true,
            slidesPerView: 7
        });
    }

    signIn() {
        const self = this;
        self.props.actions.signIn(() => {
            self.refs.giveIntegral.innerHTML = "+" + self.props.integralSignInState.signInInfo.giveIntegral + "积分";
            self.props.actions.isShowSignInSuccessView(true);
            self.props.actions.getMemberSignInIntegralInfo(()=>{});
        });
    }

    loadMore = () => {
        const {pageIntegralProduct} = this.props.integralSignInState;
        pageIntegralProduct.page += 1;
        this.props.actions.pageIntegralRecommendProduct(pageIntegralProduct);
    }

    render() {
        const {signInInfo, isShowSignInSuccessView, pageIntegralProduct} = this.props.integralSignInState;
        const content = pageIntegralProduct.content;
        const isHaveNextPage = pageIntegralProduct.size * (pageIntegralProduct.page + 1) < pageIntegralProduct.recordsFiltered;

        return (
            <div className="member-sign-in-give-integral">
                <div className="mt">
                    <div className="sign-info">
                        <div className="pic"><img src={signInInfo.iconFileId || headPortrait} alt=""/></div>
                        <i>我的积分</i>
                        <span>{signInInfo.integral}</span>
                        {signInInfo.isSignIn === 'Y' ? <span className="sign-btn active">明日{signInInfo.giveIntegral}积分</span> : <span className="sign-btn" onClick={() => this.signIn()}>签到+{signInInfo.giveIntegral}积分</span>}
                    </div>

                    <div className="continuous">
                        <div className="m-top"><span>您已连续签到<i>{signInInfo.continuousSignDays}</i>天</span></div>
                        <div className="m-cont swiper-container">
                            <ul className="swiper-wrapper clearfix">
                                {signInInfo.signInGiveIntegrals.map((integral, index) => {
                                    return (
                                        <li className={(index + 1) <= signInInfo.continuousSignDays ? "swiper-slide item act" : "swiper-slide item"} key={index}>
                                            <span>{index + 1}</span>
                                            <i>+{integral}</i>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="mp">
                        <div className="item">
                            <Link to="/integral/turntable">
                                <img src={zhuanpan} alt=""/>
                                <span>抽奖</span>
                            </Link>
                        </div>
                        <div className="item">
                            <Link to="/integral/product/list">
                                <img src={lihe} alt=""/>
                                <span>兑换礼品</span>
                            </Link>
                        </div>
                        <div className="item">
                            <Link to="/integral/exchange">
                                <img src={jifen3} alt=""/>
                                <span>积分换券</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mc" id="recommendIntegralProduct">
                    <h5>推·荐·礼·品</h5>
                    <ul className="mc-cont">
                        {
                            content.map(integralProduct => {
                                return (
                                    <li key={integralProduct.integralProductId}>
                                        <Link to={'/integral/product/detail/'+integralProduct.integralProductId}>
                                            <div className="pic"><img src={integralProduct.picUrl} alt=""/></div>
                                            <div className="title">{integralProduct.integralProductNm}</div>
                                            <span>{integralProduct.integralPrice}积分</span>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    {content.length > 0 && <AutoLoadMore isHaveNextPage={isHaveNextPage} loadMoreFunc={this.loadMore}
                                                         container="recommendIntegralProduct"/>}
                </div>

                <div className="success-layer" style={{display: isShowSignInSuccessView ? "block" : "none"}}
                     onClick={() => this.props.actions.isShowSignInSuccessView(false)}>
                    <div className="success-box"><span ref={'giveIntegral'}>+{signInInfo.giveIntegral}积分</span></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        integralSignInState: store.integralSignInState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getMemberSignInIntegralInfo,
            signIn,
            isShowSignInSuccessView,
            pageIntegralRecommendProduct
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberSignInGiveIntegral);