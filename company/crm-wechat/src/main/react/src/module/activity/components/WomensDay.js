import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import pic_01 from "../../../media/images/wom-pic_01.jpg";
import pic_02 from "../../../media/images/wom-pic_02.jpg";
import pic_03 from "../../../media/images/wom-pic_03.jpg";
import pic_04 from "../../../media/images/wom-pic_04.jpg";
import pic_05 from "../../../media/images/wom-pic_05.jpg";
import pic_06 from "../../../media/images/wom-pic_06.jpg";
import pic_07 from "../../../media/images/wom-pic_07.jpg";
import pic_08 from "../../../media/images/wom-pic_08.jpg";
import pic_09 from "../../../media/images/wom-pic_09.jpg";
import pic_10 from "../../../media/images/wom-pic_10.jpg";
import pic_11 from "../../../media/images/wom-pic_11.jpg";
import pic_12 from "../../../media/images/wom-pic_12.jpg";
import pic_13 from "../../../media/images/wom-pic_13.jpg";

import {getLoginInfo,} from "../../index/actions/indexActions";
import Footer from "../../common/components/Footer";
import "../style/WomensDay.css";


class WomensDay extends Component {

    componentWillMount() {
        document.title = "妇女节专题";
        // 初始化页面数据
        this.props.actions.getLoginInfo();
    }

    goToProductDetail(productId) {
        const {loginInfo} = this.props.indexState;
        if (loginInfo && loginInfo.shopId) {
            this.props.history.push('/product/detail/' + productId + "/O2O/" + loginInfo.shopId);
        } else {
            this.props.history.push('/product/detail/' + productId);
        }
    }

    render() {
        return (
            <div className="womens-day">
                <div className="inner">
                    <div className="sp-top">
                        <img src={pic_01}/>
                    </div>
                    <div className="get-coupon">
                        <img src={pic_02}/>
                        <img src={pic_03} alt="优惠券"/>
                        <a href="javascript:void(0);" title="领取5元优惠券" className="get-5" onClick={() => {
                            this.props.history.push('/index/receive/coupon/supportReceive')
                        }}/>
                        <a href="javascript:void(0);" title="领取10元优惠券" className="get-10" onClick={() => {
                            this.props.history.push('/index/receive/coupon/supportReceive')
                        }}/>
                        <a href="javascript:void(0);" title="领取30元优惠券" className="get-30" onClick={() => {
                            this.props.history.push('/index/receive/coupon/supportReceive')
                        }}/>
                    </div>
                    <div className="subject-item">
                        <img src={pic_04}/>
                        <a href="javascript:void(0);" title="护舒宝瞬洁贴身日用(5+1)片" onClick={() => {
                            this.goToProductDetail(5050)
                        }}>
                            <img src={pic_05} alt="护舒宝瞬洁贴身日用(5+1)片"/>
                        </a>
                        <a href="javascript:void(0);" title="以岭玫瑰花60g" onClick={() => {
                            this.goToProductDetail(58206)
                        }}>
                            <img src={pic_06} alt="以岭玫瑰花60g"/>
                        </a>
                        <a href="javascript:void(0);" title="养生堂维生素E软胶囊200粒" onClick={() => {
                            this.goToProductDetail(3134)
                        }}>
                            <img src={pic_07} alt="养生堂维生素E软胶囊200粒"/>
                        </a>
                        <a href="javascript:void(0);" title="美澳健胶原蛋白维C片60片" onClick={() => {
                            this.goToProductDetail(2931)
                        }}>
                            <img src={pic_08} alt="美澳健胶原蛋白维C片60片"/>
                        </a>
                        <img src={pic_09}/>
                        <a href="javascript:void(0);" title="马来西亚溯源白燕盏100g/盒" onClick={() => {
                            this.goToProductDetail(49681)
                        }}>
                            <img src={pic_10} alt="马来西亚溯源白燕盏100g/盒"/>
                        </a>
                        <a href="javascript:void(0);" title="多美胶黑芝麻核桃阿胶糕300g" onClick={() => {
                            this.goToProductDetail(58185)
                        }}>
                            <img src={pic_11} alt="多美胶黑芝麻核桃阿胶糕300g"/>
                        </a>
                        <a href="javascript:void(0);" title="舒尔佳 奥利司他胶囊24粒" onClick={() => {
                            this.goToProductDetail(49331)
                        }}>
                            <img src={pic_12} alt="舒尔佳 奥利司他胶囊24粒"/>
                        </a>
                        <a href="javascript:void(0);" title="理肤泉舒缓调理喷雾300ml+150ml" onClick={() => {
                            this.goToProductDetail(14489)
                        }}>
                            <img src={pic_13} alt="理肤泉舒缓调理喷雾300ml+150ml"/>
                        </a>
                    </div>
                </div>
                <Footer history={this.props.history}/>
            </div>
        );
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        indexState: store.indexState,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getLoginInfo,
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WomensDay);


