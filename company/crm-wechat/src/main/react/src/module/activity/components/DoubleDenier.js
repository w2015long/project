import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import cs_01 from "../../../media/images/double-denie_01.jpg";
import cs_02 from "../../../media/images/double-denie_02.jpg";
import cs_03 from "../../../media/images/double-denie_03.jpg";
import cs_04 from "../../../media/images/double-denie_04.jpg";
import cs_05 from "../../../media/images/double-denie_05.jpg";
import cs_06 from "../../../media/images/double-denie_06.jpg";
import cs_07 from "../../../media/images/double-denie_07.jpg";
import cs_08 from "../../../media/images/double-denie_08.jpg";
import cs_09 from "../../../media/images/double-denie_09.jpg";
import cs_10 from "../../../media/images/double-denie_10.jpg";
import cs_11 from "../../../media/images/double-denie_11.jpg";
import cs_12 from "../../../media/images/double-denie_12.jpg";
import {getLoginInfo,} from "../../index/actions/indexActions";
import Footer from "../../common/components/Footer";
import "../style/DoubleDenier.css";


class DoubleDenier extends Component {

    componentWillMount() {
        document.title = "双旦专题";
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
            <div className="double_denier">
                <div className="inner">
                    <div className="get-coupon">
                        <img src={cs_01}/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.props.history.push('/index/receive/coupon/supportReceive')
                        }} title="领取优惠券"/>
                    </div>
                    <div className="subject-item sub-m1">
                        <img src={cs_02} className="img_class"/>
                        <img src={cs_03} className="img_class"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(49014)
                        }} className="gd-link1" title="东阿镇福牌阿胶250g"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(49681)
                        }} className="gd-link2" title="马来西亚白燕盏"/>
                        <a href="javaScript:void(0);" onClick={() => {
                            this.goToProductDetail(12145)
                        }} className="gd-link3" title="鱼跃 超声雾化器402AI"/>
                    </div>
                </div>
                <div className="subject-item sub-m2">
                    <img src={cs_04}/>
                    <img src={cs_05}/>
                    <img src={cs_06}/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(16596)
                    }} className="gd-link1" title="感康 复方氨酚烷胺片12片"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(21267)
                    }} className="gd-link2" title="白云山小柴胡颗粒10袋"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(18978)
                    }} className="gd-link3" title="采乐 酮康唑洗剂2%*50ml"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(49262)
                    }} className="gd-link4" title="思密达 蒙脱石散(桔子味)15袋"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(10493)
                    }} className="gd-link5" title="金宝宝退热贴3贴"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(16193)
                    }} className="gd-link6" title="双鲸 维生素AD滴剂30粒"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(18616)
                    }} className="gd-link7" title="同仁堂 六味地黄丸浓缩丸120丸"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(17386)
                    }} className="gd-link8" title="恩威 洁尔阴洗液300ml"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(208)
                    }} className="gd-link9" title="汤臣倍健维生素C片100片"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(3133)
                    }} className="gd-link10" title="汤臣倍健 蛋白粉450g"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(11474)
                    }} className="gd-link11" title="杜蕾斯大胆爱吧10只装"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(18865)
                    }} className="gd-link12" title="优思明 屈螺酮炔雌醇片21片"/>
                </div>
                <div className="subject-item sub-m3">
                    <img src={cs_07}/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(17688)
                    }} className="gd-link1" title="鸿茅药酒500ml"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(90)
                    }} className="gd-link2" title="济福生牌丹参茶90袋"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(49267)
                    }} className="gd-link3" title="太阳神猴头菇口服液24支"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(49289)
                    }} className="gd-link4" title="金水宝胶囊72粒"/>
                </div>
                <div className="subject-item sub-m4">
                    <img src={cs_08}/>
                    <img src={cs_09}/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(17689)
                    }} className="gd-link1" title="鸿茅药酒500ml*4瓶"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(18944)
                    }} className="gd-link2" title="东阿阿胶500g"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(18936)
                    }} className="gd-link3" title="陈李济 舒筋健腰丸10瓶装"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(18782)
                    }} className="gd-link4" title="汇仁 肾宝片126片"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(18308)
                    }} className="gd-link5" title="天草 丹参保心茶120袋"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(16600)
                    }} className="gd-link6" title="复方阿胶浆(无蔗糖)48支"/>
                </div>
                <div className="subject-item sub-m5">
                    <img src={cs_10}/>
                    <img src={cs_11}/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(8497)
                    }} className="gd-link1" title="冬虫夏草 (约3根/克)"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(6639)
                    }} className="gd-link2" title="三七粉75g"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(49795)
                    }} className="gd-link3" title="盛吉信高丽参(良)40支*37.5g"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(49714)
                    }} className="gd-link4" title="花胶干货"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(6652)
                    }} className="gd-link5" title="乐陶陶西洋参片1.5g*12袋"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(6284)
                    }} className="gd-link6" title="道地药业 当归粉3g*26袋"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(6946)
                    }} className="gd-link7" title="草晶华 黄芪破壁草本2g*20袋"/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.goToProductDetail(6177)
                    }} className="gd-link8" title="草晶华 石斛破壁草本1g*20袋"/>
                </div>
                <div className="subject-item sub-m6">
                    <img src={cs_12}/>
                    <a href="javaScript:void(0);" onClick={() => {
                        this.props.history.push("/");
                    }} className="go-back" title="返回店铺"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoubleDenier);


