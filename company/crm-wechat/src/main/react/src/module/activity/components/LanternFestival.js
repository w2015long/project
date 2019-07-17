/**
 * @author kwy
 * @date 2019/2/13
 *
 */

import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import pic_01 from "../../../media/images/lantern_festival_01.jpg";
import pic_02 from "../../../media/images/lantern_festival_02.jpg";
import pic_03 from "../../../media/images/lantern_festival_03.jpg";
import pic_04 from "../../../media/images/lantern_festival_04.jpg";
import pic_05 from "../../../media/images/lantern_festival_05.jpg";
import pic_06 from "../../../media/images/lantern_festival_06.jpg";
import pic_07 from "../../../media/images/lantern_festival_07.jpg";
import pic_08 from "../../../media/images/lantern_festival_08.jpg";
import pic_09 from "../../../media/images/lantern_festival_09.jpg";
import pic_10 from "../../../media/images/lantern_festival_10.jpg";
import pic_11 from "../../../media/images/lantern_festival_11.jpg";
import pic_12 from "../../../media/images/lantern_festival_12.jpg";
import pic_13 from "../../../media/images/lantern_festival_13.jpg";
import {getLoginInfo} from "../../index/actions/indexActions";
import Footer from "../../common/components/Footer";
import "../style/LanternFestival.css";

// 第二种，基本写法-带状态组件
class LanternFestival extends Component {


    componentWillMount() {
        document.title = "元宵专题";
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
            <div className={'LanternFestival'}>
                <div className="inner">
                    <div className="sp-top">
                        <img src={pic_01}/>
                    </div>
                    <div className="get-coupon">
                        <img src={pic_02} alt="优惠券"/>
                        <img src={pic_03} alt="优惠券"/>
                        <a href="javascript:void(0);" title="领取优惠券5元" className="get-5" onClick={() => {
                            this.props.history.push('/index/receive/coupon/supportReceive')
                        }}/>
                        <a href="javascript:void(0);" title="领取优惠券10元" className="get-10" onClick={() => {
                            this.props.history.push('/index/receive/coupon/supportReceive')
                        }}/>
                        <a href="javascript:void(0);" title="领取优惠券20元" className="get-20" onClick={() => {
                            this.props.history.push('/index/receive/coupon/supportReceive')
                        }}/>
                        <a href="javascript:void(0);" title="领取优惠券520元" className="get-520" onClick={() => {
                            this.goToProductDetail(11134)
                        }}/>
                    </div>
                    <div className="subject-item">
                        <img src={pic_04}/>
                        <a href="javascript:void(0);" title="马来西亚溯源白燕条" onClick={() => {
                            this.goToProductDetail(49682)
                        }}>
                            <img src={pic_05} alt="马来西亚溯源白燕条"/>
                        </a>
                        <a href="javascript:void(0);" title="复方阿胶浆48支无蔗糖" onClick={() => {
                            this.goToProductDetail(16600)
                        }}>
                            <img src={pic_06} alt="复方阿胶浆48支无蔗糖"/>
                        </a>
                        <a href="javascript:void(0);" title="黑芝麻核桃阿胶糕300g" onClick={() => {
                            this.goToProductDetail(58185)
                        }}>
                            <img src={pic_07} alt="黑芝麻核桃阿胶糕300g"/>
                        </a>
                        <img src={pic_08}/>
                        <a href="javascript:void(0);" title="草晶华 玫瑰花破壁草本20袋" onClick={() => {
                            this.goToProductDetail(6367)
                        }}>
                            <img src={pic_09} alt="草晶华 玫瑰花破壁草本20袋"/>
                        </a>
                        <a href="javascript:void(0);" title="乐陶陶西洋参刨片60g" onClick={() => {
                            this.goToProductDetail(6653)
                        }}>
                            <img src={pic_10} alt="乐陶陶西洋参刨片60g"/>
                        </a>
                        <a href="javascript:void(0);" title="养生堂维生素E软胶囊200粒" onClick={() => {
                            this.goToProductDetail(3134)
                        }}>
                            <img src={pic_11} alt="养生堂维生素E软胶囊200粒"/>
                        </a>
                        <a href="javascript:void(0);" title="欧莱健 维生素C咀嚼片100片" onClick={() => {
                            this.goToProductDetail(9)
                        }}>
                            <img src={pic_12} alt="欧莱健 维生素C咀嚼片100片"/>
                        </a>
                        <a href="javascript:void(0);" title="斯利安 叶酸片31片" onClick={() => {
                            this.goToProductDetail(15680)
                        }}>
                            <img src={pic_13} alt="斯利安 叶酸片31片"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LanternFestival);