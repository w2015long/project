import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import pic_01 from "../../../media/images/new-year_01.jpg";
import pic_02 from "../../../media/images/new-year_02.jpg";
import pic_03 from "../../../media/images/new-year_03.jpg";
import pic_04 from "../../../media/images/new-year_04.jpg";
import pic_05 from "../../../media/images/new-year_05.jpg";
import pic_06 from "../../../media/images/new-year_06.jpg";
import pic_07 from "../../../media/images/new-year_07.jpg";
import pic_08 from "../../../media/images/new-year_08.jpg";
import pic_09 from "../../../media/images/new-year_09.jpg";
import pic_10 from "../../../media/images/new-year_10.jpg";
import pic_11 from "../../../media/images/new-year_11.jpg";
import pic_12 from "../../../media/images/new-year_12.jpg";
import pic_13 from "../../../media/images/new-year_13.jpg";
import pic_14 from "../../../media/images/new-year_14.jpg";
import pic_15 from "../../../media/images/new-year_15.jpg";
import {getLoginInfo,} from "../../index/actions/indexActions";
import Footer from "../../common/components/Footer";
import "../style/NewYear.css";


class NewYear extends Component {

    componentWillMount() {
        document.title = "年货节专题";
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
            <div className="new-year-special">
                <div className="inner">
                    <div className="sp-top"><img src={pic_01}/></div>
                    <div className="get-coupon">
                        <img src={pic_02} alt="领取优惠券"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.props.history.push('/index/receive/coupon/supportReceive')
                        }} title="领取优惠券"/>
                    </div>
                    <div className="subject-item sub-m1">
                        <img src={pic_03}/>
                    </div>
                    <div className="subject-item sub-m2">
                        <img src={pic_04}/>
                        <img src={pic_05}/>
                        <img src={pic_06}/>
                        <img src={pic_07}/>
                        <img src={pic_08}/>
                        <img src={pic_09}/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(663)
                        }} className="gd-link1" title="鹰牌无糖花旗参茶3g*20袋"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(18944)
                        }} className="gd-link2" title="东阿阿胶块500g"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(4386)
                        }} className="gd-link3" title="康富来冰糖燕窝70ml*8瓶"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(49267)
                        }} className="gd-link4" title="太阳神猴头菇口服液10ml*24支"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(12145)
                        }} className="gd-link5" title="鱼跃 超声雾化器402AI"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(49014)
                        }} className="gd-link6" title="东阿镇福牌阿胶250g"/>
                    </div>
                    <div className="subject-item sub-m3">
                        <img src={pic_10}/>
                        <img src={pic_11}/>
                        <img src={pic_12}/>
                        <img src={pic_13}/>
                        <img src={pic_14}/>
                        <img src={pic_15}/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(16600)
                        }} className="gd-link1" title="东阿阿胶复方阿胶浆(无糖型)48支"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(17688)
                        }} className="gd-link2" title="鸿茅药酒500ml"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(264)
                        }} className="gd-link3" title="养生堂天然维生素C咀嚼片130片"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(142)
                        }} className="gd-link4" title="康富来血尔口服液76ml*10瓶"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(6156)
                        }} className="gd-link5" title="盛吉信红参30支75g"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(49681)
                        }} className="gd-link6" title="马来西亚燕窝白燕盏100g"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(57972)
                        }} className="gd-link7" title="虫草花200g"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(6620)
                        }} className="gd-link8" title="花菇干货200g"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(12190)
                        }} className="gd-link9" title="西门子耳背式无线助听器"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(10199)
                        }} className="gd-link10" title="优利特尿酮体试纸25条"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(12735)
                        }} className="gd-link11" title="美国进口雪花牛排500g"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(5170)
                        }} className="gd-link12" title="冷冻三文鱼排500g"/>
                    </div>
                </div>
                <Footer state={"mall"} history={this.props.history}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewYear);


