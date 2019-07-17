/**
 * 年会领卷
 * Created by liezihao on 2018/12/24
 */
// 引入react组件
import React, { Component } from 'react';
// 引入方法
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/yearMeetingReceive.css';
import {yearMeetingReceive} from '../actions/yearMeetingReceiveAction.js';
import {Link} from "react-router-dom";
import jkyf from "../../../media/images/jkyf_rq.jpg";
//定位
import {initJsSdk} from '../../common/actions/jssdkAction';

//引入图片
import Img from "../../common/components/Img";


class YearMeetingReceive extends Component {



    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        let self = this;
        document.title = '领取优惠券';
        initJsSdk(
            () => {
                self.getLocation();
            },
            () => {

            }
        );

    }

    getLocation() {
        let self = this;
        window.wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                let newMapLocation = res.longitude + "," + res.latitude;
                self.props.actions.yearMeetingReceive(self.props.match.params.couponId,newMapLocation);
            },
            cancel: function (res) {

            }
        });

    }


    render() {
        const {couponData,abnormal} = this.props.yearMeetingReceiveSate;
        return (
           <div className="scan">
               <div className="get-coupon">
                   <div className="mt">
                       {
                           couponData.isSeekFailed ==='Y' &&
                           <h5>
                               <p>定位失败</p>
                               <p>请检查定位服务是否开启</p>
                           </h5>
                       }
                       {/*不是会员 并且 还没领取微信会员卡 展示*/}
                       {
                           (couponData.memberIsLogin ==='N' || couponData.activationMemberCard ==='N') &&
                           <h5>
                               <p>请通过下面二维码关注</p>
                               <p>"金康药房云店"</p>
                               <p>激活会员卡，再扫码领取优惠券</p>
                           </h5>
                       }

                       {
                           couponData.memberIsLogin ==='Y' && couponData.activationMemberCard ==='Y' && abnormal !== true &&
                           <h5>{ couponData.isCouponNumber === 'N' ? '优惠卷已被抢光啦' :  couponData.memberAlreadyReceiveCoupon === 'Y' ? '该券领取数量超过领券限制,无法继续领取' :  couponData.isFieldWithin ==='Y' ? '恭喜您~获得优惠券' : '' }</h5>
                       }

                       {
                           couponData.isFieldWithin ==='N' && <h5>您不在年会范围以内</h5>
                       }

                       {
                           abnormal && <h5>领卷异常 请告知店员</h5>
                       }

                   </div>
                   {/*不是会员 并且 还没领取微信会员卡 展示*/}
                   { (couponData.memberIsLogin ==='N' || couponData.activationMemberCard ==='N') &&
                   <div className="mc"><img src={jkyf} height="220" width="220"/></div>
                   }

                   { couponData.isFieldWithin ==='Y' && couponData.memberIsLogin ==='Y' && couponData.activationMemberCard ==='Y' &&
                       <div className="coupon-box">
                       <div className="box-left">
                           <div className="cont">
                               <i>￥</i>
                               <span>{abnormal ? '0.00' :couponData.couponAmountDouble}</span>
                           </div>
                       </div>
                       <div className="box-right">
                           <div className="title">{couponData.couponName}</div>
                           {   abnormal ? '' :
                               couponData.isLimitedUse === 'Y' ?
                               (<div className="full">满<span>{couponData.orderFullAmountDouble}</span>可用</div>) : ( <div className="full">不限制使用</div>)
                           }
                           <div className="time">{abnormal ? '' : couponData.effectiveBeginTimeString+'-'+couponData.effectiveEndTimeString}</div>
                       </div>
                   </div>
                   }

               </div>
           </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        yearMeetingReceiveSate :store.yearMeetingReceiveSate
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            yearMeetingReceive
            }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(YearMeetingReceive);
