import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import PicTop from "../../../media/images/pic-top.png";
import Coupon20 from "../../../media/images/coupon-20.png";
import Coupon40 from "../../../media/images/coupon-40.png";
import Coupon100 from "../../../media/images/coupon-100.png";
import LimitTitle from "../../../media/images/title-limit.png";
import DiscountTitle from "../../../media/images/title-discounts.png";
import BtnMore from "../../../media/images/btn-more.png";
import "../style/DoubleEleven.css";
import {countDown, getDoubleElevenInitData} from "../actions/doubleElevenAction";
import Footer from "../../common/components/Footer";

class DoubleEleven extends Component{

    state = {
        timer: null
    };

    componentWillMount() {
        document.title = "双十一购物狂欢节";
        const pageContext = this;
        this.props.actions.getDoubleElevenInitData(function () {
            pageContext.state.timer = setInterval(function () {
                const {doubleElevenState, actions} = pageContext.props;
                const {timer} = doubleElevenState;
                if(timer.hours > 0 || timer.minutes > 0 || timer.seconds > 0){
                    actions.countDown(timer);
                }
            }, 1000);
        });
    }

    componentDidMount() {

    }

    componentDidUpdate (){

    }

    componentWillUnmount(){
        if(this.state.timer){
            clearInterval(this.state.timer);
        }
    }

    gotoCouponList(){
        this.props.history.push('/index/receive/coupon/supportReceive');
    }

    gotoProductDetail(productId, shopId){
        this.props.history.push('/product/detail/' + productId + '/O2O/' + shopId);
    }

    gotoProductList(){
        this.props.history.push('/product/list/shop');
    }

    render(){
        const {timer, discountProductList, secondKillProductList} = this.props.doubleElevenState;

        return(
            <div className="double-eleven">
                <div className="act-topic">
                    <div className="top-pic">
                        <img src={PicTop} />
                    </div>
                    <div className="coupon-box">
                        <span className="sm-icon01" />
                        <div className="cont">
                            <div className="item">
                                <img src={Coupon100} />
                                <a className="get-btn" onClick={() => this.gotoCouponList()}/>
                            </div>
                            <div className="item">
                                <img src={Coupon40} />
                                <a className="get-btn selected" onClick={() => this.gotoCouponList()} />
                            </div>
                            <div className="item">
                                <img src={Coupon20} />
                                <a className="get-btn" onClick={() => this.gotoCouponList()} />
                            </div>
                        </div>
                    </div>
                    <div className="limit-box">
                        <div className="mt">
                            <img src={DiscountTitle} />
                        </div>
                        {
                            (timer.hours > 0 || timer.minutes > 0 || timer.seconds > 0) &&
                            <div className="countdown">
                                <span>还剩</span>
                                <em>{timer.hours}</em><i>:</i>
                                <em>{timer.minutes}</em><i>:</i>
                                <em>{timer.seconds}</em>
                                <span>结束</span>
                            </div>
                        }
                        <div className="mc">
                            {
                                discountProductList.map(product => {
                                    return(
                                        <div className="mc-dl" key={product.productId} onClick={() => this.gotoProductDetail(product.productId, product.shopId)}>
                                            {
                                                product.productCode==='5344' &&
                                                <div className="headline bg-green">家庭常备 呵护健康</div>
                                            }
                                            {
                                                product.productCode==='29743' &&
                                                <div className="headline bg-bule">每日1片 增强抵抗力</div>
                                            }
                                            <div className="item">
                                                <div className="pic">
                                                    <a>
                                                        <img src={product.pictureUrl} />
                                                    </a>
                                                </div>
                                                <div className="info-box">
                                                    <div className="title">
                                                        <a>{product.productNm}</a>
                                                    </div>
                                                    <div className="price">
                                                        <div className="fl"><span>￥</span>{product.memberPriceDouble}</div>
                                                        <div className="label">秒杀价</div>
                                                    </div>
                                                </div>
                                                <a className="btn-buy" />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="discounts-box">
                        <div className="mt">
                            <img src={LimitTitle} />
                        </div>
                        <div className="more" onClick={() => this.gotoProductList()}><a>更多商品 ></a></div>
                        <div className="mc">
                            {
                                secondKillProductList.map(product => {
                                    return(
                                        <div className="item" key={product.productId} onClick={() => this.gotoProductDetail(product.productId, product.shopId)}>
                                            <div className="pic">
                                                <a>
                                                    <img src={product.pictureUrl} />
                                                </a>
                                            </div>
                                            <div className="title">
                                                <a>{product.productNm}</a>
                                            </div>
                                            <div className="price">
                                                <span>￥</span>{product.memberPriceDouble}
                                                <del>￥{product.priceDouble}</del>
                                            </div>
                                            <a className="btn-buy" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="more-box" onClick={() => this.gotoProductList()}>
                        <span>没有找到您想要的？</span>
                        <a className="btn-more"><img src={BtnMore} /></a>
                    </div>
                </div>
                <Footer state={"mall"} history={this.props.history}/>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        doubleElevenState: store.doubleElevenState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getDoubleElevenInitData,
            countDown
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DoubleEleven);
