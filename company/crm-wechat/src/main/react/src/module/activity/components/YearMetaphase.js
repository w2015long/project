/**
 * @author  lzh
 * @date 2019/6/13
 * 金康年中广告
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "../style/yearMetaphase.css";
import {yearMetaphaseReceiveCoupons} from "../../coupon/actions/couponReceiveAction";
import {showConfirm} from "../../common/actions/commonAction";
import Confirm from '../../common/components/Confirm';

import img1 from "../../../media/images/yearMetaphase/618_01.jpg";
import img3 from "../../../media/images/yearMetaphase/618_03.jpg";
import img4 from "../../../media/images/yearMetaphase/618_04.jpg";
import img5 from "../../../media/images/yearMetaphase/618_05.jpg";
import img6 from "../../../media/images/yearMetaphase/618_06.jpg";
import img7 from "../../../media/images/yearMetaphase/618_07.jpg";
import img8 from "../../../media/images/yearMetaphase/618_08.jpg";
import img9 from "../../../media/images/yearMetaphase/618_09.jpg";
import img10 from "../../../media/images/yearMetaphase/618_10.jpg";
import img11 from "../../../media/images/yearMetaphase/618_11.jpg";
import img12 from "../../../media/images/yearMetaphase/618_12.jpg";
import img13 from "../../../media/images/yearMetaphase/618_13.jpg";
import img14 from "../../../media/images/yearMetaphase/618_14.jpg";
import img15 from "../../../media/images/yearMetaphase/618_15.jpg";
import img16 from "../../../media/images/yearMetaphase/618_16.jpg";
import img17 from "../../../media/images/yearMetaphase/618_17.jpg";
import img18 from "../../../media/images/yearMetaphase/618_18.jpg";
import img19 from "../../../media/images/yearMetaphase/618_19.jpg";
import img20 from "../../../media/images/yearMetaphase/618_20.jpg";
import img21 from "../../../media/images/yearMetaphase/618_21.jpg";
import img22 from "../../../media/images/yearMetaphase/618_22.jpg";
import img23 from "../../../media/images/yearMetaphase/618_23.jpg";
import img24 from "../../../media/images/yearMetaphase/618_24.jpg";
import img25 from "../../../media/images/yearMetaphase/618_25.jpg";
import img26 from "../../../media/images/yearMetaphase/618_26.jpg";
import img27 from "../../../media/images/yearMetaphase/618_27.jpg";
import img28 from "../../../media/images/yearMetaphase/618_28.jpg";
import img29 from "../../../media/images/yearMetaphase/618_29.jpg";
import img30 from "../../../media/images/yearMetaphase/618_30.jpg";
import img31 from "../../../media/images/yearMetaphase/618_31.jpg";






import Img from "../../common/components/Img";
import {Link} from "react-router-dom";

import AffixForList from "../../common/components/AffixForList";

class YearMetaphase extends Component {

    //组件作用域内的一个组件状态，react的核心
    state = {

    };

    //在组件首次渲染之前调用，这时候DOM还没有，而且整个生命周期中只会被执行一次，在这里面setState是无效的
    componentWillMount() {

    }

    //在组件首次渲染之后调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentDidMount(){


    }

    //销毁组件的时候调用
    componentWillUnmount(){

    }


    /**
     * 跳转商品详情页
     */
    goToProductDetail(productId,shopDetail) {
        const history = this.props.history;
        if (shopDetail.shopId) {
            history.push('/product/detail/' + productId + '/O2O/' + shopDetail.shopId);
        } else {
            history.push('/product/detail/' + productId)
        }
    }

    /**
     * 领取优惠券
     */
    receiveCoupon(coupon) {
        const self= this;
        const history = this.props.history;
        self.props.actions.yearMetaphaseReceiveCoupons(coupon,function () {
            self.props.actions.showConfirm('您还不是会员，请注册之后再领取!', () =>history.push('/member/memberLoginIn'))
        });

    }



    render() {
       // const actions = this.props.actions;

        const self= this;
        const indexState = self.props.indexState;
        const {shopDetail} = indexState;

        return (
            <div className="yearMetaphase">
                <div className="topic-main">
                    <div className="box-lg"><img src={img1} alt=""/></div>
                    <div className="box-lg coupon">
                        <img src={img3} alt=""/>
                        <a className="receive-m1" title="3元优惠券"    onClick={()=>self.receiveCoupon(277)}/>
                        <a className="receive-m2" title="15元优惠券"   onClick={()=>self.receiveCoupon(278)}/>
                        <a className="receive-m3" title="50元优惠券"   onClick={()=>self.receiveCoupon(279)}/>
                        <a className="receive-m4" title="100元优惠券"  onClick={()=>self.receiveCoupon(280)}/>
                        <a className="receive-m5" title="150元优惠券"  onClick={()=>self.receiveCoupon(281)}/>
                        <a  className="receive-m6" title="300元优惠券" onClick={()=>self.receiveCoupon(282)}/>
                    </div>
                    <div className="box-lg"><Link to={"/bargain/bargainActivity"}><img src={img4} alt=""/></Link></div>
                    <div className="clearfix">
                        <div className="box-lg clearfix"><img src={img5} alt=""/></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(5598,shopDetail)}}><img src={img6} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(10571,shopDetail)}}><img src={img7} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(18461,shopDetail)}}><img src={img8} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(80,shopDetail)}}><img src={img9} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(1806,shopDetail)}}><img src={img10} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(11412,shopDetail)}}><img src={img11} alt=""/></a></div>
                    </div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(3134,shopDetail)}}><img src={img12} alt=""/></a></div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(264,shopDetail)}}><img src={img13} alt=""/></a></div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(90,shopDetail)}}><img src={img14} alt=""/></a></div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(3789,shopDetail)}}><img src={img15} alt=""/></a></div>
                    <div className="clearfix">
                        <div className="box"><a onClick={() => {self.goToProductDetail(3036,shopDetail)}}><img src={img16} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(3140,shopDetail)}}><img src={img17} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(171,shopDetail)}}><img src={img18} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(542,shopDetail)}}><img src={img19} alt=""/></a></div>
                    </div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(2630,shopDetail)}}><img src={img20} alt=""/></a></div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(58355,shopDetail)}}><img src={img21} alt=""/></a></div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(58243,shopDetail)}}><img src={img22} alt=""/></a></div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(58308,shopDetail)}}><img src={img23} alt=""/></a></div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(58375,shopDetail)}}><img src={img24} alt=""/></a></div>
                    <div className="box-lg"><a onClick={() => {self.goToProductDetail(17689,shopDetail)}}><img src={img25} alt=""/></a></div>
                    <div className="clearfix">
                        <div className="box"><a onClick={() => {self.goToProductDetail(2598,shopDetail)}}><img src={img26} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(6652,shopDetail)}}><img src={img27} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(15993,shopDetail)}}><img src={img28} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(297,shopDetail)}}><img src={img29} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(4961,shopDetail)}}><img src={img30} alt=""/></a></div>
                        <div className="box"><a onClick={() => {self.goToProductDetail(10866,shopDetail)}}><img src={img31} alt=""/></a></div>
                    </div>
                </div>
                <Confirm />
            </div>
        )
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
            yearMetaphaseReceiveCoupons,
            showConfirm
        }, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(YearMetaphase);