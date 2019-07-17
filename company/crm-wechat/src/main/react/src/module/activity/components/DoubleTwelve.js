import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import double640x354 from "../../../media/images/double640x354.jpg";
import double640x328 from "../../../media/images/double640x328.jpg";
import double640x178 from "../../../media/images/double640x178.jpg";
import double640x538 from "../../../media/images/double640x538.jpg";
import double640x459 from "../../../media/images/double640x459.jpg";
import double640x429 from "../../../media/images/double640x429.jpg";
import double640x333 from "../../../media/images/double640x333.jpg";
import double640x410 from "../../../media/images/double640x410.jpg";
import double640x413 from "../../../media/images/double640x413.jpg";
import double640x418 from "../../../media/images/double640x418.jpg";
import double640x415 from "../../../media/images/double640x415.jpg";
import double640x414 from "../../../media/images/double640x414.jpg";
import double640x404 from "../../../media/images/double640x404.jpg";

import "../style/DoubleTwelve.css";
import {getDoubleTwelveInitData} from "../actions/doubleTwelveAction";
import Footer from "../../common/components/Footer";

class DoubleTwelve extends Component {

    componentWillMount() {
        document.title = "双十二购物狂欢节";
        // 初始化页面数据
        this.props.actions.getDoubleTwelveInitData();
    }

    validateProduct(productId) {
        let shopId = null;
        const {secondKillProductCodeList, redemptionProductCodeList, discountProductList} = this.props.doubleTwelveState;
        for (let secondKillProductCodeListElement of secondKillProductCodeList) {
            if (secondKillProductCodeListElement.productId === productId) {
                shopId = secondKillProductCodeListElement.shopId;
                break;
            }
        }

        if (shopId == null) {
            for (let redemptionProductCodeListElement of redemptionProductCodeList) {
                if (redemptionProductCodeListElement.productId === productId) {
                    shopId = redemptionProductCodeListElement.shopId;
                    break;
                }
            }
        }
        if (shopId == null) {
            for (let discountProductListElement of discountProductList) {
                if (discountProductListElement.productId === productId) {
                    shopId = discountProductListElement.shopId;
                    break;
                }
            }
        }
        if (shopId != null) {
            this.gotoProductDetail(productId, shopId);
        }
    }

    gotoProductDetail(productId, shopId) {
        this.props.history.push('/product/detail/' + productId + '/O2O/' + shopId);
    }

    gotoCouponList() {
        this.props.history.push('/index/receive/coupon/supportReceive');
    }

    gotoProductList() {
        this.props.history.push('/product/list/shop');
    }

    render() {
        return (
            <div className="double-twelve">
                <div className="item"><img src={double640x354}/></div>
                <div className="item"><Link to={'/member/promote/-1'}><img src={double640x328}/></Link></div>
                <div className="item" onClick={() => {
                    this.gotoCouponList()
                }}>
                    <a href="javascript:void(0)" className="get-btn1"/>
                    <a href="javascript:void(0)" className="get-btn2"/>
                    <a href="javascript:void(0)" className="get-btn3"/>
                    <img src={double640x178}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(571)
                    }} className="link-btn btn-model1"/>
                    <img src={double640x538}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(17688)
                    }} className="link-btn btn-model3"/>
                    <img src={double640x459}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(17833)
                    }} className="link-btn btn-model4"/>
                    <a onClick={() => {
                        this.validateProduct(31195)
                    }} className="link-btn btn-model5"/>
                    <img src={double640x429}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(15779)
                    }} className="link-btn btn-model6"/>
                    <a onClick={() => {
                        this.validateProduct(17500)
                    }} className="link-btn btn-model7"/>
                    <img src={double640x333}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(10143)
                    }} className="link-btn btn-model8"/>
                    <a onClick={() => {
                        this.validateProduct(49545)
                    }} className="link-btn btn-model9"/>
                    <img src={double640x410}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(18941)
                    }} className="link-btn btn-model8"/>
                    <a onClick={() => {
                        this.validateProduct(18944)
                    }} className="link-btn btn-model9"/>
                    <img src={double640x413}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(17688)
                    }} className="link-btn btn-model8"/>
                    <a onClick={() => {
                        this.validateProduct(17689)
                    }} className="link-btn btn-model9"/>
                    <img src={double640x418}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(49794)
                    }} className="link-btn btn-model8"/>
                    <a onClick={() => {
                        this.validateProduct(4385)
                    }} className="link-btn btn-model9"/>
                    <img src={double640x415}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(10888)
                    }} className="link-btn btn-model8"/>
                    <a onClick={() => {
                        this.validateProduct(5283)
                    }} className="link-btn btn-model9"/>
                    <img src={double640x414}/>
                </div>
                <div className="item">
                    <a onClick={() => {
                        this.validateProduct(11383)
                    }} className="link-btn btn-model8"/>
                    <a onClick={() => {
                        this.validateProduct(20571)
                    }} className="link-btn btn-model9"/>
                    <img src={double640x404}/>
                </div>
                <Footer state={"mall"} history={this.props.history}/>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        doubleTwelveState: store.doubleTwelveState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getDoubleTwelveInitData
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DoubleTwelve);

