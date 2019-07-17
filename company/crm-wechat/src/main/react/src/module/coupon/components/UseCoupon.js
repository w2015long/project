/**
 * 使用线下优惠卷
 * Created by liezihao on 2018/10.16
 */
// 引入react组件
import React, {Component} from 'react';
// 引入方法
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../style/useCoupon.css';
//引用条形码组件
import BarCode from '../../common/components/BarCode';
import {getCouponDetail, queryCouponUseSituation} from '../actions/useCouponAction';
//引入图片
import saomiao from "../../../media/images/saomiao.png";
import chenggon from "../../../media/images/chenggon2.png";


class ScanReceiveCoupon extends Component {
    state = {
        setIntervalFun: null,// 轮询方法
        failCall: false, // 是否请求失败
        failInfo: "该优惠券不存在或已被使用" // 失败原因
    };
    //在组件首次渲染之前调用，这时候DOM节点已经首次加载完成。整个生命周期只会执行一次
    componentWillMount() {
        document.title = '优惠券';
        this.props.actions.getCouponDetail(this.props.match.params.couponPermissionId, () => {
            this.failCallback()
        }, () => {
            this.couponIsEffectCallBack()
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.setIntervalFun);
    }
    // 请求失败时使用
    failCallback() {
        this.setState({failCall: true});
        this.closeInterval();
    }

    //回调优惠卷使用成功
    couponIsEffectCallBack() {
        let _this = this;
        let timeInterval = setInterval(function () {
            _this.props.actions.queryCouponUseSituation(_this.props.match.params.couponPermissionId, () => {
                _this.closeInterval()
            })
        }, 3000);
        this.setState({
            setIntervalFun: timeInterval
        });
    }

    // 关闭轮询请求
    closeInterval() {
        clearInterval(this.state.setIntervalFun);
    }

    render() {
        const {couponDetails,useResult} = this.props.useCouponReducerSate;

        console.log(this.state.failInfo);
        console.log(this.state.failCall);
        return (
            <div className="uec">
                <div className="ewm-coupon">

                    {/*Y代表过期*/}
                    {this.state.failCall ? <div className="cont">
                            <div className="ewm-text">{this.state.failInfo}</div>
                        </div>
                        :
                        useResult === 'Y' ? <div className="cont">
                        <div className="suc-icon"><img src={chenggon} alt="" /></div>
                        <div className="ewm-text">优惠券使用成功！</div>
                    </div>
                        :
                        couponDetails.isCouponExpire === 'Y'?  <h5>优惠卷已过期</h5>
                        :
                        <div className="cont">
                            <div className="txm-icon"><img src={saomiao} alt="" /></div>
                            <div className="ewm-text">请扫描条形码</div>
                            <div className="txm-box">{<BarCode />}</div>
                            <span>{couponDetails.couponCode}</span>
                        </div>
                    }



                    <div className="info">
                        <div className="dt">详情信息</div>
                        <div className="dd">
                            <p>{couponDetails.couponName}</p>
                            <p>优惠券面额：{couponDetails.couponAmountDouble}元</p>
                            {couponDetails.isLimitedUse === 'Y' ?
                                (<p>使用条件：订单满{couponDetails.orderFullAmountDouble}元</p>) : ( <p>使用条件：不限制使用</p> )
                            }
                            <p>有效日期：{couponDetails.effectiveBeginTimeString} 至 {couponDetails.effectiveEndTimeString}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store, ownProps) => {
    return {
        useCouponReducerSate :store.useCouponReducerSate
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getCouponDetail,
            queryCouponUseSituation
        }, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ScanReceiveCoupon);
