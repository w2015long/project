/**
 * 扫码领优惠券
 * Created by liezihao on 2018/10.16
 */
// 引入react组件
import React, { Component } from 'react';
// 引入方法
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/scanReceiveCoupon.css';
import {Link} from "react-router-dom";
import {scanReceiveCouponAction,recordCouponDataAction,emptyCouponDataAction} from '../actions/scanReceiveCouponAction';
import {generateMemberCardQrCode} from '../actions/scanReceiveCouponAction';
//引入图片
import Img from "../../common/components/Img";


class ScanReceiveCoupon extends Component {

    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        document.title = '领取优惠券';
        const {couponData,recordCouponData} = this.props.scanReceiveCouponReducerSate;
        if(recordCouponData === couponData){
            console.log("从上一页回退到本页不执行请求");
            return;
        }
        this.props.actions.scanReceiveCouponAction(this.props.match.params.couponId,()=>{this.getMemberCardQrCode()});
    }

    //销毁组件的时候调用
    componentWillUnmount(){
        const self= this;
        if( this.props.history.action ==="POP"){
            console.log("触发返回键执行清空couponData");
            self.props.actions.emptyCouponDataAction(false);
        }

    }

    //获取会员卡
    getMemberCardQrCode(){
       this.props.actions.generateMemberCardQrCode(this.props.match.params.callbackUrl);
    }


    /**
     * 记录优惠券数据
     */
    recordCouponData(couponData){
        this.props.actions.recordCouponDataAction(couponData);
    }

    render() {
        const {couponData,memberCard,abnormal} = this.props.scanReceiveCouponReducerSate;
         let startTimes = couponData.effectiveBeginTimeString === null ? "":couponData.effectiveBeginTimeString+" - ";
         let endTimes = couponData.effectiveEndTimeString === null ? "":couponData.effectiveEndTimeString;
         let time = startTimes + endTimes;
        return (
           <div className="scan">
               <div className="get-coupon">
                   <div className="mt">
                       <h5>{abnormal? "领卷异常 请告知店员" : couponData.isCouponNumber === 'N' ? '优惠卷已被抢光啦' :  couponData.memberAlreadyReceiveCoupon === 'Y' ? '该券领取数量超过领券限制,无法继续领取' :'恭喜您~获得优惠券'}</h5>
                   </div>
                   <div className="coupon-box">
                       <div className="box-left">
                           {
                               couponData.couponType === 'FULL_REDUCE' &&
                               <div className="cont">
                                   <i>￥</i>
                                   <span>{abnormal ? '0.00' :couponData.couponAmountDouble}</span>
                               </div>
                           }

                           {
                               couponData.couponType === 'DISCOUNT' &&
                               <div className="cont">
                                   <span>{abnormal ? '0.0' :couponData.couponDiscount}</span>
                                   <i>折</i>
                               </div>
                           }

                       </div>
                       <div className="box-right">
                           <div className="title">{couponData.couponName}</div>
                           {   abnormal ? '' :
                               couponData.isLimitedUse === 'Y' ?
                               (<div className="full">满<span>{couponData.orderFullAmountDouble}</span>可用</div>) : ( <div className="full">不限制使用</div>)
                           }
                           <div className="time">{abnormal ? '' : time}</div>
                       </div>
                   </div>
                   {/* 线上券 */}
                   {
                       couponData.memberAlreadyReceiveCoupon !== 'Y' && couponData.memberIsLogin === 'Y' && couponData.activationMemberCard === 'Y' && couponData.isCouponNumber === 'Y' && couponData.isOnline === 'Y' &&
                       <Link to={"/product/new/search/shop/"+couponData.couponId} ><span className="md-btn" onClick={()=>this.recordCouponData(couponData)}>立即使用</span></Link>
                   }
                   {/* 线下券 */}
                   {
                       couponData.memberAlreadyReceiveCoupon !== 'Y' && couponData.memberIsLogin === 'Y' && couponData.activationMemberCard === 'Y' && couponData.isCouponNumber === 'Y' && couponData.isOffline === 'Y' &&
                       <Link to={"/myCoupon/detail/"+couponData.couponPermissionId} ><span className="md-btn" onClick={()=>this.recordCouponData(couponData)}>立即使用</span></Link>
                   }
                   {
                       //领劵到达上限 和 已经登录
                       couponData.memberAlreadyReceiveCoupon === 'Y' &&  couponData.memberIsLogin === 'Y'  &&
                       <Link to={"/coupon/list"} ><span className="md-btn">查看我的优惠卷</span></Link>
                   }
                   {
                       couponData.memberIsLogin === 'N' &&
                       <div className="ewm">
                           <a href="javascript:void(0);"  className="ewm-box"><Img src={memberCard}/></a>
                           <span>亲~您还未登录！请<Link to="/member/memberLoginIn" className="regist_link">立即登录</Link></span>
                           <p>如无账号,请长按识别领取会员卡和账号 </p>
                       </div>
                   }
                   {
                       couponData.activationMemberCard === 'N' &&
                       <div className="ewm">
                           <a  className="ewm-box"><Img src={memberCard}/></a>
                           <span>亲~你需要激活会员卡才能使用优惠卷哦！</span>
                           <p>请长按识别领取会员卡</p>
                       </div>
                   }

               </div>
           </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        scanReceiveCouponReducerSate :store.scanReceiveCouponReducerSate
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            scanReceiveCouponAction,
            generateMemberCardQrCode,
            recordCouponDataAction,
            emptyCouponDataAction
            }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ScanReceiveCoupon);
