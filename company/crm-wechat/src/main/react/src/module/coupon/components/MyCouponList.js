/**
 * @author  olx
 * @date 2019/5/17/017
 * 我的 优惠券 列表
 */
import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {} from "../style/coupon.css";
import {pageMyCoupon,changeType} from "../actions/myCouponListAction.js";
import {receiveCouponFromFriendAction} from "../../coupon/actions/couponDetailActions";
import * as types from "../constants/ActionTypes";
import giving from "../../../media/images/coupon/myCouponList/coupon-giving.png";
import newArrive from "../../../media/images/coupon/myCouponList/coupon-new-arrive.png";
import noEffect from "../../../media/images/coupon/myCouponList/coupon-no-effect.png";
import overdue from "../../../media/images/coupon/myCouponList/coupon-overdue.png";
import AutoLoadMore from "../../common/components/AutoLoadMore";
import {Link} from 'react-router-dom'

class coupon extends Component {

    state = {
        isShowMoreType: false,
    };

    componentWillMount() {
        document.title = '我的优惠券';
        let {myCouponList,myCouponListCurrentCouponType} = this.props.couponState;
        this.props.actions.pageMyCoupon(0,myCouponList.size,myCouponListCurrentCouponType,[]);
    }
    loadMoreFunc() {
        let {myCouponList,myCouponListCurrentCouponType} = this.props.couponState;
        this.props.actions.pageMyCoupon(myCouponList.page+1,myCouponList.size,myCouponListCurrentCouponType,myCouponList.content);
    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeCouponType(data){
        this.props.actions.changeType(data);
        let {myCouponList} = this.props.couponState;
        this.props.actions.pageMyCoupon(0,myCouponList.size,data,[]);

        if((data==="ONLINE"||data==="OFFLINE"||data==="UNUSED")&&this.state.isShowMoreType){
            this.changeIsShowMoreTypeLayer();
        }
    }
    changeIsShowMoreTypeLayer(){
        this.setState({isShowMoreType: !this.state.isShowMoreType,});
    }

    /**
     * 撤销优惠卷
     * */
    revokeCoupon(couponPermissionId){
        var self = this;
        this.props.actions.receiveCouponFromFriendAction(couponPermissionId,function () {
            window.successTip('撤销成功!');
            setTimeout(function () {
                self.changeCouponType('USED');
            },1000);
        })
    }

    render() {
        const actions = this.props.actions;
        const history = this.props.history;

        const {myCouponList,myCouponListCurrentCouponType} = this.props.couponState;
        const isHaveNextPage = myCouponList.size * (myCouponList.page + 1) < myCouponList.total;
        const  isNotEffect=myCouponListCurrentCouponType==="USED"||myCouponListCurrentCouponType==="INEFFECTIVE"
        return (


            <div className={"coupon"}>
                <div className="coupon-main">


                    <div className="wx-mask" style={{display: this.state.isShowMoreType ? "block" : "none"}}/>
                    <div className="filter-wrap">
                        <div className="filter-items">
                            <a  href="javascript:void(0)"  onClick={()=>{this.changeCouponType("ONLINE")}}  className={myCouponListCurrentCouponType==="ONLINE"||!myCouponListCurrentCouponType?"item cur  itemone" :"item itemone" }>线上券</a>
                            <a  href="javascript:void(0)"  onClick={()=>{this.changeCouponType("OFFLINE")}} className={myCouponListCurrentCouponType==="OFFLINE"?"item cur  itemone" :"item itemone" }>线下券</a>
                            <a  href="javascript:void(0)"  onClick={()=>{this.changeIsShowMoreTypeLayer()}}  className={myCouponListCurrentCouponType!==""&&myCouponListCurrentCouponType!=="ONLINE"&&myCouponListCurrentCouponType!=="OFFLINE"?"item cur  more" :"item more" }>
                                {!myCouponListCurrentCouponType||myCouponListCurrentCouponType==="ONLINE"||myCouponListCurrentCouponType==="OFFLINE"||myCouponListCurrentCouponType==="UNUSED"?"未使用":""}
                                {myCouponListCurrentCouponType==="USED"?"已使用":""}
                                {myCouponListCurrentCouponType==="INEFFECTIVE"?"已过期":""}
                            </a>
                        </div>
                        <div className="item-options" style={{display:this.state.isShowMoreType?"block":"none"}}>
                            <span onClick={()=>{this.changeCouponType("UNUSED"),this.changeIsShowMoreTypeLayer()}}  className={myCouponListCurrentCouponType==="UNUSED"?"item cur" :"item " } >未使用</span>
                            <span onClick={()=>{this.changeCouponType("USED"),this.changeIsShowMoreTypeLayer()}}  className={myCouponListCurrentCouponType==="USED"?"item cur" :"item " } >已使用</span>
                            <span onClick={()=>{this.changeCouponType("INEFFECTIVE"),this.changeIsShowMoreTypeLayer()}}  className={myCouponListCurrentCouponType==="INEFFECTIVE"?"item cur" :"item " } >已过期</span>
                        </div>
                    </div>

                    <div className="coupon-box">
                        <div className="inner">
                            {/*线上券*/}
                            <ul className="cp-ul" id={"myCoupon"}>
                                {
                                    myCouponList.content.length>0&&myCouponList.content.map(item=>{

                                        return(
                                            <li   className={isNotEffect?"list-item disabled":" list-item"}  key={item.couponPermissionId}>
                                                <div className="cell-hd">
                                                    {/* 满减 */}
                                                    {item.couponType === 'FULL_REDUCE' &&
                                                    <div className="cont">
                                                        <span>{item.couponAmountDouble}</span><em>元</em>
                                                        {item.isLimitedUse === 'N' ?
                                                            <p>无限制门槛</p> :
                                                            <p>订单满{item.orderFullAmountDouble}元减{item.couponAmountDouble}</p>}
                                                    </div>
                                                    }
                                                    {/*  打折 */}
                                                    {item.couponType === 'DISCOUNT' &&
                                                    <div className="cont">
                                                        <span>{item.couponDiscount}</span><em>折</em>
                                                        {item.isLimitedUse === 'N' ?
                                                            <p>无限制门槛</p> :
                                                            <p>订单满{item.orderFullAmountDouble}元打{item.couponDiscount}折</p>}
                                                    </div>
                                                    }
                                                </div>
                                                <div className="cell-bd">
                                                    <div className="bd-top">
                                                        <div className="title">
                                                            {item.applyProductType==="ALL_PRODUCTS"&&<span className="tag">全品类</span>}
                                                            {item.couponName}
                                                        </div>
                                                        <div className="validity">{item.effectiveBeginTimeString+"-"+item.effectiveEndTimeString}</div>
                                                    </div>
                                                    <div className="bd-bot">
                                                        {item.applyProductType==="ALL_PRODUCTS" && <div className="bot-lt">全场商品通用{item.isSupportGift==="Y"&& item.isUse === 'N' && item.remindState !== '已失效' && !(item.couponSource==='FRIEND_GIFT') && <span>￨可赠送</span>}</div>}
                                                        {item.applyProductType==="SPECIFIED_PRODUCTS"&&  <div className="bot-lt">指定商品{item.isSupportGift==="Y"&& item.isUse === 'N' && item.remindState !== '已失效' && !(item.couponSource==='FRIEND_GIFT') && <span>￨可赠送</span>}</div>}
                                                        {item.applyProductType==="EXCLUDE_PRODUCTS"&&<div className="bot-lt">排除商品{item.isSupportGift==="Y" && item.isUse === 'N' && item.remindState !== '已失效' && !(item.couponSource==='FRIEND_GIFT') && <span>￨可赠送</span>}</div>}
                                                        {/* 未使用 和 已失效 不显示详情按钮*/}
                                                        {item.isUse !== 'Y' && item.remindState !== '已失效' && <Link  to={"/myCoupon/detail/"+item.couponPermissionId+""} className="cp-dt">详情</Link>}

                                                    </div>
                                                    {!isNotEffect&&item.remindState!=="未生效"&&item.isOnline==="Y"&& <a  href="javascript:void(0)"  className="use-btn" onClick={()=>{history.push("/product/new/search/shop/"+item.couponId)}}>去使用</a>}

                                                    {item.remindState==="赠送中"&& item.isGift === 'N' && <a  href="javascript:void(0)"  className="cancel-btn" onClick={()=>{this.revokeCoupon(item.couponPermissionId)}}>撤销</a>}

                                                </div>
                                                <div className="state-box">
                                                    {item.remindState==="新到"&&<img src={newArrive} alt=""/>}
                                                    {item.remindState==="未生效"&&<img src={noEffect} alt=""/>}
                                                    {item.remindState==="快过期"&&<img src={overdue} alt=""/>}
                                                    {item.remindState==="赠送中"&&<img src={giving} alt=""/>}

                                                </div>
                                            </li>
                                        )
                                    })
                                }


                            </ul>
                            {/* 列表长度 大于 分页 加载分页  或者   列表长度=0 即 显示 暂无更多   */}
                             <AutoLoadMore container={'myCoupon'} isHaveNextPage={isHaveNextPage} loadMoreFunc={()=>this.loadMoreFunc()}/>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        couponState:store.couponState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({pageMyCoupon,receiveCouponFromFriendAction,changeType}, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(coupon);